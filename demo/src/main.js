import Vue from 'vue';
import Vuex from 'vuex';

import VuexGeneratorPlugin from './store/plugin/VuexGeneratorPlugin';

import App from './App.vue';

Vue.use(Vuex);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  // 使用VuexGeneratorPlugin插件
  plugins: [VuexGeneratorPlugin],
});

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
