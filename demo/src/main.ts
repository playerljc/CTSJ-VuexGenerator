import { createApp } from 'vue'
import Antd from 'ant-design-vue'

import store from './store'
import router from './router'
import App from './App.vue'

import './registerServiceWorker'

import 'ant-design-vue/dist/antd.css'

createApp(App).use(store).use(router).use(Antd).mount('#app')
