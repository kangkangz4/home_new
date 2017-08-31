'use strict'

export const account = {
	mobile: '13395140855',
	password: '123456',
	name: '朱先生',
    pinyin: 'zhu',
	avatar: 'http://img2.imgtn.bdimg.com/it/u=1735755037,1520963688&fm=214&gp=0.jpg',
    sex: 1,
    addr: '',
    email: 'kang',
    age: 10,
    birth: '2017-08-01'
}

export const menus = {
    systemMenu:{ path: '/', componentUrl: 'views/Home.vue', name: '系统设置',shortname:'system', icon: 'fa fa-bar-chart',order: 99},
    systemChildMenu:[
        { path: '/menu',componentUrl: 'views/system/Menu.vue', name: '菜单设置', shortname:'menu', order:1 },
        { path: '/account',componentUrl: 'views/system/Account.vue', name: '用户管理', shortname:'account', order:2 },
        { path: '/department',componentUrl: 'views/system/Department.vue', name: '部门管理',shortname:'department', order:3 },
        { path: '/role',componentUrl: 'views/system/Role.vue', name: '角色设置', shortname:'role', order:4 },
        { path: '/permission',componentUrl: 'views/system/Permission.vue', name: '权限设置',shortname:'permission', order:5 }
    ]
}

export const role = {
    admin:{
        name: '超级管理员', order:1, level:1
    }
}



// [
// 	{
//         path: '/',
//         componentUrl: 'views/Home.vue',
//         name: '导航一',
//         icon: 'el-icon-message',//图标样式class
//         order: 1,
//         children: [
//             { path: '/dashboard', componentUrl: 'views/nav1/Table.vue', name: 'Dashboard', shortname:'dashboard', order:1 },
//             { path: '/form', componentUrl: 'views/nav1/Form.vue', name: 'Form', shortname:'form', order:2 },
//             { path: '/user', componentUrl: 'views/nav1/user.vue', name: '列表', shortname: 'user', order:3 },
//         ]
//     },
//     {
//         path: '/',
//         componentUrl: 'views/Home.vue',
//         name: '导航二',
//         icon: 'fa fa-id-card-o',
//         order: 2,
//         children: [
//             { path: '/page4', componentUrl: 'views/nav2/Page4.vue', name: '页面4', shortname:'page4', order:1 },
//             { path: '/page5', componentUrl: 'views/nav2/Page5.vue', name: '页面5', shortname:'page5', order:2 }
//         ]
//     },
//     {
//         path: '/',
//         componentUrl: 'views/Home.vue',
//         name: '导航三',
//         icon: 'fa fa-address-card',
//         order: 3,
//         children: [
//             { path: '/page6',componentUrl: 'views/nav3/Page6.vue', name: '页面6', shortname:'page6', order:3 }
//         ]
//     },
//     {
//         path: '/',
//         componentUrl: 'views/Home.vue',
//         name: 'Charts',
//         icon: 'fa fa-bar-chart',
//         order: 4,
//         children: [
//             { path: '/echarts',componentUrl: 'views/charts/echarts.vue', name: 'echarts', shortname:'echarts', order:4 }
//         ]
//     },
//     {
//         path: '/',
//         componentUrl: 'views/Home.vue',
//         name: '系统设置',
//         icon: 'fa fa-bar-chart',
//         order: 99,
//         children: [
//             { path: '/menu',componentUrl: 'views/system/Menu.vue', name: '菜单设置', shortname:'menu', order:1 },
//             { path: '/account',componentUrl: 'views/system/Account.vue', name: '用户管理', shortname:'account', order:2 },
//             { path: '/department',componentUrl: 'views/system/Department.vue', name: '部门管理',shortname:'department', order:3 },
//             { path: '/role',componentUrl: 'views/system/Role.vue', name: '角色设置', shortname:'role', order:4 },
//             { path: '/permission',componentUrl: 'views/system/Permission.vue', name: '权限设置',shortname:'permission', order:5 }
//         ]
//     }
// ]