export default class TaskManager {
  constructor(configManager) {
    this._configManager = configManager;
    this.taskList = []
    this.initTaskList();
  }

  initTaskList() {
    this.taskList = this._configManager.getSystemConfig('tasks', []);
  }

  addTask(task) {
    this.taskList.push(task);
    this._configManager.setSystemConfig('tasks', this.taskList);
    return this.taskList;
  }

  removeTask(task) {
    this.taskList.splice(this.taskList.indexOf(task), 1);
    this._configManager.setSystemConfig('tasks', this.taskList);
    return this.taskList;
  }
}