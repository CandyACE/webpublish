import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import ElementUI, { Loading } from 'element-ui'
import "@/components/Theme/Index.scss";
import 'element-ui/lib/theme-chalk/index.css'

import Icon from '@/components/Icons/Icon'
import Msg from "@/components/Msg"
import store from './store'
import { sync } from 'vuex-router-sync'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: 'mini'
})
// Vue.use(ElementUI.Popover)
Vue.component('ts-icon', Icon)

Vue.use(Msg, ElementUI.Message, {
  showClose: true,
  offset: 30,
})

const loading = Loading.service({
  fullscreen: true,
  background: 'rgba(0, 0, 0, 0.1)'
})
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

sync(store, router)

/* eslint-disable no-new */
global.vue = new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

setTimeout(() => {
  loading.close()
}, 400)