import Vue from 'vue';
import VueRouter from 'vue-router';

import User from './views/User';
import Person from './views/Person';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/user',
  },
  { path: '/user', component: User },
  { path: '/person', component: Person },
];

export default new VueRouter({
  routes,
  mode: 'history',
});
