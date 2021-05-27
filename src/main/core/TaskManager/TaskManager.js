import Vue from 'vue'
import getTask from './Task/Index';

export default class TaskManager {
  constructor(configManager) {
    this._configManager = configManager;
    this.taskList = []
    this.initTaskList();
  }

  initTaskList() {
    var list = this._configManager.getSystemConfig('tasks', []);
    list.forEach(item => {
      var task = getTask(item.type);
      this.taskList.push(new task(item))
    })
  }

  setTask(index, newValue) {
    Vue.set(this.taskList, index, newValue)
    this._configManager.setSystemConfig('tasks', this.taskList)
    return this.taskList
  }

  addTask(task) {
    this.taskList.unshift(task);
    // this.taskList.push(task);
    this._configManager.setSystemConfig('tasks', this.taskList);
    return this.taskList;
  }

  removeTask(task) {
    this.taskList.splice(this.taskList.indexOf(task), 1);
    this._configManager.setSystemConfig('tasks', this.taskList);
    return this.taskList;
  }
}