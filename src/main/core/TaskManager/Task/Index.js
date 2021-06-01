import { FILE_STATUS } from "../../../../shared/constants";
import DirectoryTask from "./DirectoryTask";
import FileTask from "./FileTask";
import MBTilesTask from "./MBTilesTask";
import TaskBase from "./TaskBase";

const Tasks = {
    [FILE_STATUS.FILE]: FileTask,
    [FILE_STATUS.DIRECTORY]: DirectoryTask,
    [FILE_STATUS.MBTILES]: MBTilesTask
}

function getTask(type) {
    return Tasks[type] || TaskBase
}

export default getTask