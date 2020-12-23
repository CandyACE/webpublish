import path from 'path';

const mimeType = {
    css: 'text/css',
    gif: 'image/git',
    html: 'text/html;charset=UTF-8',
    ico: 'image/x-icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'text/javascript;charset=UTF-8',
    json: 'application/json;charset=UTF-8',
    pdf: 'application/pdf',
    png: 'image/png',
    svg: 'image/svg+xml',
    tiff: 'image/tiff',
    txt: 'text/plain;charset=UTF-8',
    wav: 'audio/x-wav',
    wma: 'audio/x-ms-wma',
    wmv: 'video/x-ms-wmv',
    xml: 'text/xml;charset=UTF-8',
    swf: 'application/x-shockwave-flash',
    mp4: 'video/mp4'
}

export default (filePath) => {
    const ext = path
        .extname(filePath)
        .split('.')
        .pop()
        .toLowerCase();

    return ext && mimeType[ext] ? mimeType[ext] : mimeType['txt']
}