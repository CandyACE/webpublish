import AsyncLock from "async-lock";
import TaskBase from "./TaskBase";
import fs from 'fs';
import { Request, Response } from 'express'
import { MAP_ENGINE, TASK_STATUS } from "../../../../shared/constants";
import zlib from "zlib";
import { createServer } from "../../../utils/serviceUtil";
import sq3 from "sqlite3";
import logger from "../../Logger";

const sqlite3 = sq3.verbose();

const asyncLock = new AsyncLock();

export default class CtlTask extends TaskBase {
  constructor(task) {
    super(task);
    var _this = this;
    this._db = null;
    try {
      fs.accessSync(this.path, fs.constants.F_OK);
      this._db = new sqlite3.Database(this.path.replaceAll("\\", "/"), function (error) {
        if (!error) {
          logger.log(`${_this.path} is connected`)
          _this.enable = true
        } else {
          logger.error(error)
        }
      })
    } catch (e) {
      logger.error(e)
    }
  }

  createStyleJSON(titleJSON) {

  }

  setEnable(val) {
    var result = false;
    if (val) {
      try {
        console.log(this._db)
        fs.accessSync(this.path, fs.constants.F_OK);
        result = this._db != null;
      } catch (error) {
        result = false;
      }
    }
    this.enable = result;
    return this.enable;
  }

  destroy() {
    if (this._db && this._db)
      this._db.close();
  }

  static InitRouter() {
    const app = createServer()

    app.get('*', function (req, res, next) {
      if (!req.task || req.task.type !== TASK_STATUS.CLT) {
        return next('route')
      }
      req.url = req.originalUrl.replace('/' + req.task.id, '')
      next();
    })

    // app.get('/map-preview', async function (req, res, next) {
    //   CtlTask.GetMapTemplete(req, res, req.task)
    // })

    app.get('*', async function (req, res, next) {
      asyncLock.acquire('CLT-size-write', function () {
        ++req.task.useData
      })
      const task = { ...req.task };
      CtlTask.GetTileRESTFul(req, res, task)
      return;
    })

    return app;
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {TaskBase} task 
   */
  static GetMapTemplete(req, res, task) {
    var type = global.application.configManager.getSystemConfig("map-engine", MAP_ENGINE.MapBox);
    res.render(type, {
      task,
      req,
      is_vector: task.tileJSON.tileType === "vector"
    })
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {TaskBase} task
   */
  static GetTileRESTFul(req, res, task) {
    const path = req.url.slice(1, req.url.length);
    const sqlStr = `select tile,type from tiles where path='${path}'`
    task._db.get(sqlStr, (err, row) => {
      if (!err) {
        if (row) {
          let data = null;
          let isGzipped = true;

          if (row.type === 'json') {
            res.setHeader('Content-Type', 'application/json;charset=UTF-8')
          } else {
            res.setHeader('Content-Type', 'application/octet-stream')
          }

          if (!isGzipped && !task.gzip) {
            data = zlib.unzipSync(row.tile)
          }

          if (!isGzipped && task.gzip && encoding && encoding.match(/\bgzip\b/)) {
            data = zlib.gzipSync(row.tile)
            compressType = "gzip";
          } else if (!isGzipped && task.gzip && encoding && encoding.match(/\bdeflate\b/)) {
            data = zlib.deflateSync(row.tile)
            compressType = "deflate";
          } else {
            if (isGzipped) {
              res.setHeader("Content-Encoding", "gzip");
            }
            return res.status(200).send(row.tile)
          }

          // 将压缩流返回并设置响应头
          res.setHeader("Content-Encoding", compressType);
          return res.status(200).send(data)
        } else {
          return res.status(404).send();
        }
      } else {
        return res.status(500).send(err);
      }
    })
  }

  getUrl() {
    return 'tileset.json';
  }
}