import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Entry from './views/Entry.vue'
import Debugger from './views/Debugger.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'entry',
      component: Entry
    },
    {
      path: '/splash',
      name: 'splash',
      component: Home
    },
    {
      path: '/debugger',
      name: 'debugger',
      component: Debugger
    },
    {
      path: '/config',
      name: 'Config',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Config.vue')
    }
  ]
})
