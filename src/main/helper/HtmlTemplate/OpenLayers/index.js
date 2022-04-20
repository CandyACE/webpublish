export default function showOpenLayers(options, req, res, task) {

    let htmlTemplete = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="static/lib/openlayers/ol.js"></script>
    <link rel="stylesheet" href="static/lib/openlayers/ol.css">
    <link rel="stylesheet" href="static/lib/infoBox/controls.css"/>
    <script src="static/lib/infoBox/controls.js"></script>
    <style>
        head,
        body,
        html,
        div {
            padding: 0;
            margin: 0;
        }

        .map {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    </style>
</head>

<body>
    <div id="map" class="map"></div>
</body>

<script>

    var mbInfo = ${JSON.stringify(options.info)};

    const attribution = new ol.control.Attribution({
        collapsible: false
    })
    
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://${req.headers.host}/${task.id}/{z}/{x}/{y}.${options.ext}',
                    attributions:' <strong id="zoom_level">Level: ${options.info.center[2]} </strong>|Design by <a href="http://webpublish.tangweitian.cn"><strong>WebPublish</strong></a>|${options.info.description}'
                })
            })
        ],
        controls: ol.control.defaults({ attribution: false }).extend([attribution]),
        view: new ol.View({
            center: ol.proj.fromLonLat([${options.info.center[0]}, ${options.info.center[1]}]),
            zoom: ${options.info.center[2]}
        })
    })

    map.on("moveend",function(e){
        var zoom = map.getView().getZoom();
        var div = document.getElementById('zoom_level');
        div.innerHTML = "Level: "+Math.floor(zoom)+" "
    })
</script>

</html>
            `

    return htmlTemplete;
}