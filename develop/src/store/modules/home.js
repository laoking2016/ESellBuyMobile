const state = {
    index: 0,
    first: -1,
    second: -1
}

const getters = {
    index: (state, getters) => {
        return state.index
    },
    first: (state, getters) => {
        return state.first
    },
    second: (state, getters) => {
        return state.second
    }
}

const actions = {
    storeIndex({commit, state}, index){
        commit('storeIndex', index)
    },
    storeFirst({commit, state}, first){
        commit('storeFirst', first)
    },
    storeSecond({commit, state}, second){
        commit('storeSecond', second)
    }
}

const mutations = {
    storeIndex(state, index){
        state.index = index
    },
    storeFirst(state, first){
        state.first = first
    },
    storeSecond(state, second){
        state.second = second
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}