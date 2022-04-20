import { ADD_TASK_TYPE } from "../../../shared/constants";

const state = {
  aboutPanelVisible: false,
  howtousePanelVisible: false,
  addTaskVisible: false,
  addTaskType: ADD_TASK_TYPE.DEFAULT,
  addTaskFiles: [],
  addTaskUrl: '',
  addTaskOptions: {}
}

const getters = {}

const mutations = {
  CHANGE_HOWTOUSE_PANEL_VISIBLE(state, visbile) {
    state.howtousePanelVisible = visbile;
  },
  CHANGE_ABOUT_PANEL_VISIBLE(state, visible) {
    state.aboutPanelVisible = visible;
  },
  CHANGE_ADD_TASK_VISIBLE(state, visbile) {
    state.addTaskVisible = visbile
  },
  CHANGE_ADD_TASK_TYPE(state, taskType) {
    state.addTaskType = taskType
  },
  CHANGE_ADD_TASK_URL(state, url) {
    state.addTaskUrl = url
  },
  CHANGE_ADD_TASK_OPTIONS(state, options) {
    state.addTaskOptions = { ...options }
  },
  CHANGE_ADD_TASK_FILES(state, fileList) {
    state.addTaskFiles = [...fileList]
  }
}

const actions = {
  showHowtousePanel({ commit }) {
    commit('CHANGE_HOWTOUSE_PANEL_VISIBLE', true);
  },
  hideHowtousePanel({ commit }) {
    commit('CHANGE_HOWTOUSE_PANEL_VISIBLE', false)
  },
  showAboutPanel({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', true)
  },
  hideAboutPanel({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', false)
  },
  showAddTaskDialog({ commit }, taskType = ADD_TASK_TYPE.DEFAULT) {
    commit('CHANGE_ADD_TASK_TYPE', taskType);
    commit('CHANGE_ADD_TASK_VISIBLE', true);
  },
  hideAddTaskDialog({ commit }) {
    commit('CHANGE_ADD_TASK_VISIBLE', false);
    commit('CHANGE_ADD_TASK_URL', '');
    commit('CHANGE_ADD_TASK_FILES', [])
  },
  updateAddTaskUrl({ commit }, url = '') {
    commit('CHANGE_ADD_TASK_URL', url)
  },
  addTaskAddFiles({ commit }, { fileList }) {
    commit('CHANGE_ADD_TASK_FILES', fileList)
  },
  updateAddTaskOptions({ commit }, options = {}) {
    commit('CHANGE_ADD_TASK_OPTIONS', options)
  },
  changeAddTaskType({ commit }, taskType) {
    commit('CHANGE_ADD_TASK_TYPE', taskType)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}