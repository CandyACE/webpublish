import TaskBase from "./TaskBase";
import http from 'http'
import fs from 'fs'
import { promisify } from 'util'
import getMime from '../../../helper/mime'
import { FILE_STATUS } from '../../../../shared/constants'
import { basename } from 'path'

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)

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
            taskInfo.useData += stats.size
            
            console.log(taskInfo)
            res.statusCode = 200;
            res.setHeader('Content-Type', mime);
            res.setHeader('Access-Control-Allow-Origin', "*")
            fs.createReadStream(taskInfo.path).pipe(res);
        }
    }

    async Action(req, res, stats) {
        FileTask.Action(req, res, this, stats)
    }

    getUrl() {
        return basename(this.path);
    }
}