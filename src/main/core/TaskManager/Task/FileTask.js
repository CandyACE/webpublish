import TaskBase from "./TaskBase";
import http from 'http'
import fs from 'fs'
import { promisify } from 'util'
import getMime from '../../../helper/mime'
import { FILE_STATUS } from '../../../../shared/constants'
import { basename } from 'path'
import AsyncLock from "async-lock";
import Vue from "vue";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)
const asyncLock = new AsyncLock();

export default class FileTask extends TaskBase {

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @param {Object} taskInfo
     * @param {fs.Stats} stats
     */
    static async Action(req, res, taskInfo, stats) {
        if ((stats && stats.isFile()) || (await stat(taskInfo.path)).isFile()) {
            var mime = getMime(taskInfo.path);
            asyncLock.acquire('fileTask-size-write', function () {
                taskInfo.useData += stats.size
            })
            res.statusCode = 200;
            res.setHeader('Content-Type', mime);
            res.setHeader('Access-Control-Allow-Origin', "*")
            fs.createReadStream(taskInfo.path).pipe(res);
        }
    }

    getUrl() {
        return FileTask.getUrl(this.path)
    }

    static getUrl(path) {
        return basename(path);
    }
}
