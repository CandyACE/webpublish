import ServerBase from './ServerBase';
import logger from '../Logger';
import express from 'express'
import { Tasks } from '../TaskManager/Task/Index'
import { createServer } from '../../utils/serviceUtil';

export default class MainServer extends ServerBase {
  constructor(manager) {
    super(manager);
  }

  start() {
    var _this = this;
    this.stop();

    return new Promise((resolve, reject) => {
      try {
        /**
         * @type {express.Express}
         */
        this._server = createServer()

        this._server.get('*', function (req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', "*")
          next();
        });
        this._server.use("/:id/", async function (req, res, next) {
          try {
            let id = req.params.id;
            if (!id) {
              return res.status(404).end('id is require.');
            }
            let task = _this._app.taskManager.taskList.find(f => f.id == id);
            if (!task) {
              return res.status(404).end('Not Found This ID.');
            }

            // ReadFile
            let check = task.check();
            if (!check.next) {
              return res.status(check.code).end(check.message);
            }

            req["task"] = task;

            return next();
          } catch (error) {
            logger.error(`[MainServer] ${filePath} is not a directory or file.`, error)
            res.status(404).end(JSON.stringify({
              task: task,
              message: `${filePath} is not a directory or file.`
            }))
            next(error)
            return;
          }
        })

        for (const task in Tasks) {
          this._server.use("/:id/", Tasks[task].InitRouter())
        }

        var port = this._app.configManager.getSystemConfig('port', "9090");

        this._server.on('error', function () {
          reject(this.i18n.t('app.port-exist', { port }))
        })
        this._server.listen(port, () => {
          resolve()
        })

      } catch (error) {
        console.log('MainServer', error)
      }
    })

  }

  stop() {
    if (this._server) {
      this._server.shutdown();
      this._server = undefined;
    }
  }

  _error(res, message) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
    res.end(message)
  }
}