import api from "../../api"

const state = {
    taskList: [],
    currentTaskItem: null,
    taskProgressType: 'line',
    taskItemInfoVisible: false
}

const getters = {}

const mutations = {
    UPDATE_TASK_LIST(state, taskList) {
        state.taskList = taskList
    },
    UPDATE_CURRENT_TASK_ITEM(state, taskItem) {
        state.currentTaskItem = taskItem
    },
    CHANGE_TASK_PROGRESS_TYPE(state, type) {
        state.taskProgressType = type
    },
    CHANGE_TASK_INFO_VISIBLE(state, visible) {
        state.taskItemInfoVisible = visible
    }
}

const actions = {
    // fetchList({ commit, state }) {
    //     return api.fetchTaskList().then((data) => {
    //         commit('UPDATE_TASK_LIST', data)
    //     })
    // },
    // changeTaskOptions({ dispatch }, task) {
    //     api.changeTaskOptions(task)
    //     dispatch('fetchList')
    // },
    updateCurrentTaskItem({ commit }, task) {
        commit('UPDATE_CURRENT_TASK_ITEM', task)
    },
    // removeTask({ dispatch }, task) {
    //     api.removeTask(task);
    //     dispatch('fetchList')
    // },
    changeTaskProgressType({ commit }, type) {
        commit('CHANGE_TASK_PROGRESS_TYPE', type)
    },
    // addTask({ dispatch }, options) {
    //     api.addTask(options);
    //     dispatch('fetchList')
    // },
    showTaskItemInfoDialog({ commit, dispatch }, task) {
        dispatch('updateCurrentTaskItem', task)
        commit('CHANGE_TASK_INFO_VISIBLE', true)
    },
    hideTaskItemInfoDialog({ commit }) {
        commit('CHANGE_TASK_INFO_VISIBLE', false)
    },
}

export default {
    namespaced: true,
    state, getters, mutations, actions
}