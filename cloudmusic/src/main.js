// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui'
import store from './store'
import axios from 'axios'
import Icon from 'material-design-icons'
import 'muse-ui/dist/muse-ui.css'
import 'material-design-icons/iconfont/material-icons.css'
Vue.use(MuseUI)
Vue.use(Icon)
Vue.config.productionTip = false
Vue.prototype.$http=axios
window.address='http://127.0.0.1:3001'
//window.address='http://192.168.191.1:3001'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
