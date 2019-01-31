const state = {
    index: 0
}

const getters = {
    index: (state, getters) => {
        return state.index
    }
}

const actions = {
    storeIndex({commit, state}, index){
        commit('storeIndex', index)
    }
}

const mutations = {
    storeIndex(state, index){
        state.index = index
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}