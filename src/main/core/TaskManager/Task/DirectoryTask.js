import http from 'http'
import fs from 'fs'
import { promisify } from 'util'
import TaskBase from './TaskBase'
import { FILE_STATUS } from '../../../../shared/constants'
import path from 'path'
import DirectoryHTML from '../../../helper/DirectoryHtml'
import FileTask from './FileTask'

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)

export default class DirectoryTask extends TaskBase {
    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @param {Object} taskInfo
     * @param {fs.Stats} stats
     */
    static async Action(req, res, taskInfo, stats) {
        var paramPath = decodeURIComponent(req.url).replace('/' + taskInfo.id, '')
        var filePath = path.join(taskInfo.path, paramPath)
        filePath = filePath.split('?')[0]
        const stats1 = await stat(filePath)
        if (stats1.isFile()) {
            // 地址应该传入拼接后的地址
            var info = { ...taskInfo, path: filePath }
            FileTask.Action(req, res, info, stats1)
            taskInfo.useData += stats1.size;
        } else if (stats1.isDirectory()) {
            var isRoot = filePath.replaceAll('\\', '') === taskInfo.path.replaceAll('\\', '')
            DirectoryHTML(filePath, res, { isRoot: isRoot })
        }
    }

    Action(req, res, stats) {
        return DirectoryTask.Action(req, res, this, stats)
    }

    getUrl() {
        return TaskBase.getUrl(this.path)
    }
}
