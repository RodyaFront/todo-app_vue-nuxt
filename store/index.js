export const state = () => ({
  $message: null,
})
export const mutations = {
  setMessage(state, payload) {
    state.$message = payload
  },
}
export const actions = {
  handleNewMessage({ commit }, data) {
    commit('setMessage', data)
  },
}
export const getters = {
  message: (state) => state.$message,
}
