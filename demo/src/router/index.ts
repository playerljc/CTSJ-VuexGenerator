import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import Home from '../views/Home.vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import User from '../views/User'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Person from '../views/Person'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/',
    redirect: '/user'
  },
  { path: '/user', component: User },
  { path: '/person', component: Person }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
