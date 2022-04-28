import { TASK_STATUS } from "../../../../shared/constants";
import DirectoryTask from "./DirectoryTask";
import FileTask from "./FileTask";
import TaskBase from "./TaskBase";
import MBTilesTask from "./MBTilesTask";
import ProxyTask from "./ProxyTask";

export const Tasks = {
    [TASK_STATUS.FILE]: FileTask,
    [TASK_STATUS.DIRECTORY]: DirectoryTask,
    [TASK_STATUS.MBTILES]: MBTilesTask,
    [TASK_STATUS.PROXY]: ProxyTask
}

export function getTask(type) {
    return Tasks[type] || TaskBase
}