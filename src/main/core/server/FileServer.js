import http from 'http'
import path from 'path'
import fs from 'fs'
import { FILE_STATUS } from "@shared/constants";
import { promisify } from 'util'
import getMime from '../../helper/mime'
import electron from 'electron';
import ServerBase from './serverBase';
import DirectoryHTML from '../../helper/DirectoryHtml';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)

export default class FileServer extends ServerBase {
  constructor(manager) {
    super(manager);
  }

  start() {
    var _this = this;
    this.stop();

    this._server = new http.createServer(async function (req, res, next) {
      if (!req.url) {
        _this._error(res, 'error url')
        return;
      }
      // 获取 id
      var param = req.url.split('/');
      var id = param[1];
      if (!id) {
        _this._error(res, 'id is require')
        return;
      }
      var task = _this._app.taskManager.taskList.find(f => { return f.id == id });
      if (!task) {
        _this._error(res, "no Found this id")
        return;
      }
      _this._readFiles(req, res, task, next)
    })

    this._server.on('error', function () {
      electron.remote.dialog.showErrorBox('端口占用', port + " 端口被占用")
    })

    // var address = this._app.configManager.getSystemConfig('address', '127.0.0.1');
    var port = this._app.configManager.getSystemConfig('port', "9090");
    this._server.listen(port, () => {
      // global.vue.$msg.success(`服务启动成功，端口：${port}`);
    })
  }

  stop() {
    if (this._server) {
      this._server.close();
      this._server = undefined;
    }
  }

  _error(res, message) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
    res.end(message)
  }

  /**
   * 
   * @param {http.IncomingMessage} req 
   * @param {http.ServerResponse} res 
   * @param {*} task 
   */
  async _readFiles(req, res, task) {
    var filePath = "", paramPath = ""
    try {
      if (task.type === FILE_STATUS.FILE) {
        // 如果是文件，就直接找到这个文件发出去
        filePath = task.path;
      } else {
        paramPath = decodeURIComponent(req.url).replace('/' + task.id, '');
        filePath = path.join(task.path, paramPath);
        filePath = filePath.split('?')[0];
      }
      const stats = await stat(filePath);
      if (stats.isFile()) {
        var mime = getMime(filePath);
        res.statusCode = 200;
        res.setHeader('Content-Type', mime);
        res.setHeader('Access-Control-Allow-Origin', "*")
        fs.createReadStream(filePath).pipe(res);//以流的方式来读取文件
      } else if (stats.isDirectory()) {//如果是文件夹，拿到文件列表
        var isRoot = filePath.replaceAll('\\', '') === task.path.replaceAll('\\', '')
        DirectoryHTML(filePath, res, { isRoot: isRoot })
        // //将readdir方法也promise化
        // const files = await readdir(filePath);
        // res.statusCode = 200;
        // res.setHeader('Access-Control-Allow-Origin', "*")
        // // res.setHeader('Content-Type', 'text/plain');
        // // res.end(files.join('\r\n'));//返回所有的文件名
        // res.setHeader('Content-Type', 'text/html;charset=UTF-8')

        // var isRoot = filePath.replaceAll('\\', '') !== task.path.replaceAll('\\', '')
        // var fileScript = !isRoot ? "" : '<a href="' + req.url + '/../' + '">../</a><br/>'

        // for (let i = 0; i < files.length; i++) {
        //   const file = files[i];
        //   let tempFilename = path.join(filePath, file)
        //   let tempFileStat = await stat(tempFilename)
        //   if (tempFileStat.isFile()) {
        //     fileScript += '\r\n<a href="' + req.url + '\\' + file + '">' + file + '</a><br/>'
        //   } else {
        //     fileScript += '\r\n<a href="' + req.url + '\\' + file + '">' + file + '\\' + '</a><br/>'
        //   }
        // }

        // var html = `
        // <!DOCTYPE html>
        // <html>
        // <head>
        //   <title>`+ filePath.replace(task.path, '') + `</title>
        // </head>
        //   <body>
        //     `+ fileScript + `
        //   </body>
        // </html>
        // `
        // res.end(html)
      }
    } catch (error) {
      console.error(error)
      console.log(`${filePath} is not a directory or file.`)
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
      res.end(`${filePath} is not a directory or file.`)
      return;
    }
  }
}