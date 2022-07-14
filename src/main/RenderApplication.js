import ServerManager from "./core/ServerManager";
import TaskManager from "./core/TaskManager/TaskManager";
import Application from "./Application";

const remote = require('@electron/remote')

export default class RenderApplication {
    constructor() {
        this.init()
    }

    init() {
        /**
         * @type {Application}
         */
        const application = remote.getGlobal("application");
        application.on("exit", () => {
            this.stop()
        })
        this.configManager = application.configManager;
        this.taskManager = new TaskManager(this.configManager)
        this.serverManager = new ServerManager(this);
        // this.webSocketManager = new WebSocketManager(this);
    }

    stop() {
        this.serverManager.stop()
        this.taskManager.saveTask()
    }
}