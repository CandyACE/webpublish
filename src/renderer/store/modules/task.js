import api from "../../api"

const state = {
    taskList: [],
    currentTaskItem: null
}

const getters = {}

const mutations = {
    UPDATE_TASK_LIST(state, taskList) {
        state.taskList = taskList
    },
    UPDATE_CURRENT_TASK_ITEM(state, taskItem) {
        state.currentTaskItem = taskItem
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
    }
}

export default {
    namespaced: true,
    state, getters, mutations, actions
}