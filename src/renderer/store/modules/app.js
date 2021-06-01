import { ADD_TASK_TYPE } from "../../../shared/constants";

const state = {
  aboutPanelVisible: false,
  addTaskVisible: false,
  addTaskType: ADD_TASK_TYPE.FILE,
  addTaskUrl: '',
  addTaskOptions: {}
}

const getters = {}

const mutations = {
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
  }
}

const actions = {
  showAboutPanel({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', true)
  },
  hideAboutPanel({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', false)
  },
  showAddTaskDialog({ commit }, taskType = ADD_TASK_TYPE.FILE) {
    commit('CHANGE_ADD_TASK_TYPE', taskType);
    commit('CHANGE_ADD_TASK_VISIBLE', true);
  },
  hideAddTaskDialog({ commit }) {
    commit('CHANGE_ADD_TASK_VISIBLE', false);
    commit('CAHNGE_ADD_TASK_URL', '');
  },
  updateAddTaskUrl({ commit }, url = '') {
    commit('CHANGE_ADD_TASK_URL', url)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}