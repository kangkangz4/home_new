'use strict'

import mongoose from 'mongoose'
import Account from '../model/account'
import Menu from '../model/menu'
import _ from 'lodash'
import { account, menus } from './config'

export function connectDB(uri){
	return new Promise((resolve, reject) => {
		mongoose.Promise = require('bluebird');
		mongoose.connection
			.on('error', error => reject(error))
			.on('disconnected', () => console.log('Mongoose connection disconnected'))
			.on('connected', () => {
				console.log('Mongoose connection open to ' + uri);
				resolve();
			});
		mongoose.connect(uri, {useMongoClient:true});
	})
}

/**
 * 初始化数据库
 * @return {[type]} [description]
 */
export async function initDB(){
  return new Promise((resolve, reject) => {
    (async () => {
      try{
        await registerAccount();
        await registerMenu();
        resolve();
      }catch(error){
        reject(error);
      }
    })()
  })
}

/**
 * 注册管理员
 * @return {[type]} [description]
 */
async function registerAccount() {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const _account = await Account.findOne({ mobile: account.mobile });
        if (!_account) {
          const {mobile, password, name, pinyin, avatar, email, addr, age, sex, birth} = account;
          await Account.create({
            mobile, password, name,pinyin, avatar, email, addr, age, sex, birth
          })
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })()
  })
}

/**
 * 注册菜单
 * @return {[type]} [description]
 */
async function registerMenu(){
  return new Promise((resolve, reject) => {
    (async ()=> {
      try{
        const _menu = await Menu.findOne({shortname:menus.systemMenu.shortname});
        if(!_menu){
          const {path, name, shortname,icon, componentUrl, order} = menus.systemMenu;
          const menu_ = new Menu({
            path, name, shortname,icon, componentUrl, order
          })
          const n = await menu_.save();
          let childMenu = [];
          _.each(menus.systemChildMenu, (child)=>{
            const {path, name, shortname, componentUrl, order} = child;
            const child_ = new Menu({
              path, name, shortname, componentUrl, order, parent:n._id
            })          
            childMenu.push(child_);
          })
          //一次插入
          const newChilds = await Menu.insertMany(childMenu);
        }
        
        // const _menu = await Menu.findOne({ name: menus[0].name });
        // if(!_menu){
        //   menus.forEach(async function(menu, index) {
        //     const {path, name, icon, componentUrl, order} = menu;
        //     const menu_ = new Menu({
        //       path, name, shortname:'', icon, componentUrl, order, parent:''
        //     })
        //     const n = await menu_.save();
        //     menu.children.forEach(async function(childMenu, index) {
        //       // console.log(childMenu);
        //       const {path, name, shortname, componentUrl, order} = childMenu;
        //       const childMenu_ = new Menu({
        //         path, name, shortname,componentUrl, order, parent:n._id
        //       })
        //       await childMenu_.save();
        //     });
        //   });
        // }
      }catch(error){
        reject(error);
      }
    })()
  })
}