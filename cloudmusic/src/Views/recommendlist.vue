 <template>
 	<div>
 		<div id='bannerContainer'><!-- 轮播图 -->
 			<banner v-bind:BannerList="bannerArr"></banner>
 		</div>
 		<div id="circleContanier">
 			<!-- 中间的三个按钮 -->
 			<mu-flexbox justify="space-between">
 				<mu-flexbox-item class="centerboxitem"> 
 					<div class="mu-paper demo-paper mu-paper-circle mu-paper-round mu-paper-1 redborderpaper">
 						<mu-icon @click="tip" class="redicon" value="featured_video" color="red" :size="getFontSize"/>
 					</div>
 				</mu-flexbox-item>
 				<mu-flexbox-item class="centerboxitem">
 					<div class="mu-paper demo-paper mu-paper-circle mu-paper-round mu-paper-1 redborderpaper">	
 						<mu-icon @click="tip" class="redicon" value="event_note" color="red" :size="getFontSize"/>
 					</div>
 				</mu-flexbox-item>
 				<mu-flexbox-item class="centerboxitem">
 					<div class="mu-paper demo-paper mu-paper-circle mu-paper-round mu-paper-1 redborderpaper">
 						<mu-icon class="redicon" value="show_chart" @click="tip" color="red" :size="getFontSize"/>
 					</div>
 				</mu-flexbox-item>
 			</mu-flexbox>
 			<mu-flexbox justify="space-between" v-bind:style="{ marginBottom: getfontBottom}">
 				<mu-flexbox-item class="centerboxitem">
 					<span class="circleTitle">私人FM</span>
 				</mu-flexbox-item>
 				<mu-flexbox-item class="centerboxitem">
 					<span class="circleTitle">每日歌曲推荐</span>
 				</mu-flexbox-item>
 				<mu-flexbox-item class="centerboxitem">
 					<span class="circleTitle">云音乐热歌榜</span>
 				</mu-flexbox-item>
 			</mu-flexbox>
 		</div>
 		<div id="hotContainer" class="listContainer"><!-- 热门歌单列表 -->
 			<div id="hotListMoreTitle" class="moreTitle">
 				<span class="titlefont">推荐歌单 
 					<mu-icon value="navigate_next" :size="15"/>
 				</span>
 			</div>
 			<mu-flexbox :gutter="3" wrap="wrap" justify="space-between">
 				<mu-flexbox-item basis="30%" v-for="item in hotArr" class="flexitem" :key="item.id">
 					<router-link class="flexLink" :to="{name:'songListView',params:{ id: item.id, name: item.name, coverImg: item.picUrl, creator: item.creator, count: item.playcount, desc: item.name }}">
 						<div class="imgCountNum">
 							<mu-icon value="headset" :size="12"/>
 							{{item.playcount| filterplaycount}}
 						</div>
 						<img :src="item.picUrl" class="imgInList" lazy="load">
 						<div class="itemDescript">{{item.name}}</div>
 					</router-link>
 					<!-- </router-link> -->
 				</mu-flexbox-item>
 			</mu-flexbox>
 		</div>

 		<div id="newsongContainer" class="listContainer"><!-- 热门歌单列表 -->
 			<div id="newsongMoreTitle" class="moreTitle">
 				<span class="titlefont">最新音乐
 					<mu-icon value="navigate_next" :size="15"/>
 				</span> 
 			</div>
 			<mu-flexbox :gutter="3" wrap="wrap" justify="space-between">
 				<mu-flexbox-item basis="30%" v-for="item in newsong" class="flexitem" :key="item.id">
 					<!-- <router-link :to="{name:'ListDetail'}"> -->
 					<a class="flexLink">
 						<img :src="item.album.picUrl" class="imgInList" lazy="load">
 						<div class="itemDescript">{{item.name}}</div>
 					</a>
 					<!-- </router-link> -->
 				</mu-flexbox-item>
 			</mu-flexbox>
 		</div>
 		<toast ref="toast"></toast>
 	</div>
 </template>
 <script>
 	import banner from '../components/banner.vue'
 	import toast from '../components/toast'
 	export default{
 		name:"recommendlist",
 		data:function(){
 			return {
 				bannerArr:[],
 				hotArr:[],
 				newsong:[]
 			}
 		},
 		methods:{
 			tip(){
 				this.$refs.toast.showToast('尚未开发');
 			}
 		},
 		components:{banner,toast},
 		created:function(){
 			this.$http({
 				method: 'GET',
 				url: ''+address+'/recommendData',
 			}).then(response=>{
 				let jsondata=response.data;
 				this.$data.bannerArr=jsondata['/api/v2/banner/get']['banners'];
 				this.$data.hotArr=jsondata['/api/discovery/hotspot']['data'].splice(0,6);
 				this.$data.newsong=jsondata['/api/v1/discovery/new/songs']['data'].splice(0,6)
 			});
			// this.$http({
			// 	method:'GET',
			// 	url:'http://127.0.0.1:3000/banner'
			// }).then(response=>{
			// 	let jsondata=response.data;
			// 	console.log(jsondata)
			// 	this.$data.bannerArr=jsondata.banners
			// })
		},
		computed:{
			getFontSize:()=>{
				let width=document.body.clientWidth;
				let fontsize=(width>=540)? 48: 36;
				return fontsize;
			},
			getfontBottom:()=>{
				let width=document.body.clientWidth;
				let bottom=(width>=540)? '8px': '4px';
				return bottom;
			}
		},
		filters:{
			filterplaycount:(value)=>{
				let num=Number(value);
				let count=(num<=9999)?num:(Math.ceil(num/10000)).toString()+"万";
				return count

			}
		}
	}
</script>
<style lang="less" scoped>
	@primaryred:#f44336;
	#circleContanier{
		background-color: #ffffff;
		border-bottom:1px solid #ffcdd2;
	}
	@media screen and (min-width: 540px) {
		.redborderpaper{
			display: inline-block;
			height: 80px;
			width: 80px;
			margin: 8px 8px 2px;
			text-align: center;
			border-style: solid;
			border-width:1px;
			border-color: @primaryred;
			&:active
			{
				background-color:#f44336;
				color:#ffffff;
			}
		}
		.redicon{
			margin-top:16px;
			font-size:48px;
			width:48px;
			height:48px;
		}
	}
	@media screen and (max-width:540px)
	{
		.redborderpaper{
			display: inline-block;
			height: 60px;
			width: 60px;
			margin: 8px 8px 2px;
			text-align: center;
			border-style: solid;
			border-width:1px;
			border-color: @primaryred;
			&:active
			{
				background-color:#f44336;
				color:#ffffff;
			}
		}
		.redicon{
			margin-top:12px;
			font-size:36px;
			width:36px;
			height:36px;
		}
	}
	.centerboxitem
	{
		text-align:center;
		.circleTitle
		{
			font-size:11px;
		}
	}
	.titlefont
	{
		font-size:16px;
		font-weight:500;
	}
	.listContainer
	{
		padding:0px 5px;
		margin-top:12px;
		.moreTitle
		{
			margin:5px 0px 3px
		}
		.flexitem{
			height:100%;
			position:relative;
			.flexLink{
				width:inherit;

				img[lazy="load"]
				{
					background: url('../../static/default_cover.png') no-repeat;
					background-size: cover;
					max-height:175px;
					width:175px;
				}
			}
			.imgCountNum{
				text-align:right;
				background:linear-gradient(rgba(144,144,144,0.5),rgba(58,58,58,0.1));
				position:absolute;
				color:#ffffff;
				width:100%;
				height:auto;
			}
			.itemDescript{
				overflow : hidden;
				font-size: 12px;
				height: 1.7rem;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				color:rgba(0,0,0,.87);
				margin-Bottom:14px;
			}
			.imgInList
			{
				max-width:100%;
				height:auto;
			}
		}
	}



</style>