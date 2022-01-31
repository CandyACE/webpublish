import template from '../common/DirTemplate'
import fs from 'fs'
import Batch from 'batch'
import path from 'path'
import escapehtml from 'escape-html'
import mime from 'mime-types'

var cache = {}

/**
 * 
 * @param {String} dirPath 文件夹
 * @param {boolean} isRoot 
 */
async function DirectoryHTML(dirPath, res, options) {
    var isRoot = options.isRoot || false;
    var hidden = options.hidden;
    var res = res;

    let dirTemplate = template;
    dirTemplate += `\r\n<script>start("${dirPath.replaceAll('\\', '\\\\')}");</script>\r\n`
    if (!isRoot) {
        dirTemplate += `<script>onHasParentDirectory();</script>`
    }

    var files = fs.readdirSync(dirPath)
    if (!hidden) files = removeHidden(files)
    files.sort(fileSort)

    stat(dirPath, files, function (err, fileList) {
        if (err) {
            console.error(err)
            return res.end(err)
        }
        fileList.sort(fileSort)


        var style = ''
        var styleList = []

        for (let i = 0; i < fileList.length; i++) {
            const tempFile = fileList[i];

            var isDir = tempFile.stat && tempFile.stat.isDirectory()

            var data = tempFile.stat && tempFile.name !== '..'
                ? tempFile.stat.mtime.toLocaleDateString() + ' ' + tempFile.stat.mtime.toLocaleTimeString() : ''
            var size = tempFile.stat && !isDir ? tempFile.stat.size : ''

            var icon = iconLookup(tempFile.name, isDir)

            if (styleList.indexOf(icon.className) == -1) {
                styleList.push(icon.className)
                style += '.' + icon.className + "\n" + ' {\n ' + 'background: url("' + loadImage(icon.fileName) + '") no-repeat;' + '\n}\n'
            }

            dirTemplate += `<script>addRow("${tempFile.name}","${encodeURIComponent(escapehtml(tempFile.name))}",${tempFile.stat.isFile() ? 0 : 1},"${icon.className}",${tempFile.stat.size},"${escapehtml(renderSize(size))}",${tempFile.stat.mtimeMs},"${data}");</script>` + "\r\n"
        }

        dirTemplate += '<style>' + style + '</style>'


        return res.end(dirTemplate)
    })

}

function renderSize(value) {
    if (null == value || value == '') {
        return "0 B";
    }
    var unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    var index = 0;
    var srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2);//保留的小数位数
    return size + " " + unitArr[index];
}

/**
 * Filter "hidden" `files`, aka files
 * beginning with a `.`.
 *
 * @param {Array} files
 * @return {Array}
 * @api private
 */
function removeHidden(files) {
    return files.filter(function (file) {
        return file[0] !== '.'
    })
}

/**
 * Sort function for with directories first.
 */

function fileSort(a, b) {
    // sort ".." to the top
    if (a.name === '..' || b.name === '..') {
        return a.name === b.name ? 0
            : a.name === '..' ? -1 : 1;
    }

    return Number(b.stat && b.stat.isDirectory()) - Number(a.stat && a.stat.isDirectory()) ||
        String(a.name).toLocaleLowerCase().localeCompare(String(b.name).toLocaleLowerCase());
}

/**
 * Stat all files and return array of objects in the form
 * `{ name, stat }`.
 *
 * @param {Array} files
 * @return {Array}
 * @api private
 */
function stat(dir, files, cb) {
    var batch = new Batch();

    batch.concurrency(10);

    files.forEach(function (file) {
        batch.push(function (done) {
            fs.stat(path.join(dir, file), function (err, stat) {
                if (err && err.code !== 'ENOENT') return done(err);

                // pass ENOENT as null stat, not error
                done(null, {
                    name: file,
                    stat: stat || null
                })
            });
        });
    });

    batch.end(cb);
}

function iconLookup(filename, isDir) {
    if (isDir) {
        return { className: 'icon-directory', fileName: icons.folder }
    }

    var ext = path.extname(filename);

    // try by extension
    if (icons[ext]) {
        return {
            className: 'icon-' + ext.substring(1),
            fileName: icons[ext]
        };
    }

    var mimetype = mime.lookup(ext);

    // default if no mime type
    if (mimetype === false) {
        return {
            className: 'icon-default',
            fileName: icons.default
        };
    }

    // try by mime type
    if (icons[mimetype]) {
        return {
            className: 'icon-' + mimetype.replace('/', '-').replace('+', '_'),
            fileName: icons[mimetype]
        };
    }

    var suffix = mimetype.split('+')[1];

    if (suffix && icons['+' + suffix]) {
        return {
            className: 'icon-' + suffix,
            fileName: icons['+' + suffix]
        };
    }

    var type = mimetype.split('/')[0];

    // try by type only
    if (icons[type]) {
        return {
            className: 'icon-' + type,
            fileName: icons[type]
        };
    }

    return {
        className: 'icon-default',
        fileName: icons.default
    };
}

function loadImage(fileName) {
    if (cache[fileName]) return cache[fileName]
    return cache[fileName] = require('../common/icons/' + fileName);
}

export default DirectoryHTML;

/**
 * Icon map.
 */

var icons = {
    // base icons
    'default': 'page_white.png',
    'folder': 'folder.png',

    // generic mime type icons
    'font': 'font.png',
    'image': 'image.png',
    'text': 'page_white_text.png',
    'video': 'film.png',

    // generic mime suffix icons
    '+json': 'page_white_code.png',
    '+xml': 'page_white_code.png',
    '+zip': 'box.png',

    // specific mime type icons
    'application/javascript': 'page_white_code_red.png',
    'application/json': 'page_white_code.png',
    'application/msword': 'page_white_word.png',
    'application/pdf': 'page_white_acrobat.png',
    'application/postscript': 'page_white_vector.png',
    'application/rtf': 'page_white_word.png',
    'application/vnd.ms-excel': 'page_white_excel.png',
    'application/vnd.ms-powerpoint': 'page_white_powerpoint.png',
    'application/vnd.oasis.opendocument.presentation': 'page_white_powerpoint.png',
    'application/vnd.oasis.opendocument.spreadsheet': 'page_white_excel.png',
    'application/vnd.oasis.opendocument.text': 'page_white_word.png',
    'application/x-7z-compressed': 'box.png',
    'application/x-sh': 'application_xp_terminal.png',
    'application/x-msaccess': 'page_white_database.png',
    'application/x-shockwave-flash': 'page_white_flash.png',
    'application/x-sql': 'page_white_database.png',
    'application/x-tar': 'box.png',
    'application/x-xz': 'box.png',
    'application/xml': 'page_white_code.png',
    'application/zip': 'box.png',
    'image/svg+xml': 'page_white_vector.png',
    'text/css': 'page_white_code.png',
    'text/html': 'page_white_code.png',
    'text/less': 'page_white_code.png',

    // other, extension-specific icons
    '.accdb': 'page_white_database.png',
    '.apk': 'box.png',
    '.app': 'application_xp.png',
    '.as': 'page_white_actionscript.png',
    '.asp': 'page_white_code.png',
    '.aspx': 'page_white_code.png',
    '.bat': 'application_xp_terminal.png',
    '.bz2': 'box.png',
    '.c': 'page_white_c.png',
    '.cab': 'box.png',
    '.cfm': 'page_white_coldfusion.png',
    '.clj': 'page_white_code.png',
    '.cc': 'page_white_cplusplus.png',
    '.cgi': 'application_xp_terminal.png',
    '.cpp': 'page_white_cplusplus.png',
    '.cs': 'page_white_csharp.png',
    '.db': 'page_white_database.png',
    '.dbf': 'page_white_database.png',
    '.deb': 'box.png',
    '.dll': 'page_white_gear.png',
    '.dmg': 'drive.png',
    '.docx': 'page_white_word.png',
    '.erb': 'page_white_ruby.png',
    '.exe': 'application_xp.png',
    '.fnt': 'font.png',
    '.gam': 'controller.png',
    '.gz': 'box.png',
    '.h': 'page_white_h.png',
    '.ini': 'page_white_gear.png',
    '.iso': 'cd.png',
    '.jar': 'box.png',
    '.java': 'page_white_cup.png',
    '.jsp': 'page_white_cup.png',
    '.lua': 'page_white_code.png',
    '.lz': 'box.png',
    '.lzma': 'box.png',
    '.m': 'page_white_code.png',
    '.map': 'map.png',
    '.msi': 'box.png',
    '.mv4': 'film.png',
    '.pdb': 'page_white_database.png',
    '.php': 'page_white_php.png',
    '.pl': 'page_white_code.png',
    '.pkg': 'box.png',
    '.pptx': 'page_white_powerpoint.png',
    '.psd': 'page_white_picture.png',
    '.py': 'page_white_code.png',
    '.rar': 'box.png',
    '.rb': 'page_white_ruby.png',
    '.rm': 'film.png',
    '.rom': 'controller.png',
    '.rpm': 'box.png',
    '.sass': 'page_white_code.png',
    '.sav': 'controller.png',
    '.scss': 'page_white_code.png',
    '.srt': 'page_white_text.png',
    '.tbz2': 'box.png',
    '.tgz': 'box.png',
    '.tlz': 'box.png',
    '.vb': 'page_white_code.png',
    '.vbs': 'page_white_code.png',
    '.xcf': 'page_white_picture.png',
    '.xlsx': 'page_white_excel.png',
    '.yaws': 'page_white_code.png'
};
