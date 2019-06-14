const state = {
    page: 1,
    q: '',
    goods: [],
    scrollTop: 0
}

const getters = {
    page: (state, getters) =>{
        return state.page
    },
    q: (state, getters) => {
        return state.q
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
    storeQ({commit, state}, q){
        commit('storeQ', q)
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
    storeQ(state, q){
        state.q = q
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