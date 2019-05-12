import Vue from 'vue'
import Vuex from 'vuex'
import search from './modules/search'
import user from './modules/user'
import home from './modules/home'
import manage from './modules/manage'
import goods from './modules/goods'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    search,
    user,
    home,
    manage,
    goods,
  },
  strict: debug,
  plugins: []
})
