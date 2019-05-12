const state = {
    keyword: null
}

const getters = {
    keyword: (state, getters) => {
        return state.keyword
    }
}

const actions = {
    setKeyword({commit, state}, keyword){
        commit('setKeyword', keyword)
    }
}

const mutations = {
    setKeyword(state, keyword){
        state.keyword = keyword
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}