<template>
	<div class="foot">
		<div class="player-container">
			<div class="player-content">
				<audio :src="audio.location" @timeupdate="Timeupdate" @suspend="Suspend" @ended="Next" @canplay="Play" @onerror="ErrorToast" id="audioPlay"/>
				<div id="songmsg" class="song-info" @click="toDetail">
					<div id="songimg" class="songimg">
						<mu-circular-progress color="#f44336"  v-show="songLoading" :size="30"/>
						<img :src="audio.albumPic + '?param=100y100'" v-show="!songLoading" >
					</div>
					<div id="songname" class="song-name">
						<div class="aname">{{audio.name}}</div>
						<div class="singer">{{audio.singer}}</div>
					</div>
				</div>
				<div id="audiobutton" class="song-btn">
					<div><mu-icon-button class="redfont" @click="Showlist" icon="format_list_bulleted"/></div>
					<div><mu-icon-button v-show="playing" @click="Pause" class="redfont" icon="pause"/>
						<mu-icon-button v-show="!playing" @click="Play" class="redfont" icon="play_arrow"/></div>
						<div><mu-icon-button @click="Next" class="redfont" icon="skip_next"/></div>
					</div>
				</div>
			</div>
			<Bottomlist ref="bottomlist"></Bottomlist>
			<Toast ref="toast"></Toast>
		</div>
	</template>
	<script>
		import {mapGetters} from 'vuex'
		import Bottomlist from '../components/songList';
		import Toast from '../components/toast';
		export default{
			data(){
				return{

				}
			},
			components:{Bottomlist,Toast},
			watch:{
				songError:function(val){
					if(val===true)
					{
						this.$refs.toast.showToast("因版权或网络原因,加载失败");
						this.$store.commit('songError',false);

					}
				}
			},
			methods:{
				Play(){
					this.$store.commit('songLoadingClose')
					this.$store.commit('play')
					document.getElementById('audioPlay').play()
				},
				Pause()
				{
					this.$store.commit('pause')
					document.getElementById('audioPlay').pause()
				},
				Next()
				{
					this.$store.commit('NextSong');
					let id= this.songList[this.currentIndex - 1].id;
					this.$store.dispatch("getSong",id)
				},
				Showlist()
				{
					this.$refs.bottomlist.openBottomSheet();
				},
				toDetail()
				{
					let id=this.audio.id;
					this.$router.push({name:'songDetailView',params:{id:id}})
				},
				Timeupdate(){
					let audio=document.getElementById("audioPlay");
					let currentTime = parseInt(audio.currentTime);

					this.$store.commit('setDurationTime', parseInt(audio.duration))
					this.$store.commit('setCurrentTime', currentTime)

				},
				Suspend(){
					let audio=document.getElementById("audioPlay");
					let buffer = audio.buffered;
					if (buffer.length > 0 && audio.duration > 0) {
						this.$store.commit('setBufferedTime', parseInt(audio.buffered.end(0)))
					}
				},
				ErrorToast:function(){
					this.$refs.toast.showToast("歌曲加载出错");
				}
			},
			computed:{
				...mapGetters([
					'songLoading',
					'audio',
					'playing',
					'currentIndex',
					'songList',
					'songError',
					])
			}
		}
	</script>
	<style lang="less" scoped>
		@import "../assets/theme.less";
		@media screen and (min-width:540px)
		{
			.foot{
				position:fixed;
				bottom:0;
				width:540px;
				margin:0px auto;
				z-index:99;
			}
			.singer{
				font-size:14px;
				color:#8a8a8a;
				overflow: hidden;
				display: block;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.aname{
				font-size:18px;
			}
			.songimg{
				width:62px;
				height:62px;
				img{
					width:100%;
					height:100%;
				}
			}
		}
		@media screen and (max-width:540px)
		{
			.foot{
				position:fixed;
				bottom:0;
				width:100%;
				margin:0px auto;
				z-index:99;
			}
			.singer{
				font-size:10px;
				color:#8a8a8a;
				overflow: hidden;
				display: block;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.aname{
				font-size:14px;
			}
			.songimg{
				width:39px;
				height:39px;
				img{
					width:100%;
					height:100%;
				}
			}
		}
		.player-content{
			color:#333333;
			width:100%;
			@media screen and (max-width:540px)
			{
				height: 55px;
			}
			@media screen and (min-width:540px)
			{
				height: 70px;
			}
			position: relative;
			background-color: rgba(255,255,255,.9);
			display:flex;
			flex-direction: row;
			display: -webkit-flex; /* Safari */
			flex-wrap: nowrap;
			align-items: center;
			padding: 4px;

		}
		.song{
			&-info{
				display:flex;
				flex-direction: row;
				display: -webkit-flex; /* Safari */
				flex-wrap: nowrap;
				align-items: center;
				width:40%;
			}
			&-name{
				display:flex;
				flex-direction: column ;
				display: -webkit-flex; /* Safari */
				flex-wrap: nowrap;
				align-items: flex-start;
				margin-left:7px;
				width:50%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

			}
			&-btn{
				display:flex;
				flex-direction: row;
				display: -webkit-flex; /* Safari */
				flex-wrap: nowrap;
				align-items: center;
				justify-content: flex-end;
				width:60%;
			}
		}
		.center
		{
			margin:0 auto;
		}
		.redfont{
			color:#f44336
		}

	</style>