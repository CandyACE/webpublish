import http from 'http'

export default class TaskBase {
    constructor(task) {
        this._id = task.id;
        this._name = task.name;
        this._path = task.path;
        this._enable = task.enable;
        this._type = task.type;
        this._useData = task.useData || 0;
        this._totalData = task.totalData || 0;
    }

    get id() {
        return this._id
    }

    set id(value) {
        this._id = value;
    }

    get name() {
        return this._name
    }

    set name(value) {
        this._name = value;
    }

    get path() {
        return this._path
    }

    set path(value) {
        this._path = value;
    }

    get enable() {
        return this._enable
    }

    set enable(value) {
        this._enable = value;
    }

    get type() {
        return this._type
    }

    set type(value) {
        this._type = value;
    }

    get useData() {
        return this._useData
    }

    set useData(value) {
        this._useData = value;
    }

    get totalData() {
        return this._totalData
    }

    set totalData(value) {
        this._totalData = value;
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

