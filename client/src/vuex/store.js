import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    //登录账户信息
    account:{},
    //菜单
    menus:[],
    // isLoadRoutes: false,
    // count: 10,
    //认证Token信息
    // token: '',
    //登录用户信息
    // account: {},
}

// 定义所需的 mutations
const mutations = {
    SET_MENU(state, menuItems){
        state.menus = menuItems;
        //持久化菜单，方便刷新
        sessionStorage.setItem('menus', JSON.stringify(menuItems));
    },
    // LOAD_ROUTES(state){
    //     state.isLoadRoutes = !state.isLoadRoutes
    // },
    // INCREMENT(state) {
    //     state.count++
    // },
    // DECREMENT(state) {
    //     state.count--
    // }
    
    // setToken:(state, token) => {
    //     state.token = token
    // },
    // clearToken:(state) => {
    //     state.token = ''
    // },
    // setAccount:(state, account) =>{
    //     state.account = account
    // }
    SET_SESSION(state, session){
        state.account = session.account;
        sessionStorage.setItem('session', JSON.stringify(session));
    },
    CLEAR_SESSION(state){
        sessionStorage.removeItem('session');
        sessionStorage.removeItem('menus');
    },
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})