import AsyncLock from "async-lock";
import TaskBase from "./TaskBase";
import MBTiles from "@mapbox/mbtiles";
import stream from "stream"
import fs from 'fs';
import { dialog } from "electron";
import path from "path";
import FileTask from "./FileTask";
import logger from "../../Logger";

const asyncLock = new AsyncLock();

export default class MBTilesTask extends TaskBase {
    constructor(task) {
        super(task);
        var _this = this;
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
                    _this.customProperty['format'] = info.format;
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
            let center = info.center;
            let minzoom = info.minzoom;
            let maxzoom = info.maxzoom;
            let ext = info.format;
            let htmlTemplete = `
<!DOCTYPE html>
<html>
<head>
  <title>Map Preview</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="static/lib/mapbox/mapbox-gl.css"/>
  <script src="static/lib/mapbox/mapbox-gl.js"></script>
  <style type="text/css">
  #map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .mapbox-attribution-container {
        bottom: 0;
        right: 0;
        position: absolute;
        display: block;
        margin: 0;
        background-color: hsla(0, 0%, 100%, .5);
        color: #333;
        font: 12px/20px Helvetica Neue, Arial, Helvetica, sans-serif;
        padding: 0 5px;
    }
  </style>
</head>
<body>
  <div id="map"></div>
    <div class="mapbox-attribution-container">
        <strong id="zoom_level">Level: ${center[2]} </strong>|
        Design by <a href="http://webpublish.tangweitian.cn"><strong>WebPublish</strong></a>
    </div>
  <script>

      var map = new mapboxgl.Map({
        container: 'map', // container id
        style: {
            "version": 8,
            "sources": {
                "osm-tiles": {
                    "type": "raster",
                    'tiles': [
                        "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    ],
                    'tileSize': 256
                },
                "webpublish-tiles": {
                    "type": "raster",
                    'tiles': [
                        'http://127.0.0.1:${req.headers.host.split(':').pop()}/${task.id}/{z}/{x}/{y}.${ext}'
                    ],
                    'tileSize': 256
                }
            },
            "layers": [{
                "id": "webpublish-tiles",
                "type": "raster",
                "source": "webpublish-tiles",
                "minzoom": ${minzoom},
                "maxzoom": 23
            }]
        }, // stylesheet location
        center: [ ${center[0]}, ${center[1]}], // starting position [lng, lat]
        zoom: ${center[2]} // starting zoom
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    const scale = new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'imperial'
    });
    map.addControl(scale);
    scale.setUnit('metric');

    map.on('zoom', () => {
        document.getElementById('zoom_level').innerHTML = "Level: " + Math.floor(map.getZoom()) + " ";
    })
  </script>
</body>
</html>
        `
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
        var format = this.customProperty['format'] || 'png';
        return '{z}/{x}/{y}.' + format;
    }
}