const state = {
    userId: null,
    token: null,
    openId: null
}

const getters = {
    userId: (state, getters) => {
        return state.userId
    },
    token: (state, getters) =>{
        return state.token
    },
    openId: (state, getters) =>{
        return state.openId
    }
}

const actions = {
    storeUserId({commit, state}, userId){
        commit('storeUserId', userId)
    },
    storeToken({commit, state}, token){
        commit('storeToken', token)
    },
    storeOpenId({commit, state}, openId){
        commit('storeOpenId', openId)
    }
}

const mutations = {
    storeUserId(state, userId){
        state.userId = userId
    },
    storeToken(state, token){
        state.token = token
    },
    storeOpenId(state, openId){
        state.openId = openId
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}