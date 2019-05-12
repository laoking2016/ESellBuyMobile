const state = {
    index: 0,
    page0: 1,
    page1: 1,
    sort: 'deadline desc',
    goods: [],
    scrollTop: 0
}

const getters = {
    index: (state, getters) => {
        return state.index
    },
    page0: (state, getters) => {
        return state.page0
    },
    page1: (state, getters) => {
        return state.page1
    },
    sort: (state, getters) => {
        return state.sort
    },
    goods: (state, getters) => {
        return state.goods
    },
    scrollTop: (state, getters) => {
        return state.scrollTop
    }
}

const actions = {
    storeIndex({commit, state}, index){
        commit('storeIndex', index)
    },
    storePage0({commit, state}, page0){
        commit('storePage0', page0)
    },
    storePage1({commit, state}, page1){
        commit('storePage1', page1)
    },
    storeSort({commit, state}, sort){
        commit('storeSort', sort)
    },
    addGood({commit, state}, good){
        commit('addGood', good)
    },
    cleanGoods({commit, state}){
        commit('cleanGoods')
    },
    storeScrollTop({commit, state}, scrollTop){
        commit('storeScrollTop', scrollTop)
    }
}

const mutations = {
    storeIndex(state, index){
        state.index = index
    },
    storePage0(state, page0){
        state.page0 = page0
    },
    storePage1(state, page1){
        state.page1 = page1
    },
    storeSort(state, sort){
        state.sort = sort
    },
    addGood(state, good){
        state.goods.push(good)
    },
    cleanGoods(state){
        state.goods = []
    },
    storeScrollTop(state, scrollTop){
        state.scrollTop = scrollTop
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}