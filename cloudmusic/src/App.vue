<template>
	<div id="app">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<player v-show="songList.length>0&&playBarShow==true"></player>
	</div>
</template>

<script>
	import player from './components/player'
	import {mapGetters} from 'vuex'
	export default {
		name: 'app',
		components:{player},
		computed:{
			...mapGetters([
				'songList',
				'playBarShow'
				])
		}
	}
</script>

<style scoped>
	@media screen and (min-width:540px)
	{
		#app{
			width:540px;
			margin:0 auto;
			overflow-y:hidden;
			/* box-shadow: 0px 0px 3px 0px #eee; */
		}
	}
	@media screen and (max-width:540px) {
		#app {
			width: 100%;
			overflow-y:hidden
		}
	}

</style>
