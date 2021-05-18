import Vue from 'vue'
import { FILE_STATUS } from "@shared/constants";
import mbTiles from '@mapbox/mbtiles'

export default class TaskManager {
  constructor(configManager) {
    this._configManager = configManager;
    this.taskList = []
    this.initTaskList();
  }

  initTaskList() {
    var list = this._configManager.getSystemConfig('tasks', []);
    list.forEach(item => {
      item.editing = false;
      if (!item.name) {
        item.name = item.path.split('\\').pop()
      }
      this.startMbTiles(item)
    })
    this.taskList = list
  }

  startMbTiles(task) {
    if (task.type !== FILE_STATUS.MBTILES) {
      return;
    }
    new mbTiles(task.path, function (err, mbObject) {
      if (err) {
        return global.Vue.$msg.error(err);
      }
      task.mbtiles = mbObject
    })
  }

  setTask(index, newValue) {
    Vue.set(this.taskList, index, newValue)
    this._configManager.setSystemConfig('tasks', this.taskList)
    return this.taskList
  }

  addTask(task) {
    this.startMbTiles(task)
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