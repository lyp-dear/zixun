import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Tijiao = resolve => require(['components/tijiao/tijiao.vue'], resolve);
const Fuwu = resolve => require(['components/fuwu/fuwu.vue'], resolve);
export default new Router({
	routes: [{
		path: '/',
		redirect: '/tijiao'
	}, {
		path: '/tijiao',
		component: Tijiao
	}, {
		path: '/fuwu',
		component: Fuwu
	}]
})