import api from "../../api"

const state = {
    taskList: [],
    currentTaskItem: null
}

const getters = {}

const mutations = {
    UPDATE_TASK_LIST(state, taskList) {
        state.taskList = taskList
        console.log(state.taskList)
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
    updateCurrentTaskItem({ commit }, task) {
        commit('UPDATE_CURRENT_TASK_ITEM', task)
    }
}

export default {
    namespaced: true,
    state, getters, mutations, actions
}