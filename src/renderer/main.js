import Vue from 'vue'
import axios from 'axios'

import App from './pages/App'
import router from './router'

import ElementUI, { Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "@/components/Theme/Default.scss";

import Icon from '@/components/Icons/Icon'
import Application from '../main/Application'
import Msg from "@/components/Msg"


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'mini'
})
const loading = Loading.service({
  fullscreen: true,
  background: 'rgba(0, 0, 0, 0.1)'
})
// Vue.use(ElementUI.Popover)
Vue.component('ts-icon', Icon)

Vue.use(Msg, ElementUI.Message, {
  showClose: true,
  offset: 30,
})

/* eslint-disable no-new */
global.vue = new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')

setTimeout(() => {
  loading.close()
}, 400)