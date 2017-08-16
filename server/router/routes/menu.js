'use strict'

import Menu from '../../model/menu'
import { JsonError } from '../../error'
import { isBearerAuthenticated } from '../../auth'
import { hasPermission } from '../../util'

/**
 * 判断当前菜单是否有权限
 * @param  {[type]}  menu        [description]
 * @param  {[type]}  permissions [description]
 * @return {Boolean}             [description]
 */
function isMenuShowHasPermission(menu, permissions){
	//判断是否为根目录,根目录所有用户都有权限
	if(!menu.parent){
		return true;
	}
	//判断是否有查看权限
	return hasPermission(permissions, menu.shortname, '查看');
}


export default (router => {
	router
		//根据用户权限返回相关菜单
		.get('/menus/listWithPermission', isBearerAuthenticated(), async (ctx) =>{
			try{
				const account = ctx.state.user;
				//获取用户权限
				const permissions = account.permissions;
				//查询所有菜单
				const menus_ = await Menu.find();
				let menus = [];
				//处理菜单'查看'权限
				for (let i = 0; i < menus_.length; i++) {
					const m = menus_[i];
					const isHasPermission = isMenuShowHasPermission(m, permissions);
					if(isHasPermission){
						menus.push(m);
					}
				}
				ctx.body = {
					code: 10000,
					result: menus
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(20005, '菜单获取失败');
			}
		})
		.get('/menus/list',isBearerAuthenticated(), async (ctx) => {
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'menu', '查看')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const menus = await Menu.find();
				ctx.body = {
					code: 10000,
					result: menus
				};
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(20001, '菜单获取失败');
			}
		})
		.put('/menus/add',isBearerAuthenticated(), async (ctx) => {
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'menu', '创建')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const {name, shortname, path, componentUrl, icon, order, isHidden, parent} = ctx.request.body;
				await Menu.create({name,shortname, path, componentUrl, icon, order, isHidden, parent});
				ctx.body = {
					code: 10000,
					message: '新增成功'
				};
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(20002, '菜单创建失败');
			}
		})
		.post('/menus/edit',isBearerAuthenticated(), async (ctx) => {
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'menu', '编辑')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const {_id, name,shortname, path, componentUrl, icon, order, isHidden, parent} = ctx.request.body;
				await Menu.findByIdAndUpdate(_id, { name,shortname, path, componentUrl, icon, order, isHidden, parent })
				ctx.body = {
					code: 10000,
					message: '更新成功'
				};
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(20003, '菜单更新失败');
			}
		})
		.delete('/menus/remove/:id',isBearerAuthenticated(), async (ctx) =>{
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'menu', '删除')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const _id = ctx.params.id;
				await Menu.findByIdAndRemove(_id);
				ctx.body = {
					code: 10000,
					message: '删除成功'
				};
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(20004, '菜单删除失败');
			}
			
		})
})