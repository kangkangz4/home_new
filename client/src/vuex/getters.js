//test
// export const getCount = state => {
//     return state.count
// }

// const getters = {
// 	account:(state) => {
// 		return state.account
// 	}
// }
import util from '../common/js/util'

/**
 * 生成树结构
 * @param  {[type]} menus [description]
 * @return {[type]}       [description]
 */
function generatorMenus(menus){
	//加入相关组件
	_.each(menus, (m) =>{
		addComponent(m);
	})
	const menus_ = util.sortTree(menus);
	return menus_;
}

/**
 * 加入组件
 * @param {[type]} menu [description]
 */
function addComponent(menu){
	const path = menu.componentUrl;
	menu.component = require('../' + path);
}

function getMenus(state){
	//判断是否有本地数据
	if(state.menus.length > 0){
		return state.menus;
	}
	let session_menus = sessionStorage.getItem('menus');
	if(session_menus){
		session_menus = JSON.parse(session_menus);
	}else{
		session_menus = [];
	}
	return session_menus;
}

function getAccount(state){
	//判断当前是否有账户数据
	if(state.account.mobile){
		return state.account;
	}
	const session = sessionStorage.getItem('session');
	let account = {};
	if(session){
		account = JSON.parse(session).account;
	}
	return account;
}

// export default getters
const menuitems = state => generatorMenus(getMenus(state));
const menus = state => getMenus(state);
const account = state => getAccount(state);
const session = state => JSON.parse(sessionStorage.getItem('session'));

export {
	session,
	menuitems,
	menus,
	account
	// isLoadRoutes
}