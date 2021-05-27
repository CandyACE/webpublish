import { remote } from 'electron'
import { FILE_STATUS } from '../../shared/constants'
import is from 'electron-is'

const application = remote.getGlobal('application')

export default class Api {
  constructor(options = {}) {
    this.options = options;

    this.init()
  }

  init() {
    this.loadConfig()
  }

  loadConfig() {
    let result = is.renderer()
      ? this.loadConfigFromNativeStore()
      : this.loadConfigFromLocalStorage()

    this.config = result;
  }

  loadConfigFromNativeStore() {
    const systemConfig = application.configManager.getSystemConfig();
    return systemConfig;
  }

  loadConfigFromLocalStorage() {
    return {}
  }

  fetchTaskList() {
    return application.taskManager.taskList;
  }

  addTask(info) {

  }

  removeTask(task) {
    return application.taskManager.removeTask(task);
  }
}