import { EventEmitter } from 'events'
import ConfigManager from './core/ConfigManager';
import ServerManager from './core/ServerManager';
import TaskManager from './core/TaskManager';

export default class Application extends EventEmitter {
    constructor() {
        super();
        this.isReady = false;
        this.init();
        this.serverManager.start();
    }

    init() {
        this.configManager = new ConfigManager();
        this.taskManager = new TaskManager(this.configManager)
        this.serverManager = new ServerManager(this);
        this.isReady = true;
    }

    exit() {
        this.serverManager.stop();
    }
}