'use strict'

import Role from '../../model/role'
import { JsonError } from '../../error'
import { isBearerAuthenticated } from '../../auth'
import { hasPermission } from '../../util'

export default (router =>{
	router
		.post('/role/list',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'role', '查看')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const { name } = ctx.request.body;
				let query = {};
				//判断是否有姓名,如果有就是从查询过来
				if(name){
					query = {
						name: {$regex: name, $options:'i'}
					}
				}
				const roles = await Role.find(query).sort('order').exec();
				ctx.body = {
					code: 10000,
					result: roles
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(40001, '角色获取失败');
			}
		})
		.put('/role/add',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'role', '创建')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const { name, order, accounts} = ctx.request.body;
				await Role.create({
					name, order, accounts
				})
				ctx.body = {
					code: 10000,
					message: '角色创建成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(40002, '角色创建失败');
			}
		})
		.post('/role/edit',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'role', '编辑')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const {_id, name, order, accounts} = ctx.request.body;
				await Role.findByIdAndUpdate(_id, {
					name, order, accounts
				})
				ctx.body = {
					code: 10000,
					message: '角色更新成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(40003, '角色更新失败');
			}
		})
		.delete('/role/remove/:id',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'role', '删除')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const _id = ctx.params.id;
				await Role.findByIdAndRemove(_id);
				ctx.body = {
					code: 10000,
					message: '角色删除成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(40004, '角色删除失败');
			}
		})
})