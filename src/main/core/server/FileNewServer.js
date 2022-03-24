import ServerBase from "./serverBase";
import { Express } from 'express'
import path from 'path'
import fs from 'fs'
import { TASK_STATUS } from "@shared/constants";
import { promisify } from 'util'
import getMime from '../../helper/mime'
import electron from 'electron';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)
const express = require('express')
const serveIndex = require('serve-index')

export default class FileNewServer extends ServerBase {
    constructor(manager) {
        super(manager)
    }

    start() {
        var _this = this;
        this.stop()

        return new Promise((resolve, reject) => {
            /**
             * @type {Express}
             */
            this._server = express()
            this._server.use('/:id/', async function (req, res) {
                let id = req.params.id;
                if (!id) {
                    _this._error(res, 'id is require')
                    return;
                }
                var task = _this._app.taskManager.taskList.find(f => { return f.id == id });
                if (!task) {
                    _this._error(res, "no Found this id")
                    return;
                }
                _this._readFiles(req, res, task)
            })

            this._server.on('error', () => {
                reject(this.i18n.t('app.port-exist', { port }))
            })

            var port = this._app.configManager.getSystemConfig('port', "9090");
            this._server.listen(port, () => {
                resolve();
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
   * @param {Request<ParamsDictionary, any, any, QueryString.ParsedQs, Record<string, any>>} req 
   * @param {Response<any, Record<string, any>, number>} res 
   * @param {*} task 
   */
    async _readFiles(req, res, task) {
        var done = function () {
            res.end();
        }
        var filePath = "", paramPath = ""
        try {
            if (task.type === TASK_STATUS.FILE) {
                // 如果是文件，就直接找到这个文件发出去
                filePath = task.path;
            } else {
                filePath = path.join(task.path, req.path);
                filePath = filePath.split('?')[0];
            }
            const stats = await stat(filePath);
            if (stats.isFile()) {
                var mime = getMime(filePath);
                res.statusCode = 200;
                res.setHeader('Content-Type', mime);
                res.setHeader('Access-Control-Allow-Origin', "*")
                res.sendFile(filePath)
            } else if (stats.isDirectory()) {//如果是文件夹，拿到文件列表
                var serve = serveIndex(filePath + "\\", { icons: true })
                serve(req, res, done)
                //将readdir方法也promise化
                // const files = await readdir(filePath);
                // res.statusCode = 200;
                // res.setHeader('Access-Control-Allow-Origin', "*")
                // // res.setHeader('Content-Type', 'text/plain');
                // // res.end(files.join('\r\n'));//返回所有的文件名
                // res.setHeader('Content-Type', 'text/html;charset=UTF-8')
                // var isRoot = filePath.replaceAll('\\', '') !== task.path.replaceAll('\\', '')
                // var fileScript = !isRoot ? "" : '<a href="' + req.url + '/../' + '">../</a><br/>'

                // for (let i = 0; i < files.length; i++) {
                //     const file = files[i];
                //     let tempFilename = path.join(filePath, file)
                //     let tempFileStat = await stat(tempFilename)
                //     if (tempFileStat.isFile()) {
                //         fileScript += '\r\n<a href="' + req.url + '\\' + file + '">' + file + '</a><br/>'
                //     } else {
                //         fileScript += '\r\n<a href="' + req.url + '\\' + file + '">' + file + '\\' + '</a><br/>'
                //     }
                // }

                //         var html = `
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
                //         res.end(html)
            }
        } catch (error) {
            console.log(error)
            console.log(`${filePath} is not a directory or file.`)
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
            res.end(`${filePath} is not a directory or file.`)
            return;
        }
    }
}