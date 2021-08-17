import http from 'http'
import { guid } from '../../../../shared/twtools'

export default class TaskBase {
    constructor(task) {
        this.gid = task.gid || task.id || guid();
        this.id = task.id;
        this.name = task.name;
        this.path = task.path;
        this.enable = false;
        this.setEnable(Boolean(task.enable));
        this.gzip = Boolean(task.gzip);
        if (task.gzip === undefined) {
            this.gzip = true;
        }
        this.type = task.type;
        this.useData = Number(task.useData) || 0;
        this.limitData = Number(task.limitData) || 0;
    }

    setEnable(val) {
        this.enable = val;
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @param {Object} taskInfo
     * @param {fs.Stats} stats
     */
    static async Action(req, res, taskInfo, stats) {

    }

    Action(req, res, stats) {
        return TaskBase.Action(req, res, this, stats)
    }

    static getUrl(path) {
        return ""
    }

    getUrl() {
        return TaskBase.getUrl(this.path)
    }

    check() {
        var result = {
            next: true,
            message: "",
            code: 200
        }
        if (this.enable == false) {
            result.next = false;
            result.code = 500
            result.message = JSON.stringify({
                taskId: this.id,
                message: `任务 [${this.id}] 已经关闭`
            })
            return result;
        }

        if (this.limitData !== 0 && this.useData >= this.limitData) {
            result.next = false;
            result.code = 500
            result.message = JSON.stringify({
                taskId: this.id,
                message: `任务 [${this.id}] 已经超出流量限制`
            })
            return result;
        }

        return result
    }
}