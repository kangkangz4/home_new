'use strict'

import Menu from '../../model/menu'
// import _ from 'lodash'
import { JsonError } from '../../error'
import { isBearerAuthenticated } from '../../auth'

/**
 * 判断当前菜单是否有权限
 * @param  {[type]}  menu        [description]
 * @param  {[type]}  permissions [description]
 * @return {Boolean}             [description]
 */
function isMenuHasPermission(menu, permissions){
	//判断是否为根目录,根目录所有用户都有权限
	if(!menu.parent){
		return true;
	}
	for (var i = 0; i < permissions.length; i++) {
		if(menu.shortname == permissions[i].name && permissions[i].permissions.indexOf('查看') != -1){
			return true;
		}
	}	
	return false;
}


export default (router => {
	router
		// .get('/menus/tree', async (ctx) =>{
		// 	try{
		// 		//查询所有菜单
		// 		const menus = await Menu.find({parent: {$exists: false}}).populate('children').sort('order').exec();
		// 		ctx.body = {
		// 			code: 10000,
		// 			result: menus
		// 		}
		// 	}catch(error){
		// 		console.log(error);
		// 		throw new JsonError(20005, '树级菜单获取失败')
		// 	}
		// })
		//根据用户权限返回相关菜单
		.get('/menus/listWithPermission', isBearerAuthenticated(), async (ctx) =>{
			try{
				//获取用户权限
				const permissions = ctx.state.user.permissions;
				// console.log(permissions);
				//查询所有菜单
				const menus_ = await Menu.find();
				let menus = [];
				for (let i = 0; i <menus_.length; i++) {
					const isHas = isMenuHasPermission(menus_[i], permissions);
					if(isHas){
						menus.push(menus_[i]);
					}
				}
				ctx.body = {
					code: 10000,
					result: menus
				}
			}catch(error){
				console.log(error);
				throw new JsonError(20005, '菜单获取失败');
			}
		})
		.get('/menus/list', async (ctx) => {
			try{
				
				const menus = await Menu.find();
				ctx.body = {
					code: 10000,
					result: menus
				};
			}catch(error){
				console.log(error);
				throw new JsonError(20001, '菜单获取失败');
			}
		})
		.put('/menus/add', async (ctx) => {
			try{
				const {name, shortname, path, componentUrl, icon, order, isHidden, parent} = ctx.request.body;
				await Menu.create({name,shortname, path, componentUrl, icon, order, isHidden, parent});
				ctx.body = {
					code: 10000,
					message: '新增成功'
				};
			}catch(error){
				console.log(error);
				throw new JsonError(20002, '菜单创建失败');
			}
		})
		.post('/menus/edit', async (ctx) => {
			try{
				const {_id, name,shortname, path, componentUrl, icon, order, isHidden, parent} = ctx.request.body;
				await Menu.findByIdAndUpdate(_id, { name,shortname, path, componentUrl, icon, order, isHidden, parent })
				ctx.body = {
					code: 10000,
					message: '更新成功'
				};
			}catch(error){
				console.log(error);
				throw new JsonError(20003, '菜单更新失败');
			}
		})
		.delete('/menus/remove/:id', async (ctx) =>{
			try{
				const _id = ctx.params.id;
				await Menu.findByIdAndRemove(_id);
				ctx.body = {
					code: 10000,
					message: '删除成功'
				};
			}catch(error){
				console.log(error);
				throw new JsonError(20004, '菜单删除失败');
			}
			
		})
})