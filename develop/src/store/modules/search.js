const state = {
    category: {
        id: -1,
        title: '所有分类'
    },
    keyword: null,
    searchKbn: null
}

const getters = {
    category: (state, getters) => {
        return state.category
    },
    keyword: (state, getters) => {
        return state.keyword
    },
    searchKbn: (state, getters) => {
        return state.searchKbn
    }
}

const actions = {
    setCategory({commit, state}, category){
        commit('setCategory', category)
    },
    setKeyword({commit, state}, keyword){
        commit('setKeyword', keyword)
    },
    setKbn({commit, state}, kbn){
        commit('setKbn', kbn)
    }
}

const mutations = {
    setCategory(state, category){
        state.category = category
    },
    setKeyword(state, keyword){
        state.keyword = keyword
    },
    setKbn(state, kbn){
        state.searchKbn = kbn
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}