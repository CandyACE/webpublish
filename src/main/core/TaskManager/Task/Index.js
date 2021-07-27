import { FILE_STATUS } from "../../../../shared/constants";
import DirectoryTask from "./DirectoryTask";
import FileTask from "./FileTask";
import TaskBase from "./TaskBase";

const Tasks = {
    [FILE_STATUS.FILE]: FileTask,
    [FILE_STATUS.DIRECTORY]: DirectoryTask,
}

function getTask(type) {
    return Tasks[type] || TaskBase
}

export default getTask