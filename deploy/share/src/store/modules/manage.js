const state = {
    supplierStatus: '拍卖中',
    customerStatus: '拍卖中',
    customer: {
        id: -1,
        name: null
    }
}

const getters = {
    supplierStatus: (state, getters) => {
        return state.supplierStatus
    },
    customerStatus: (state, getters) => {
        return state.customerStatus
    },
    customer: (state, getters) => {
        return state.customer
    }
}

const actions = {
    storeSupplierStatus({commit, state}, status){
        commit('storeSupplierStatus', status)
    },
    storeCustomerStatus({commit, state}, status){
        commit('storeCustomerStatus', status)
    },
    storeCustomer({commit, state}, customer){
        commit('storeCustomer', customer)
    }
}

const mutations = {
    storeSupplierStatus(state, status){
        state.supplierStatus = status
    },
    storeCustomerStatus(state, status){
        state.customerStatus = status
    },
    storeCustomer(state, customer){
        state.customer = customer
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}