import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import router from './router'
import store from './vuex/store'
// import Mock from './mock'
// Mock.bootstrap();
// import 'font-awesome/css/font-awesome.min.css'
import Plugin from './plugin'
// import axios from './api/http'

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(Plugin)

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
// Vue.prototype.axios = axios;

//NProgress.configure({ showSpinner: false });

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

