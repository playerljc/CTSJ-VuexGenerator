import Vue from 'vue';
import Vuex from 'vuex';
import Antd from 'ant-design-vue';

import VuexGeneratorPlugin from './store/plugin/VuexGeneratorPlugin';
import router from './router';
import App from './App.vue';

import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.use(Vuex);

const store = new Vuex.Store({
  // 使用VuexGeneratorPlugin插件
  plugins: [VuexGeneratorPlugin],
});

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');
