<template>
	<div>
		<div class="topcontent">
			<mu-appbar title="网易云音乐demo">
				<mu-icon-button icon='search' @click="search" slot="right"/>
			</mu-appbar>
			<div>
				<mu-tabs :value="activeTab" @change="handleTabChange" class="view-tabs">
					<mu-tab value="recommendlist" title="个性推荐"/>
					<mu-tab value="songSheet" title="歌单"/>
				</mu-tabs>
			</div>
		</div>
		<div class="CenterViewContainer"> 
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>

	</div>
</template>
<script>
	export default{
		name:"index",
		data:function(){
			return {
				activeTab:'recommendlist'
			}
		},
		methods:{
			handleTabChange:function(val){
				this.activeTab = val
				this.$router.push({path:'/index/'+val})	
			},
			search(){
				this.$router.push({path:'/searchSong'})
			}
		},
		created(){
			this.handleTabChange('recommendlist')
		},
		watch:{
			'$route' (to, from) {
				let path=to.path;
				let item=path.split('/');
				this.activeTab = item[2]
			}
		}
	}
</script>
<style lang="less" scoped>
	@import "../assets/theme.less";
	@media screen and (min-width: 540px) {
		.topcontent{
			width:540px;
			margin:auto;
			position:fixed;
			z-index:999;
		}
		.CenterViewContainer
		{
			position:relative;
			top:112px
		}
	}
	@media screen and (max-width: 540px) {
		.topcontent{
			width:100%;
			margin:auto;
			position:fixed;
			z-index:999
		}
		.CenterViewContainer
		{
			position:relative;
			top:102px;
		}
	}
	.view-tabs {
		background-color: #fff !important;
		color: rgba(0,0,0,.87);
		>.mu-tab-link {
			color: rgba(102,102,102,1);
		}
		>.mu-tab-active{
			color: @primaryColor;
		}
	}
	
</style>