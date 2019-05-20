const state = {
    keyword: null,
    sort: 'good_id desc',
    scrollTop: 0
}

const getters = {
    keyword: (state, getters) => {
        return state.keyword
    },
    sort: (state, getters) => {
        return state.sort
    },
    scrollTop: (state, getters) => {
        return state.scrollTop
    }
}

const actions = {
    setKeyword({commit, state}, keyword){
        commit('setKeyword', keyword)
    },
    storeSort({commit, state}, sort){
        commit('storeSort', sort)
    },
    storeScrollTop({commit, state}, scrollTop){
        commit('storeScrollTop', scrollTop)
    }
}

const mutations = {
    setKeyword(state, keyword){
        state.keyword = keyword
    },
    storeSort(state, sort){
        state.sort = sort
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