export default function showMapbox(options, req, res, task) {
    let setting = {
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
                    "type": options.type,
                    'tiles': [
                        `http://${req.headers.host}/${task.id}/{z}/{x}/{y}.${options.ext}`
                    ],
                    'tileSize': options.info.tilesize
                }
            },
            "layers": [{
                "id": "webpublish-tiles",
                "type": options.type,
                "source": "webpublish-tiles",
                "source-layer": "dist-layer",
                "minzoom": options.info.minzoom,
                "maxzoom": 23
            }]
        }, // stylesheet location
        center: [options.info.center[0], options.info.center[1]], // starting position [lng, lat]
        zoom: options.info.center[2] // starting zoom
    }



    let htmlTemplete = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Map Preview</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="static/lib/mapbox/mapbox-gl.css"/>
      <script src="static/lib/mapbox/mapbox-gl.js"></script>
      <link rel="stylesheet" href="static/lib/infoBox/controls.css"/>
      <script src="static/lib/infoBox/controls.js"></script>
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
          <strong id="zoom_level">Level: ${options.info.center[2]} </strong>|
          Design by <a href="http://webpublish.tangweitian.cn"><strong>WebPublish</strong></a> |
          ${options.info.description}
      </div>
    
      <script>
    
        var mbInfo = ${JSON.stringify(options.info)};
    
        var map = new mapboxgl.Map(${JSON.stringify(setting)});
    
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

    return htmlTemplete;
}