import TaskBase from "./TaskBase";
import http from 'http'
import fs from 'fs'
import { promisify } from 'util'
import getMime from '../../../helper/mime'
import { FILE_STATUS } from '../../../../shared/constants'
import { basename } from 'path'
import AsyncLock from "async-lock";
import zlib from 'zlib'

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)
const asyncLock = new AsyncLock();

export default class FileTask extends TaskBase {

    setEnable(val) {
        var result = false;
        if (val) {
            try {
                fs.accessSync(this.path, fs.constants.F_OK);
                result = true;
            } catch (error) {
                result = false;

            }
        }
        this.enable = result;
        return this.enable;
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @param {TaskBase} taskInfo
     * @param {fs.Stats} stats
     */
    static async Action(req, res, taskInfo, stats) {
        var fileStats = stats
        if (!fileStats) {
            fileStats = await stat(taskInfo.path);
        }
        if (fileStats && fileStats.isFile()) {
            var mime = getMime(taskInfo.path);
            let encoding = req.headers['accept-encoding']
            asyncLock.acquire('fileTask-size-write', function () {
                taskInfo.useData += fileStats.size
            })

            let rs = fs.createReadStream(taskInfo.path)
            res.statusCode = 200;
            res.setHeader('Content-Type', mime);
            res.setHeader('Access-Control-Allow-Origin', "*")

            let compress, compressType;

            // 支持 gzip 使用 gzip 压缩，支持 deflate 使用 deflate 压缩
            if (taskInfo.gzip && encoding && encoding.match(/\bgzip\b/)) {
                compress = zlib.createGzip();
                compressType = "gzip";
            } else if (taskInfo.gzip && encoding && encoding.match(/\bdeflate\b/)) {
                compress = zlib.createDeflate();
                compressType = "deflate";
            } else {
                // 否则直接返回可读流
                return rs.pipe(res);
            }

            // 将压缩流返回并设置响应头
            res.setHeader("Content-Encoding", compressType);
            rs.pipe(compress).pipe(res);
        }
    }

    Action(req, res, stats) {
        return FileTask.Action(req, res, this, stats)
    }

    getUrl() {
        return FileTask.getUrl(this.path)
    }

    static getUrl(path) {
        return basename(path);
    }
}
