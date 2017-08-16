'use strict'
// import _ from 'lodash'

/**
 * 检查是否有当前模块的操作功能
 * @param  {[type]}  permissions [用户所有权限]
 * @param  {[type]}  modeName    [模块名称]
 * @param  {[type]}  operator    [操作]
 * @return {Boolean}             [description]
 */
export function hasPermission(permissions, modeName, operator){
	for (let i = 0; i < permissions.length; i++) {
		const p = permissions[i];
		if(p.name == modeName && p.permissions.indexOf(operator) != -1){
			return true;
		}
	}
	return false;
}