import Vue from 'vue'
import { Event } from '../../../shared/twtools';
import logger from '../Logger';
import getTask from './Task/Index';
import TaskBase from './Task/TaskBase';

export default class TaskManager {
  constructor(configManager) {
    this._configManager = configManager;
    /**
     * @type {TaskBase[]}
     */
    this.taskList = [];
    this.selectTaskList = [];
    this.searchKey = null;
    this.taskListChanged = new Event()
    this.searchKeyChanged = new Event()
    this.initTaskList();
  }

  initTaskList() {
    var list = this._configManager.getSystemConfig('tasks', []);
    list.forEach(item => {
      var task = getTask(item.type);
      var newTask = new task(item)
      this.taskList.push(newTask)
      this.selectTaskList.push(newTask)
    })
    this.taskListChanged.raiseEvent()

    setInterval(() => {
      this.saveTask()
    }, 5000);
  }

  saveTask() {
    this._configManager.setSystemConfig('tasks', this.taskList)
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
    this.updateSelectTaskList(null, true)
  }

  addTask(options) {
    var task = getTask(options.type)
    var item = new task(options);
    this.taskList.unshift(item);
    this.taskListChanged.raiseEvent()
    this.updateSelectTaskList(null, true)
    return this.taskList;
  }

  removeTask(task) {
    for (let i = 0; i < this.taskList.length; i++) {
      const item = this.taskList[i];
      if (item.gid == task.gid) {
        item.destroy();
        this.taskList.splice(i, 1);
        this.taskListChanged.raiseEvent()
        break;
      }
    }
    this.updateSelectTaskList(null, true)
    return this.taskList;
  }

  /**
   * 更新选择列表
   * @param {*} val 
   * @param {*} isReflash 
   * @returns 
   */
  updateSelectTaskList(val, isReflash, type = 'all') {
    this.selectTaskList.splice(0, this.selectTaskList.length)

    if (!isReflash) {
      this.searchKey = val;
      this.searchKeyChanged.raiseEvent(val)
    }

    let currentList = this.taskList.filter(f => (type != 'all' ? type == f.type : true));

    if (this.searchKey == "" || this.searchKey == null) {
      this.selectTaskList.push(...currentList)
      return;
    }
    const list = currentList.filter(f => {
      return f.id.toLocaleLowerCase().indexOf(this.searchKey.toLocaleLowerCase()) != -1 ||
        f.name.toLocaleLowerCase().indexOf(this.searchKey.toLocaleLowerCase()) != -1 ||
        f.path.toLocaleLowerCase().indexOf(this.searchKey.toLocaleLowerCase()) != -1
    })

    this.selectTaskList.push(...list)
  }
}