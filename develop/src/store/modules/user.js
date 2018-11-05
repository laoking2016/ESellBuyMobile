const state = {
    token: null
}

const getters = {
    token: (state, getters) =>{
        return state.token
    }
}

const actions = {
    storeToken({commit, state}, token){
        commit('storeToken', token)
    }
}

const mutations = {
    storeToken(state, token){
        state.token = token
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}