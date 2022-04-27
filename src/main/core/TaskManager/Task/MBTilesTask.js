import AsyncLock from "async-lock";
import TaskBase from "./TaskBase";
import MBTiles from "@mapbox/mbtiles";
import fs from 'fs';
import path from 'path'
import { Request, Response } from 'express'
import logger from "../../Logger";
import { MAP_ENGINE } from "../../../../shared/constants";
import getMime from '../../../helper/mime'
import zlib from "zlib";
import { fixTileJSONCenter } from "../../../utils/tiles"
import FileTask from "./FileTask";
import VectorTile from "@mapbox/vector-tile/lib/vectortile";
import Pbf from "pbf";
import { clone } from "lodash";
import sphericalmercator from "@mapbox/sphericalmercator"

const mercator = new sphericalmercator();

const asyncLock = new AsyncLock();

export default class MBTilesTask extends TaskBase {
    constructor(task) {
        super(task);
        var _this = this;
        this._mbtiles = null;
        this.tileJSON = {}
        try {
            fs.accessSync(this.path, fs.constants.F_OK);
            new MBTiles(encodeURIComponent(this.path.replaceAll("\\", "/")), function (err, mbtiles) {
                if (err) {
                    logger.warn(err, _this);
                    task.enable = false;
                }
                _this._mbtiles = mbtiles;
                _this.setEnable(Boolean(task.enable))
                mbtiles.getInfo(function (err, info) {
                    if (err) {
                        _this.enable = false;
                    }
                    _this.tileJSON['id'] = _this.id;
                    _this.tileJSON['name'] = _this.name;
                    _this.tileJSON['tilesize'] = 256;

                    info.format === "pbf" ? _this.tileJSON['tileType'] = "vector" : _this.tileJSON['tileType'] = "raster";

                    Object.assign(_this.tileJSON, info);

                    _this.tileJSON['tilejson'] = '2.0.0';
                    delete _this.tileJSON['filesize'];
                    delete _this.tileJSON['mtime'];
                    delete _this.tileJSON['scheme'];

                    fixTileJSONCenter(_this.tileJSON);

                    logger.info(_this.tileJSON)
                    let center = _this.tileJSON.center;
                    _this.tileJSON['viewer_hash'] = `#${center[2]}/${center[1].toFixed(5)}/${center[0].toFixed(5)}`
                    const centerPx = mercator.px([center[0], center[1]], center[2]);
                    _this.thumbnail = `${center[2]}/${Math.floor(centerPx[0] / 256)}/${Math.floor(centerPx[1] / 256)}.png`
                })
            })
        } catch (e) {

        }
    }

    setEnable(val) {
        var result = false;
        if (val) {
            try {
                console.log(this._mbtiles)
                fs.accessSync(this.path, fs.constants.F_OK);
                result = this._mbtiles != null;
            } catch (error) {
                result = false;
            }
        }
        this.enable = result;
        return this.enable;
    }

    destroy() {
        if (this._mbtiles && this._mbtiles._db)
            this._mbtiles._db.close();
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {TaskBase} task
     * @param {fs.Stats} stats
     */
    static async Action(req, res, task, stats) {
        asyncLock.acquire('fileTask-size-write', function () {
            ++task.useData
        })

        res.setHeader('Access-Control-Allow-Origin', "*")
        if (req.path.split('/').pop() === "map-preview") {
            MBTilesTask.GetMapTemplete(req, res, task)
            return;
        } else if (req.path.split('/')[1] === 'metadata.json') {
            const info = clone(task.tileJSON);
            info.tiles = [`http://${req.headers.host}/${task.id}/{z}/{x}/{y}.${task.tileJSON.format}`]
            return res.send(info)
        }
        else if (req.path.split('/')[1] === 'style.json') {
            // const style = require(__static,'style/')
        } else if (req.path.split('/')[1] === 'static') {
            var task = {};
            task.path = path.join(__static, req.url.split('/').slice(2).join('/'));
            task.gzip = true;
            task.useData = 0;
            FileTask.Action(req, res, task)
            return;
        }
        MBTilesTask.GetTileRESTFul(req, res, task)
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {TaskBase} task 
     */
    static GetMapTemplete(req, res, task) {
        var type = global.application.configManager.getSystemConfig("map-engine", MAP_ENGINE.MapBox);
        res.render(type, {
            task,
            req,
            is_vector: task.tileJSON.tileType === "vector"
        })
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {TaskBase} task
     */
    static GetTileRESTFul(req, res, task) {
        var urlParam1 = req.path.split('.')
        var urlParam2 = urlParam1[0].split('/')
        var format = urlParam1[1] || 'png'
        var z = urlParam2[1] | 0,
            x = urlParam2[2] | 0,
            y = urlParam2[3] | 0

        if (z < task.tileJSON.minzoom || 0 || x < 0 || y < 0 ||
            z > task.tileJSON.maxzoom ||
            x >= Math.pow(2, z) || y >= Math.pow(2, z)) {
            return res.status(404).send('Out of bounds');
        }

        task._mbtiles.getTile(z, x, y, function (err, data, headers) {
            let isGzipped = false;
            if (err) {
                if (/does not exist/.test(err.message)) {
                    return res.status(404).send();
                } else {
                    return res.status(500).send(err.message);
                }
            }

            if (data == null) {
                return res.status(404).send('Not found');
            }

            res.setHeader('Access-Control-Allow-Origin', "*")

            if (task.tileJSON.format === "pbf") {
                isGzipped = data.slice(0, 2).indexOf(
                    Buffer.from([0x1f, 0x8b])) === 0;

                if (format === 'pbf') {
                    res.setHeader('Content-Type', "application/x-protobuf")
                } else if (format === 'geojson') {
                    res.setHeader('Content-Type', 'application/json')

                    if (isGzipped) {
                        data = zlib.unzipSync(data)
                        isGzipped = false;
                    }

                    const tile = new VectorTile(new Pbf(data))
                    const geojson = {
                        "type": "FeatureCollection",
                        "features": []
                    }
                    for (let layerName in tile.layers) {
                        const layer = tile.layers[layerName];
                        for (let i = 0; i < layer.length; i++) {
                            const feature = layer.feature(i);
                            const featureGeoJSON = feature.toGeoJSON(x, y, z);
                            featureGeoJSON.properties.layer = layerName;
                            geojson.features.push(featureGeoJSON);
                        }
                    }
                    data = JSON.stringify(geojson)
                }
            } else {
                res.setHeader('Content-Type', getMime(format))
            }

            delete headers['ETag']
            let encoding = req.headers['accept-encoding']
            let compressType;

            if (!isGzipped && !task.gzip) {
                data = zlib.unzipSync(data)
            }

            if (!isGzipped && task.gzip && encoding && encoding.match(/\bgzip\b/)) {
                data = zlib.gzipSync(data)
                compressType = "gzip";
            } else if (!isGzipped && task.gzip && encoding && encoding.match(/\bdeflate\b/)) {
                data = zlib.deflateSync(data)
                compressType = "deflate";
            } else {
                if (isGzipped) {
                    res.setHeader("Content-Encoding", "gzip");
                }
                return res.status(200).send(data)
            }

            // 将压缩流返回并设置响应头
            res.setHeader("Content-Encoding", compressType);
            return res.status(200).send(data)
        })
    }

    Action(req, res, stats) {
        return MBTilesTask.Action(req, res, this, stats)
    }

    getUrl() {
        var format = this.tileJSON.format || 'png';
        return '{z}/{x}/{y}.' + format;
    }
}