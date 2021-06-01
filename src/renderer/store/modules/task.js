import api from "../../api"

const state = {
    taskList: [],
    currentTaskItem: null,
    taskProgressType: 'line'
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
    }
}

const actions = {
    fetchList({ commit, state }) {
        return api.fetchTaskList().then(data => {
            commit('UPDATE_TASK_LIST', data)
        })
    },
    changeTaskOptions({ dispatch }, task) {
        api.changeTaskOptions(task)
        dispatch('fetchList')
    },
    updateCurrentTaskItem({ commit }, task) {
        commit('UPDATE_CURRENT_TASK_ITEM', task)
    },
    removeTask({ dispatch }, task) {
        api.removeTask(task);
        dispatch('fetchList')
    },
    changeTaskProgressType({ commit }, type) {
        commit('CHANGE_TASK_PROGRESS_TYPE', type)
    }
}

export default {
    namespaced: true,
    state, getters, mutations, actions
}