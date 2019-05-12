const state = {
    page: 1,
    first: -1,
    second: -1,
    goods: []
}

const getters = {
    page: (state, getters) =>{
        return state.page
    },
    first: (state, getters) => {
        return state.first
    },
    second: (state, getters) => {
        return state.second
    },
    goods: (state, getters) => {
        return state.goods
    }
}

const actions = {
    storePage({commit, state}, page){
        commit('storePage', page)
    },
    storeFirst({commit, state}, first){
        commit('storeFirst', first)
    },
    storeSecond({commit, state}, second){
        commit('storeSecond', second)
    },
    addGood({commit, state}, good){
        commit('addGood', good)
    },
    cleanGoods({commit, state}){
        commit('cleanGoods')
    }
}

const mutations = {
    storePage(state, page){
        state.page = page
    },
    storeFirst(state, first){
        state.first = first
    },
    storeSecond(state, second){
        state.second = second
    },
    addGood(state, good){
        state.goods.push(good)
    },
    cleanGoods(state){
        state.goods = [];
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}