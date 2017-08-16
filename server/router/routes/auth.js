'use strict'

import AccessToken from '../../model/access-token'
import Account from '../../model/account'
import {JsonError} from '../../error'
import { isLocalAuthenticated } from '../../auth'

export default (router => {
	router.post('/login', isLocalAuthenticated(), async (ctx) => {
		const account = ctx.state.user;
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