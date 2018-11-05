

import Vue from 'vue'
import Vuex from 'vuex'
import search from './modules/search'
import retention from './modules/retention'
import user from './modules/user'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    search,
    retention,
    user
  },
  strict: debug,
  plugins: []
})
