import AsyncLock from "async-lock";
import TaskBase from "./TaskBase";
import MBTiles from "@mapbox/mbtiles";
import stream from "stream"
import fs from 'fs';
import { dialog } from "electron";
import path from "path";
import FileTask from "./FileTask";
import logger from "../../Logger";
import showMapbox from "../../../helper/HtmlTemplate/Mapbox";
import showOpenLayers from "../../../helper/HtmlTemplate/OpenLayers";
import { MAP_ENGINE } from "../../../../shared/constants";

const asyncLock = new AsyncLock();

export default class MBTilesTask extends TaskBase {
    constructor(task) {
        super(task);
        var _this = this;
        _this.format = "";
        this._mbtiles = null;
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
                    _this.format = info.format;
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
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @param {TaskBase} task
     * @param {fs.Stats} stats
     */
    static async Action(req, res, task, stats) {
        asyncLock.acquire('fileTask-size-write', function () {
            ++task.useData
        })

        res.setHeader('Access-Control-Allow-Origin', "*")
        if (req.url.split('/').pop() === "getMap") {
            MBTilesTask.GetMapTemplete(req, res, task)
            return;
        } else if (req.url.split('/')[2] === 'static') {
            var task = {};
            task.path = path.join(__static, req.url.split('/').slice(3).join('/'));
            task.gzip = true;
            task.useData = 0;
            FileTask.Action(req, res, task)
            return;
        }
        MBTilesTask.GetTileRESTFul(req, res, task)
    }

    static GetMapTemplete(req, res, task) {
        task._mbtiles.getInfo(function (err, info) {
            let options = { info: info }
            options.info.tilesize = Number(info.tilesize || 256);
            options.ext = info.format;

            options.type = "raster"
            if (options.ext === "pbf") {
                options.type = "vector";
                options.info.tilesize = 512;
            }

            var htmlTemplete = '';

            var type = global.application.configManager.getSystemConfig("map-engine", MAP_ENGINE.MapBox);
            switch (type) {
                case MAP_ENGINE.OpenLayers:
                    htmlTemplete = showOpenLayers(options, req, res, task);
                    break;
                case MAP_ENGINE.MapBox:
                default:
                    htmlTemplete = showMapbox(options, req, res, task);
                    break;
            }

            res.end(htmlTemplete)
        })
    }

    /**
     * 
     * @param {*} req 
     * @param {http.ServerResponse} res 
     */
    static GetTileRESTFul(req, res, task) {
        var urlParam1 = req.url.split('.')
        var urlParam2 = urlParam1[0].split('/')
        var ext = urlParam1[1] || 'png'
        var z = urlParam2[2],
            x = urlParam2[3],
            y = urlParam2[4]

        task._mbtiles.getTile(z, x, y, function (err, data, headers) {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
                res.end("Tile rendering error: " + err)
                return;
            }
            res.setHeader('Content-Type', headers ? headers['Content-Type'] : "image/png")
            res.setHeader('Access-Control-Allow-Origin', "*")
            const bufferStream = new stream.PassThrough();
            bufferStream.end(data)
            bufferStream.pipe(res)
        })
    }

    Action(req, res, stats) {
        return MBTilesTask.Action(req, res, this, stats)
    }

    getUrl() {
        var format = this.format || 'png';
        return '{z}/{x}/{y}.' + format;
    }
}