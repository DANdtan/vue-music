<template>
	<div class="songListContainer" :class="{listView:songList.length!=0}">
		<div class="titlebar">
			<div>
				<mu-icon-button @click="back" icon='arrow_back' slot="left"/></mu-icon-button>
			</div>
			<div>
				<div class="TopName">{{fname}}</div>
			</div>
		</div>
		<div class="listInfo">
			<div class="listDescript">
				<div class="listDesc">
					<div class="ListImg">
						<div class="playCount">
							<mu-icon value="headset" :size="12"/>
							{{playCount|filterplaycount}}
						</div>
						<img :src="coverImgUrl + '?param=300y300'" alt="">
					</div>
					<span class="listTitle">
						<p class="p-title">{{name}}</p>
						<p class="p-author">
							<mu-avatar slot="left"  :src="creator.avatarUrl + '?param=50y50'" :size="30" :iconSize="20"/>
							<span>{{creator.nickname}}</span>
						</p>
					</span>
				</div>
				<div class="listInfoImg" :style="{'background-image':'url('+coverImgUrl+'?param=300y300)'}"></div>
			</div>
		</div>

		<div class="playlist">
			<div>
				<mu-flat-button label="播放全部" class="demo-flat-button" icon="add_circle_outline" @click="AddAll"></mu-flat-button>
				<mu-divider/>
			</div>
			<div>
				<mu-circular-progress :size="40" color="#f44336" class="center" v-if="isloading"/>
				<mu-list  v-show="!isloading">
					<div v-for="(item,index) in listMsgFilter" @click="playmusic(item)">
						<mu-list-item  :title="item.name" :key="index" :describeText="item.ar[0].name">
							<span slot="left" class="indexStyle">{{index + 1}}</span>
						</mu-list-item>
						<mu-divider inset/>
					</div>
				</mu-list>
			</div>
		</div>
		<Toast ref="toast"></Toast>
	</div>
	
</template>
<script>
	import { mapGetters } from 'vuex'
	import api from '../api'
	import Toast from '../components/toast'
	export default{
		name:"songlistView",
		data:function(){
			return {
				listMsg:[],
				listID:0,//当前歌单id
				fname:'歌单',
				coverImgUrl: '../../static/default_cover.png',
				name: '歌单标题',
				id: 0,
				playCount: 0,
				description: '描述',
				creator: {
					'avatarUrl': '',
					'nickname': '昵称'
				},
				isloading:false,
				value:0
			}
		},
		components:{Toast},
		methods:{
			getSongListMsg:function(){
				this.listID=this.$route.params.id;
				this.isloading=true;
				this.$http.get(api.getPlayListDetail(this.$route.params.id)).then((res) => {
					this.$data.listMsg = res.data.playlist.tracks
					this.isloading=false;
				}).catch((error) => {
					this.$refs.toast.showToast('加载歌单信息出错');
					console.log('加载歌单信息出错:' + error)
				})	
			},
			back:function(){
				this.$router.go(-1)
			},
			AddAll:function(){	
			//	this.$store.commit("nowSongList",this.listID);
			this.$store.commit("setPlayBar",true)
			if(this.nowSongListId!==this.listID){
				// console.log(this.nowSongListId)
				// console.log(this.listID)
				this.$store.commit("nowSongList",this.listID);
				this.$store.commit("clearSongList");
				let songArr=new Array();
				this.listMsg.forEach(function(value){
					songArr.push({
						albumPic: value.al.picUrl,
						id: value.id,
						name: value.name,
						singer: value.ar[0].name
					})
				})
				this.$store.commit("allIn",songArr)
			}
		},
		playmusic(song){
			var audioPlay=document.getElementById("audioPlay");
			audioPlay.pause();
			this.$store.commit('pause');
			this.AddAll();
			var audio = {};
			audio.id = song.id;
			audio.singer = song.ar[0].name;
			audio.albumPic = song.al.picUrl;
			audio.name = song.name;
			this.$store.commit("setSong",audio);
			this.$store.dispatch("getSong",audio.id)
		},

	},
	beforeRouteEnter(to,from,next)
	{
		next(vm=>{
			if(to.params.id!==vm.listid)
			{
				vm.getSongListMsg()
			}
			if (to.params.coverImg) {
				vm.coverImgUrl = vm.$route.params.coverImg
				vm.name = vm.$route.params.name
				vm.description = vm.$route.params.desc
				vm.playCount = vm.$route.params.count
				vm.creator = vm.$route.params.creator
				vm.id = vm.$route.params.id
			}
		})

	},
	filters:{
		filterplaycount:(value)=>{
			let num=Number(value);
			if(isNaN(num))
			{
				return 0;
			}
			else {
				let count=(num<=9999)?num:(Math.ceil(num/10000)).toString()+"万";
				return count
			}
		}
	},
	computed: {
		...mapGetters([
			'songList',
			'nowSongListId'
			]),
		listMsgFilter:function(){
			return this.listMsg.filter(function (item) {
				return !item.hasOwnProperty("other")
			})
		}
	}
}
</script>
<style lang="less" scoped>
	@media screen and (min-width: 540px) {
		.songListContainer
		{
			width:540px;
			overflow-x:hidden;
		}
		.titlebar
		{
			width:540px;
			height:56px;
			z-index:10;
			top:0;
			color:#fff;
			position:absolute;
			div{
				float:left;
				top:0;
			}
		}
		.listInfoImg{
			position:absolute;
			width:540px;
			height:100%;
			filter:blur(35px);
			left:0;
			top:-40px;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: bottom right;
			-webkit-filter:blur(35px);
			z-index:1;
		}
		.listInfo{
			position:relative;
		}
		.listDescript{
			position: relative;
			padding: 0 17px 40px ;
			height: 260px;
			margin-top:56px;
		}
		.listDesc{
			position: relative;
			z-index: 10;
			color: #fff;
		}
		.ListImg
		{
			float:left;
			position:relative;
			z-index:3;
			width: 40%;
			overflow: hidden;
			img{
				max-width:100%;
				height:auto;
			}
			.playCount
			{
				text-align:right;
				background:linear-gradient(rgba(144,144,144,0.5),rgba(58,58,58,0.1));
				position:absolute;
				color:#ffffff;
				width:100%;
				height:auto;
			}
		}
		.listTitle{
			color:#ffffff;
			height:auto;
			float:left;
			z-index:5;
			margin-left:34px;
			color:#ffffff;
			width:50%;
			.p-title{
				width:100%;
				font-size:16px;
				word-wrap:break-word;
			}
			.p-author {
				span {
					overflow: hidden;
					display: inline-block;
					height: 30px;
					text-overflow: ellipsis;
					width: auto;
					white-space: nowrap;
					font-size: 14px;
					vertical-align: top;
					line-height: 30px;
				}
			}

		}
		.TopName{
			padding-top:10px;
			font-size:24px;
		}
	}
	@media screen and (max-width: 540px) {
		.songListContainer
		{
			width:100%;
		}
		.titlebar
		{
			width:100%;
			height:56px;
			z-index:10;
			top:0;
			color:#fff;
			position:absolute;
			div{
				float:left;

			}
		}
		.listInfoImg{
			position:absolute;
			width:100%;
			height:100%;
			filter:blur(40px);
			left:0;
			top:0;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: bottom right;
			-webkit-filter:blur(40px);
			z-index:1;
		}
		.listInfo{
			position:relative;
		}
		.listDescript{
			position: relative;
			padding: 0 9px 30px ;
			height: 140px;
			margin-top:56px;

		}
		.listDesc{
			position: relative;
			z-index: 10;
			color: #fff;
		}
		.ListImg
		{
			float:left;
			position:relative;
			z-index:3;
			width: 26%;
			min-width:110px;
			overflow: hidden;
			img{
				max-width:100%;
				height:auto;
			}
			.playCount
			{
				text-align:right;
				background:linear-gradient(rgba(144,144,144,0.5),rgba(58,58,58,0.1));
				position:absolute;
				color:#ffffff;
				width:100%;
				height:auto;
			}
		}
		.listTitle{
			color:#ffffff;
			height:auto;
			width:40%;
			float:left;
			z-index:5;
			margin-left:13px;
			color:#ffffff;
			.p-title{
				width:100%;
				font-size:14px;
				word-wrap:break-word;
			}
			.p-author {
				span {
					overflow: hidden;
					display: inline-block;
					height: 30px;
					text-overflow: ellipsis;
					width: auto;
					white-space: nowrap;
					font-size: 10px;
					vertical-align: top;
					line-height: 30px;
				}
			}

		}
		.TopName{
			padding-top:7px;
			font-size:24px;
		}
	}
	.playlist{ 
		position: relative;
		background: #fff;
		z-index: 3;
	}
	.indexStyle {
		padding-left: 10px;
		font-size: 18px;
		font-weight: bolder;
	}
	.mu-item-title {
		white-space:nowrap;
		height: 1.7rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.center {
		display: block!important;
		margin: 10% auto 0;
	}
	.listView
	{
		margin-bottom:70px
	}
</style>