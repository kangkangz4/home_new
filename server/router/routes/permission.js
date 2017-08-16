'use strict'

import Permission from '../../model/permission'
import { JsonError } from '../../error'
import { isBearerAuthenticated } from '../../auth'
import { hasPermission } from '../../util'

export default (router=>{
	router
		.post('/permission/list',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permission = ctx.state.user.permissions;
				if(!hasPermission(permission, 'permission', '查看')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const {name} = ctx.request.body;
				let query = {};
				if(name){
					query = {
						name: {$regex: name, $options:'i'}
					}
				}
				const permissions = await Permission.find(query).sort('order').exec();
				ctx.body = {
					code: 10000,
					result: permissions
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(50001, '权限获取失败')
			}
		})
		.put('/permission/add',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permission = ctx.state.user.permissions;
				if(!hasPermission(permission, 'permission', '创建')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const {name, order, role, permissions} = ctx.request.body;
				await Permission.create({
					name, order, role ,permissions
				})
				ctx.body = {
					code: 10000,
					message: '权限创建成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(50002, '权限创建失败')
			}
		})
		.post('/permission/edit',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permission = ctx.state.user.permissions;
				if(!hasPermission(permission, 'permission', '编辑')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const {_id, name, order, role, permissions} = ctx.request.body;
				await Permission.findByIdAndUpdate(_id, {
					name, order, role, permissions
				})
				ctx.body = {
					code: 10000,
					message: '权限更新成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(50003, '权限更新失败')
			}
		})
		.delete('/permission/remove/:id',isBearerAuthenticated(), async (ctx)=>{
			try{
				const permission = ctx.state.user.permissions;
				if(!hasPermission(permission, 'permission', '删除')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const _id = ctx.params.id;
				await Permission.findByIdAndRemove(_id);
				ctx.body = {
					code: 10000,
					message: '权限删除成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(50004, '权限删除失败');
			}
		})
})