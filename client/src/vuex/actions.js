//test
// export const increment = ({commit}) => {
//     commit('INCREMENT')
// }
// export const decrement = ({commit}) => {
//     commit('DECREMENT')
// }
// import api from '../api'

// const actions = {
// 	//登录
// 	// login: async({ commit }, {params, that}) => {
// 	// 	api.requestLogin(params).then(res => {
// 	// 		commit('getToken', res.access_token.token)
// 	// 		commit('getAccount', res.account)
// 	// 		that.$router.push({ path: '/table' })
// 	// 	})
// 	// }
// }

// export default actions

export const setMenu = ({ commit }, menuItems) => {
	commit('SET_MENU', menuItems)
}

export const loadRoutes = ({ commit }) => {
	commit('LOAD_ROUTES')
}

export const setSession = ({commit}, value) =>{
	commit('SET_SESSION', value)
}

export const clearSession = ({commit}) =>{
	commit('CLEAR_SESSION');
}