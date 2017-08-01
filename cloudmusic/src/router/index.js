import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('../Views/index')), 'index')
const recommendlist = r => require.ensure([], () => r(require('../Views/recommendlist')), 'index')
const songListView = r => require.ensure([], () => r(require('../Views/songListView')), 'songListView')
const songDetailView = r => require.ensure([], () => r(require('../Views/songDetailView')), 'songDetailView')
const songSheet = r => require.ensure([], () => r(require('../Views/songSheet')), 'index')
const searchSong= r => require.ensure([], () => r(require('../Views/searchSong')), 'searchSong')
Vue.use(Router)
export default new Router({
	routes: [
	{
		path: '/index',
		name: 'index',
		component: index,
		children:[
		{
			path:'recommendlist',
			component:recommendlist
		},
		{
			path:'songSheet',
			component:songSheet
		}
		]
	},
	{
		path: '*', redirect: '/index/recommendlist'
	},
	{
		path:'/songListView/:id',
		name:'songListView',
		component:songListView
	},
	{
		path:'/songDetailView/:id',
		name:'songDetailView',
		component:songDetailView
	},
	{
		path:'/searchSong',
		name:'searchSong',
		component:searchSong
	},
	]
})
