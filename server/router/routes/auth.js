'use strict'

import AccessToken from '../../model/access-token';
import Account from '../../model/account';
import {JsonError} from '../../error';

export default (router => {
	router.post('/login', async (ctx, next) => {
		const { mobile, password } = ctx.request.body;
		const account = await Account.findOne({ mobile:mobile});
		if(!account){
			throw new JsonError('10001', '暂无此用户');
		}

		const isMatch = await account.compare(password);
		console.log(isMatch);
		if(!isMatch){
			throw new JsonError('10002', '密码错误');
		}

		//删除当前令牌
		await AccessToken.findOneAndRemove({account: account._id});
		//重新创建令牌
		const accessToken = await AccessToken.create({
			account: account._id
		});

		const _accessToken = {
			token: accessToken.token,
			token_type: 'Bearer'
		}

		ctx.body = {
			code: 10000,
			result: {
				account: account,
				access_token : _accessToken
			}
		}
	})
})