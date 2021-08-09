import ServerManager from "./core/ServerManager";
import TaskManager from "./core/TaskManager/TaskManager";
import { remote } from 'electron'

export default class RenderApplication {
    constructor() {
        this.init()
    }

    init() {
        const application = remote.getGlobal("application");
        application.on("exit", () => {
            this.stop()
        })
        this.configManager = application.configManager;
        this.taskManager = new TaskManager(this.configManager)
        this.serverManager = new ServerManager(this);
    }

    stop() {
        this.serverManager.stop()
        this.taskManager.saveTask()
    }
}