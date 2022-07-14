import http from 'http'
import fs from 'fs'
import { promisify } from 'util'
import TaskBase from './TaskBase'
import { TASK_STATUS } from '../../../../shared/constants'
import path from 'path'
import DirectoryHTML from '../../../helper/DirectoryHtml'
import FileTask from './FileTask'
import { createServer } from '../../../utils/serviceUtil'

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat)
const exists = promisify(fs.exists)

export default class DirectoryTask extends TaskBase {

    constructor(task) {
        super(task);
        this.disenableDirectoryView = task.disenableDirectoryView;
    }

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
     * @param {Object} taskInfo
     * @param {fs.Stats} stats
     */
    static async Action(req, res, taskInfo, stats) {
        var paramPath = decodeURIComponent(req.originalUrl).replace('/' + taskInfo.id, '')
        var filePath = path.join(taskInfo.path, paramPath)
        filePath = filePath.split('?')[0]
        try {
            const stats1 = await stat(filePath)
            if (stats1.isFile()) {
                // 地址应该传入拼接后的地址
                var info = { ...taskInfo, path: filePath }
                FileTask.Action(req, res, info, stats1)
                taskInfo.useData += stats1.size;
            } else if (stats1.isDirectory()) {
                if (!taskInfo.disenableDirectoryView) {
                    var isRoot = filePath.replaceAll('\\', '') === taskInfo.path.replaceAll('\\', '')
                    DirectoryHTML(filePath, res, { isRoot: isRoot })
                } else {
                    res.end("This Task disenable directory view.")
                }
            }
        } catch (error) {
            res.statusCode = 404
            res.end("this path is not exist")
        }
    }

    static InitRouter() {
        const app = createServer()

        app.get('*', function (req, res, next) {
            if (!req.task || req.task.type !== TASK_STATUS.DIRECTORY) {
                return next('route')
            }

            DirectoryTask.Action(req, res, req.task);
        })

        return app;
    }

    getUrl() {
        return TaskBase.getUrl(this.path)
    }
}
