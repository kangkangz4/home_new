'use strict'

import { Strategy as BearerStrategy } from 'passport-http-bearer'
import AccessToken from '../../model/access-token'
import Role from '../../model/role'
import Permission from '../../model/permission'
import _ from 'lodash'

export default new BearerStrategy(async(token, done) => {
	(async() => {
		try{
			// console.log('BearerStrategy');
			const accessToken = await AccessToken.findOne({token})
											.populate('account')
											.exec();
			if(!accessToken) return done(null, false, {type: 'error', message:'授权失败！'});
			//找到相关用户
			const account = accessToken.account.toObject();
			account.permissions = [];
			//查询用户相关角色
			// const permissions = await Permission.find({'role.accounsts':account._id}).populate('role').exec();
			const roles_ = await Role.find({accounts:account._id});
			for (let i = 0; i < roles_.length; i++) {
				//查询相关角色权限
				const permissions_ = await Permission.find({role:roles_[i]._id});
				for (let i = 0; i < permissions_.length; i++) {
					account.permissions = _.concat(account.permissions, permissions_[i].permissions);
				}
			}
			return done(null, account, {scope: '*'});
		}catch(error){
			done(error);
		}
	})();
})