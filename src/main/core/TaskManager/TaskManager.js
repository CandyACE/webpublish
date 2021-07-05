import Vue from 'vue'
import { Event } from '../../../shared/twtools';
import logger from '../Logger';
import getTask from './Task/Index';

export default class TaskManager {
  constructor(configManager) {
    this._configManager = configManager;
    this.taskList = []
    this.taskListChanged = new Event()
    this.initTaskList();
  }

  initTaskList() {
    var list = this._configManager.getSystemConfig('tasks', []);
    list.forEach(item => {
      var task = getTask(item.type);
      this.taskList.push(new task(item))
    })
    this.taskListChanged.raiseEvent()
  }

  changeTaskOptions(task) {
    for (let i = 0; i < this.taskList.length; i++) {
      const item = this.taskList[i];
      if (item.gid == task.gid) {
        var newTask = { ...item, ...task }
        if (item.type !== task.type) {
          newTask = JSON.parse(JSON.stringify({ ...item, ...task }))
          logger.log('new Type')
          var newTaskObject = getTask(task.type)
          newTask = new newTaskObject(newTask)
          this.taskList[i] = newTask
          this.taskListChanged.raiseEvent()
          break
        }
        Object.assign(this.taskList[i], newTask)
        this.taskListChanged.raiseEvent()
        break;
      }

    }
    return this.taskList;
  }

  addTask(options) {
    this.taskListChanged.raiseEvent()
    var task = getTask(options.type)
    var item = new task(options);
    this.taskList.unshift(item);
    return this.taskList;
  }

  removeTask(task) {
    for (let i = 0; i < this.taskList.length; i++) {
      const item = this.taskList[i];
      if (item.gid == task.gid) {
        this.taskListChanged.raiseEvent()
        this.taskList.splice(i, 1);
        break;
      }
    }
    return this.taskList;
  }
}