import http from 'http'
import fs from 'fs'
import { promisify } from 'util'
import electron from 'electron';
import ServerBase from './serverBase';
import getTask from '../TaskManager/Task/Index';

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
      try {
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

        var port = this._app.configManager.getSystemConfig('port', "9090");

        this._server.on('error', function () {
          reject(port + " 端口被占用")
        })

        this._server.listen(port, () => {
          resolve()
        })
      } catch (error) {
        console.log('FileServer', error)
      }
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
      var check = task.check();
      console.log(check)
      if (!check.next) {
        res.statusCode = check.code;
        res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
        res.end(check.message)
        return;
      }

      task.Action(req, res).then().catch(error => {
        console.error(error)
        console.log(`${filePath} is not a directory or file.`)
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
        res.end(JSON.stringify({
          task: task,
          message: `${filePath} is not a directory or file.`
        }))
        return;
      })
    } catch (error) {
      console.error(error)
      console.log(`${filePath} is not a directory or file.`)
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
      res.end(JSON.stringify({
        task: task,
        message: `${filePath} is not a directory or file.`
      }))
      return;
    }
  }
}