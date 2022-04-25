import { guid } from '../twtools'
import { TASK_STATUS } from '../constants'

export class AddTaskInfo {
    constructor() {
        this.name = ""
        this.path = ""
        this.type = TASK_STATUS.DIRECTORY
        this.uid = guid()
        this.showFileTypeSelection = false
        this.disenableDirectoryView = false
    }
}