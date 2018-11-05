const state = {
    category: {
        id: -1,
        title: '所有分类'
    }
}

const getters = {
    category: (state, getters) =>{
        return state.category
    }
}

const actions = {
    setCategory({commit, state}, category){
        console.log(category);
        commit('setCategory', category)
        console.log(state.category)
    }
}

const mutations = {
    setCategory(state, category){
        state.category = category
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}