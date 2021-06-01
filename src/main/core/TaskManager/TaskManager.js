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

  changeTaskOptions(task) {
    for (let i = 0; i < this.taskList.length; i++) {
      const item = this.taskList[i];
      if (item.gid == task.gid) {
        Object.assign(this.taskList[i], task)
        break;
      }
    }
    return this.taskList;
  }

  addTask(task) {
    this.taskList.unshift(task);
    // this.taskList.push(task);
    this._configManager.setSystemConfig('tasks', this.taskList);
    return this.taskList;
  }

  removeTask(task) {
    for (let i = 0; i < this.taskList.length; i++) {
      const item = this.taskList[i];
      if (item.gid == task.gid) {
        this.taskList.splice(i, 1);
        break;
      }
    }
    return this.taskList;
  }
}