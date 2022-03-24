import { remote } from 'electron'
import { TASK_STATUS } from '../../shared/constants'
import is from 'electron-is'
import { cloneDeep } from 'lodash';
import { changeKeysToCamelCase, changeKeysToKebabCase } from '../../shared/utils';

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

    result = changeKeysToCamelCase(result)
    this.config = result;
  }

  loadConfigFromNativeStore() {
    const systemConfig = application.configManager.getSystemConfig();
    return systemConfig;
  }

  loadConfigFromLocalStorage() {
    return {}
  }

  fetchOptions() {
    return new Promise((resolve) => {
      this.loadConfig()
      resolve(this.config)
    })
  }

  saveOptions(params = {}) {
    const kebabParams = changeKeysToKebabCase(params)
    return this.saveOptionsToStore(kebabParams)
  }

  saveOptionsToStore(params = {}) {
    application.configManager.setSystemConfig(params)
  }

  // fetchTaskList() {
  //   return new Promise((resolve) => {
  //     var data = cloneDeep(application.taskManager.taskList)
  //     resolve(data)
  //   })
  // }

  // addTask(options) {
  //   return application.taskManager.addTask(options)
  // }

  // changeTaskOptions(task) {
  //   return application.taskManager.changeTaskOptions(task)
  // }

  // removeTask(task) {
  //   return application.taskManager.removeTask(task);
  // }

  getPort() {
    return application.configManager.getSystemConfig("port", "9090")
  }
}