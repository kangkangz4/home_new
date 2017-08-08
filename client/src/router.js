import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './vuex/store'

import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

Vue.use(VueRouter)

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航一',
    //     iconCls: 'el-icon-message',//图标样式class
    //     children: [
    //         { path: '/main', component: Main, name: '主页', hidden: true },
    //         { path: '/dashboard', component: Table, name: 'Table' },
    //         { path: '/form', component: Form, name: 'Form' },
    //         { path: '/user', component: user, name: '列表' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        redirect: { path: '/404' }
    }
];

/**
 * 加入缓存的菜单
 * @type {[type]}
 */
const menus = store.getters.menuitems;
if(menus.length > 0){
   routes = _.concat(routes, menus);
}

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    console.log(to);
  if (to.path == '/login') {
    sessionStorage.removeItem('session');
    sessionStorage.removeItem('menu');
  }
  //未登录
  let session = JSON.parse(sessionStorage.getItem('session'));
  if (!session && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router;