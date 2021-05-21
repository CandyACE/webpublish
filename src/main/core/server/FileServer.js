import http from 'http'
import fs from 'fs'
import { promisify } from 'util'
import electron from 'electron';
import ServerBase from './serverBase';
import Tasks from '../TaskManager/Task/Index';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)

export default class FileServer extends ServerBase {
  constructor(manager) {
    super(manager);
  }

  start() {
    var _this = this;
    this.stop();

    return new Promise((resolve, reject) => {
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
        reject(port + " 端口被占用")
      })

      // var address = this._app.configManager.getSystemConfig('address', '127.0.0.1');
      var port = this._app.configManager.getSystemConfig('port', "9090");
      this._server.listen(port, () => {
        // global.vue.$msg.success(`服务启动成功，端口：${port}`);
        resolve()
      })
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
    var filePath = task.path
    try {
      Tasks[task.type].Action(req, res, task)
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