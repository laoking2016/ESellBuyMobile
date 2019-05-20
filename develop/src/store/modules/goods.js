const state = {
    page: 1,
    first: -1,
    second: -1,
    title: null,
    goods: [],
    scrollTop: 0
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
    title: (state, getters) => {
        return state.title
    },
    goods: (state, getters) => {
        return state.goods
    },
    scrollTop: (state, getters) => {
        return state.scrollTop
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
    storeTitle({commit, state}, title){
        commit('storeTitle', title)
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
    storePage(state, page){
        state.page = page
    },
    storeFirst(state, first){
        state.first = first
    },
    storeSecond(state, second){
        state.second = second
    },
    storeTitle(state, title){
        state.title = title
    },
    addGood(state, good){
        state.goods.push(good)
    },
    cleanGoods(state){
        state.goods = [];
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