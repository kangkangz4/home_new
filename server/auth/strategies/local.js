'use strict'

import { Strategy as LocalStrategy } from 'passport-local'
import Account from '../../model/account'
import {JsonError} from '../../error'

export default new LocalStrategy(async(username, password, done)=>{
	(async()=>{
		try{
			const account = await Account.findOne({mobile:username})
			if(!account){
				throw new JsonError('10001', '暂无此用户');
			}
			const isMatch = await account.compare(password);
			if(!isMatch){
				throw new JsonError('10002', '密码错误');
			}
			done(null, account);
		}catch(error){
			done(error);
		}
	})();
})