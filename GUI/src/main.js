// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Axios from 'axios'
import qs from 'qs'
import VueAMap from 'vue-amap'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

// ElementUI
Vue.use(ElementUI)
//

// Map
const VueAmapKey = 'dce5ce7fec5be7d394ddc022928ef4c0'

Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
  key: VueAmapKey,
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ],
  v: '1.4.4',
  uiVersion: '1.0.11'
})
//

// Axios
// Axios.defaults.baseURL = '/api'
Vue.prototype.$axios = Axios
//

// qs
Vue.prototype.$qs = qs
//

//
Vue.use(VueResource)
//

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
