import { remote } from 'electron'
import { FILE_STATUS } from '../../shared/constants'
import is from 'electron-is'
import { cloneDeep } from 'lodash';

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
    return new Promise((resolve) => {
      var data = cloneDeep(application.taskManager.taskList)
      resolve(data)
    })
  }

  addTask(info) {

  }

  removeTask(task) {
    return application.taskManager.removeTask(task);
  }
}