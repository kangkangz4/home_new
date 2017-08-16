'use strict'

import passport from 'koa-passport'
import compose from 'koa-compose'
import importDir from 'import-dir'
import Account from '../model/account'

const strategies = importDir('./strategies');

Object.keys(strategies).forEach(name => {
  	passport.use(name, strategies[name]);
});

passport.serializeUser((user, done) => {
	console.log('serializeUser');
	done(null, user._id)
});

passport.deserializeUser(async (id, done) => {
	(async() =>{
		console.log('deserializeUser');
		try{
			const account = await Account.findById(id);
			done(null, account);
		}catch(error){
			done(error);
		}
	})();
});

export default function auth(){
	return compose([
		passport.initialize(),
    	passport.session()
	])
}

export function isLocalAuthenticated(){
	return passport.authenticate('local', { session: true });
}

//Bearer认证
export function isBearerAuthenticated() {
  return passport.authenticate('bearer', { session: false });
}