import axios from 'axios';
import store from '../vuex/store'
import router from '../router'
import NProgress from 'nprogress'

let base = 'api';

// 添加请求拦截器
axios.interceptors.request.use(config => {
    NProgress.start();
    //所有请求都加入验证，除了登录
    if(config.url != `${base}/login`){
        let session = sessionStorage.getItem('session');
        if(session){
            session = JSON.parse(session);
            config.headers['Authorization'] = `Bearer ${session.access_token.token}`;
        }
    	// config.headers['Authorization'] = `Bearer ${store.state.token}`;
        
    }
    return config;
}, error => {
    NProgress.done();
    // 对请求错误做些什么
    return Promise.reject(error);
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
    NProgress.done();
    let {code, message} = response.data;
    //错误返回
    if(code != 10000){
        return Promise.reject(message);
    }
    // 对响应数据做点什么
    return response.data;
}, error => {
    NProgress.done();
    // 对响应错误做点什么
    if(error.response){
    	switch(error.response.status){
    		case 401: //未授权
                store.commit('clearToken')
    			router.replace({ path: 'login'})
                return;
    	}
    }
    return Promise.reject(error);
})

export const requestLogin = params => { return axios.post(`${base}/login`, params) }

export const getUserList = params => { return axios.post(`${base}/user/list`, params) }

export const getUserListPage = params => { return axios.post(`${base}/user/listpage`, params ) }

export const removeUser = params => { return axios.post(`${base}/user/remove`, params) }

export const batchRemoveUser = params => { return axios.post(`${base}/user/batchremove`,  params) }

export const editUser = params => { return axios.post(`${base}/user/edit`, params) }

export const addUser = params => { return axios.post(`${base}/user/add`, params) }

/*--  菜单 --*/
export const getMenus = () => { return axios.get(`${base}/menus/list`) }

export const addMenu = params => { return axios.put(`${base}/menus/add`, params) }

export const editMenu = params => { return axios.post(`${base}/menus/edit`, params) }

export const removeMenu = id => { return axios.delete(`${base}/menus/remove/${id}`) }

/*-- 账户 --*/
export const listAccount = () => { return axios.get(`${base}/account/list`) }

export const listPageAccount = params => { return axios.post(`${base}/account/listpage`, params) }

export const addAccount = params => { return axios.put(`${base}/account/add`, params) }

export const editAccount = params => { return axios.post(`${base}/account/edit`, params) }

export const removeAccount = id => { return axios.delete(`${base}/account/remove/${id}`) }

export const batchRemoveAccount = params => { return axios.post(`${base}/account/batchremove`, params) }

export const resetPass = params => { return axios.post(`${base}/account/resetpass`, params) }

/*-- 部门 --*/
export const listDepartment = () => { return axios.get(`${base}/department/list`) }

export const addDepartment = params => { return axios.put(`${base}/department/add`, params) }

export const editDepartment = params => { return axios.post(`${base}/department/edit`, params) }

export const removeDepartment = id => { return axios.delete(`${base}/department/remove/${id}`) }

/*-- 角色 --*/
export const listRole  = (params) => { return axios.post(`${base}/role/list`, params) }

export const addRole = (params) => { return axios.put(`${base}/role/add`, params) }

export const editRole = (params) => { return axios.post(`${base}/role/edit`, params) }

export const removeRole = id => { return axios.delete(`${base}/role/remove/${id}`) }

/*-- 权限 --*/
export const listPermission = (params) => { return axios.post(`${base}/permission/list`, params)}

export const addPermission = (params) => { return axios.put(`${base}/permission/add`, params)}

export const editPermission = (params) => { return axios.post(`${base}/permission/edit`, params)}

export const removePermission = id => { return axios.delete(`${base}/permission/remove/${id}`)}