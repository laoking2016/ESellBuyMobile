require('es6-promise').polyfill();

import Vue from 'vue'
import VueRouter from 'vue-router'

import Master from './Master.vue'
import router from './router.js'

import store from './store'


Vue.use(VueRouter)

new Vue({
  store,
  el: '#app',
  router: router,
  render: h => h(Master)
})
