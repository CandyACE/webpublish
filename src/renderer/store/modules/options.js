import { isEmpty } from "lodash"
import api from "../../api"

const state = {
  config: {}
}

const getters = {}

const mutations = {
  UPDATE_OPTIONS_DATA(state, config) {
    state.config = { ...state.config, ...config }
  }
}

const actions = {
  fetchOptions({ commit }) {
    return new Promise((resolve) => {
      api.fetchOptions().then((config) => {
        commit('UPDATE_OPTIONS_DATA', config)
        resolve(config)
      })
    })
  },
  save({ commit, dispatch }, config) {
    if (isEmpty(config)) {
      return
    }

    commit('UPDATE_OPTIONS_DATA', config)
    return api.saveOptions(config)
  }
}

export default {
  namespaced: true,
  state, getters, mutations, actions
}