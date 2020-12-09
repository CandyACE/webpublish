import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "@/components/Theme/Default.scss";

import Icon from '@/components/Icons/Icon'
import Application from '../main/Application'
import Msg from "@/components/Msg"


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

var application = new Application()
Vue.prototype.application = application;
global.application = application;

Vue.use(ElementUI)
Vue.component('ts-icon', Icon)

Vue.use(Msg, ElementUI.Message, {
  showClose: true,
  offset: 30,
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
