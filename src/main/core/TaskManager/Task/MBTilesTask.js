import TaskBase from "./TaskBase";

export default class MBTilesTask extends TaskBase{
    getUrl() {
        return TaskBase.getUrl(this.path)
    }
}