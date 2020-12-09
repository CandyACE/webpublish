import downloadEngine from '../src/main/core/download';

var download = new downloadEngine({
    url: "http://ts.wish3d.com/tangweitian/update/pro/fullversion/DevelopBeta.zip",
    savePath: "C:\\Users\\RAZER\\Downloads\\test.zip"
})

download.on('progress', function (progressData) {
    let percentage = Math.round(progressData.percentage) + '%';
    console.log(`${percentage} ${that.convertSize(progressData.transferred)}/${that.convertSize(progressData.length)} ${that.convertSize(progressData.speed)}/s`);
})
download.start();