'use strict'

import Department from '../../model/department'
import Account from '../../model/account'
import { JsonError } from '../../error'
import { isBearerAuthenticated } from '../../auth'
import { hasPermission } from '../../util'

export default (router=>{
	router
		.get('/department/list',isBearerAuthenticated(), async (ctx) => {
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'department', '查看')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const departs = await Department.find();
				ctx.body = {
					code: 10000,
					result: departs
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(10001, '部门列表获取错误');
			}
		})
		.put('/department/add',isBearerAuthenticated(), async (ctx) => {
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'department', '创建')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const { name, parent, order, accounts } = ctx.request.body;

				//查找加入部门用户是否有部门，将原来部门中的用户去掉，加入新的部门
				for (var i = 0; i < accounts.length; i++) {
					await Department.updateMany({$pull:{'accounts':accounts[i]}} )
				}

				//创建部门
				const department = await Department.create({
					name, parent, order, accounts
				})

				//批量更新用户部门信息
				await Account.updateMany(
					{ _id: { $in: accounts } },
      				{ $set: { "department" : department._id } }
      			);
				ctx.body = {
					code: 10000,
					message: '部门创建成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(10002, '部门创建失败');
			}
		})
		.post('/department/edit',isBearerAuthenticated(), async (ctx) =>{
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'department', '编辑')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const { _id, name, parent, order, accounts } = ctx.request.body;

				//查找加入部门用户是否有部门，将原来部门中的用户去掉，加入新的部门
				for (var i = 0; i < accounts.length; i++) {
					await Department.updateMany({$pull:{'accounts':accounts[i]}} )
				}

				const department = await Department.findByIdAndUpdate(_id, {
					name, parent, order, accounts
				})

				//批量更新用户部门信息
				await Account.updateMany(
					{ _id: { $in: accounts } },
					{ $set: { "department" : department._id } }
				);
				ctx.body = {
					code: 10000,
					message: '部门更新成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(10003, '部门更新失败');
			}
		})
		.delete('/department/remove/:id',isBearerAuthenticated(), async (ctx) => {
			try{
				const permissions = ctx.state.user.permissions;
				if(!hasPermission(permissions, 'department', '删除')){
					throw new JsonError(20009, '您无操作权限，请联系管理员');
					return;
				}
				const _id = ctx.params.id;
				const department = await Department.findByIdAndRemove(_id);
				//删除相关用户部门信息
				await Account.updateMany(
					{  _id: { $in: department.accounts } },
					{ $unset: {'department':''} }
				);
				ctx.body = {
					code: 10000,
					message: '部门删除成功'
				}
			}catch(error){
				console.log(error);
				if(error instanceof JsonError){
					throw error;
				}
				throw new JsonError(10004, '部门删除失败');
			}
		})
})