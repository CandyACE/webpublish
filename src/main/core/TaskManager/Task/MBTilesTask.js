import AsyncLock from "async-lock";
import TaskBase from "./TaskBase";

const asyncLock = new AsyncLock();

export default class MBTilesTask extends TaskBase {

    static async Action(req, res, task, stats) {
        asyncLock.acquire('fileTask-size-write', function () {
            ++task.useData
        })
        res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
        res.end(JSON.stringify({
            task: task,
            info: "this is mbtiles",
            message: `${task.path} is not a directory or file.`
        }))
    }

    Action(req, res, stats) {
        return MBTilesTask.Action(req, res, this, stats)
    }

    getUrl() {
        return TaskBase.getUrl(this.path)
    }
}