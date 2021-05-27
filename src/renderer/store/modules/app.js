const state = {
  aboutPanelVisible: false
}

const getters = {}

const mutations = {
  CHANGE_ABOUT_PANEL_VISIBLE(state, visible) {
    state.aboutPanelVisible = visible;
  }
}

const actions = {
  showAboutPanel({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', true)
  },
  hideAboutPanel({ commit }) {
    commit('CHANGE_ABOUT_PANEL_VISIBLE', false)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}