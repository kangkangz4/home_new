'use strict'

import { Strategy as LocalStrategy } from 'passport-local'
import Account from '../../model/account'
import Role from '../../model/role'
import Permission from '../../model/permission'
import {JsonError} from '../../error'
import _ from 'lodash'

export default new LocalStrategy(async(username, password, done)=>{
	(async()=>{
		try{
			const account_ = await Account.findOne({mobile:username})
			if(!account_){
				throw new JsonError('10001', '暂无此用户');
			}
			const isMatch = await account_.compare(password);
			if(!isMatch){
				throw new JsonError('10002', '密码错误');
			}
			const account = account_.toObject();
			account.permissions = [];
			//查询用户相关角色
			const roles_ = await Role.find({accounts:account._id});
			for (let i = 0; i < roles_.length; i++) {
				//查询相关角色权限
				const permissions_ = await Permission.find({role:roles_[i]._id});
				for (let i = 0; i < permissions_.length; i++) {
					account.permissions = _.concat(account.permissions, permissions_[i].permissions);
				}
			}
			done(null, account);
		}catch(error){
			done(error);
		}
	})();
})