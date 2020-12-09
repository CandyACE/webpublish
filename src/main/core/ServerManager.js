import http from 'http'
import path from 'path'
import fs from 'fs'
import { FILE_STATUS } from "@shared/constants";
import { promisify } from 'util'
import { getMime } from './common'
import electron from 'electron';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)

export default class ServerManager {
  constructor(application) {
    this._app = application;
    /**
     * @type {http.Server}
     */
    this._server = undefined;
  }

  stop() {
    if (this._server) {
      this._server.close();
      this._server = undefined;
    }
  }

  start() {
    var _this = this;
    if (this._server) {
      this._server.close();
      this._server = undefined;
    }

    this._server = new http.createServer(function (req, res) {
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
      }
      _this._readFiles(req, res, task)
    })

    this._server.on('error', function () {
      electron.remote.dialog.showErrorBox('端口占用', port + " 端口被占用")
    })

    var address = this._app.configManager.getSystemConfig('address', '127.0.0.1');
    var port = this._app.configManager.getSystemConfig('port', "9090");
    this._server.listen(port, address, () => {
      console.log('server on ' + address + ':' + port)
    })
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
    var filePath = ""
    try {
      if (task.type === FILE_STATUS.FILE) {
        // 如果是文件，就直接找到这个文件发出去
        filePath = task.path;
      } else {
        var paramPath = req.url.replace('/' + task.id, '');
        filePath = path.join(task.path, paramPath);
      }
      const stats = await stat(filePath);
      if (stats.isFile()) {
        var mime = getMime(path.extname(filePath))
        res.statusCode = 200;
        res.setHeader('Content-Type', mime);
        fs.createReadStream(filePath).pipe(res);//以流的方式来读取文件
      } else if (stats.isDirectory()) {//如果是文件夹，拿到文件列表
        //将readdir方法也promise化
        const files = await readdir(filePath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(files.join(','));//返回所有的文件名
      }
    } catch (error) {
      console.log(error)
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
      res.end(`${filePath} is not a directory or file.`)
      return;
    }
  }
}