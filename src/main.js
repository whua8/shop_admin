// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'

import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import '@/assets/common.css'

import ElTreeGrid from 'element-tree-grid'
Vue.component(ElTreeGrid.name, ElTreeGrid)

Vue.use(ElementUI)

Vue.use(VueQuillEditor)

Vue.config.productionTip = false

// 把axios绑定到vue的原型上
Vue.prototype.axios = axios

Vue.filter('dateFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // console.log(config)
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 2. 配置axios的全局的默认baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
