import http from 'http'

export default class TaskBase {
    constructor(task) {
        this.id = task.id;
        this.name = task.name;
        this.path = task.path;
        this.enable = task.enable;
        this.type = task.type;
        this.useData = task.useData || 0;
        this.totalData = task.totalData || 0;
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

    async Action(req, res, stats) {
        TaskBase.Action(req, res, this, stats)
    }

    getUrl() {
        return ""
    }

}

