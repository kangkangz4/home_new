import axios from 'axios';
import store from '../vuex/store'
import router from '../router'

let base = 'api';
// 添加请求拦截器
axios.interceptors.request.use(config => {
    //所有请求都加入验证，除了登录
    if(config.url != `${base}/login`){
    	config.headers['Authorization'] = `Bearer ${store.state.token}`;
    }
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
})

// 添加响应拦截器
axios.interceptors.response.use(response => {
	console.log(response.data);
    // 对响应数据做点什么
    let {code, message} = response.data;
    if(code != 10000){
        this.$notify({  
          title: '错误',
          message: message,  
          type: 'error'  
        });
    }
    return response;
}, error => {
    // 对响应错误做点什么
    if(error.response){
    	switch(error.response.status){
    		case 401: //未授权
                store.commit('clearToken')
    			router.replace({ path: 'login'})
    	}
    }
    return Promise.reject(error);
})

export default axios;