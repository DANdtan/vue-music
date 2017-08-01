<template>
	<div class="DetailContainer">
		<div class="titlebar" id="titlebar">
			<div class="barContainer">
				<div>
					<mu-icon-button @click="back" icon='arrow_back' slot="left"/></mu-icon-button>
				</div>
				<div class="titlebar_song">
					<div class="songName">{{audio.name}}</div>
					<div class="singerName">{{audio.singer}}</div>
				</div>
			</div>
			<div class="bar-line"></div>
		</div>
		<div class="playContainer" >
			<div class="cd"  :class="{'stickplay':playing}" >
				<div class="cd_stick" v-show="!showLyrics">
				</div>
				<div class="cd_wrapper" id="cd_wrapper" @click="showLyricsList" v-show="!showLyrics" :class="{'rotatecd':playing}">
					<div class="cd_cdimg">
						<img class="innerimg" :src="audio.albumPic + '?param=500y500'"/>
					</div>
				</div>
				<div class="lyricsContainer" v-show="showLyrics">
					<div :style="{height:playLyricHeight/3 +'px'}" style="transform:translate3d(0px,0px,5px)"></div>
					<div class="lyrics"  @click="showLyricsList" :style="{'height':playLyricHeight*2/3+'px','transform':'translate3d(0px,'+Yoffset+'px,1px)'}">
						<p v-for="(item,index) in LyricsArr" :key="index" :class="{playingLyrics:index==LyricsKey}">{{item.txt}}</p>
					</div>
				</div>

			</div>
			<div class="slider" id="slider" >
				<div>{{currentTime| formatTime}}</div>
				<div style="width:85%;padding:0px 10px"><mu-slider @change="changeSlider" v-model="ComputedCurrentPercent" /></div>
				<div>{{durationTime| formatTime}}</div>
			</div>
			<div class="btnCotainer" id="btnCotainer" >
				<div class="whitefont"><mu-icon-button @click="changeMode"  icon="wrap_text"/></div>
				<div class="whitefont"><mu-icon-button @click="pre" icon="skip_previous"/></div>
				<div><mu-icon-button v-show="playing"  icon="pause" @click="play(false)" class="borderwhitefont"/>
					<mu-icon-button v-show="!playing" class="borderwhitefont" @click="play(true)" icon="play_arrow"/></div>
					<div class="whitefont"><mu-icon-button  class="redfont" @click="next" icon="skip_next"/></div>
					<div class="whitefont"><mu-icon-button  icon="format_list_bulleted" @click="openBottomList"/></div>
				</div>
			</div>

			<div class="background">
				<div class="bgAlbum" :style="{'background-image':'url(' + audio.albumPic + '?param=500y500' + ')'}"></div>
			</div>
			<div class="mask"></div>
			<Bottomlist ref="bottomlist"></Bottomlist>
			<Toast ref="toast"></Toast>
		</div>	
	</template>
	<script>
		import api from '../api'
		import {mapGetters} from 'vuex'
		import Toast from '../components/toast'
		import Bottomlist from '../components/songList'
		export default{
			name:"songDetailView",
			data(){
				return {
					playLyricHeight:0,
					//InitSlider:0,
					//ifUC:'fixed',
					Lyrics:'',
					LyricsArr:[],
					LyricsKey:0,
					showLyrics:false,             
				}
			},
			components:{Toast,Bottomlist},
			mounted (){
				// (navigator.userAgent.indexOf('UCBrowser')>-1)?	this.$data.ifUC="relative":this.$data.ifUC="fixed";
				let height=document.body.scrollHeight;
				let titlebar=document.getElementById("titlebar").offsetHeight;
				let slider=document.getElementById("slider").offsetHeight;
				let btnCotainer=document.getElementById("btnCotainer").offsetHeight;
				this.$data.playLyricHeight=height-titlebar-slider-btnCotainer-28;
			},
			computed:{
				...mapGetters([
					'audio',
					'playing',
					'currentTime',
					'durationTime',
					'currentPercent',
					'bufferedTime',
					'currentIndex',
					'songList',
					]),
				ComputedCurrentPercent:
				{
					get:function(){
						return this.currentPercent
					},
					set: function (newValue) {
						
					}
				},
				Yoffset:function()
				{
					let LyricsArr=this.$data.LyricsArr;
					if(LyricsArr)
					{
						let currentTime= Math.round(this.currentTime);
						for(let [index,item] of LyricsArr.entries())
						{
							if(item.time===currentTime)
							{
								this.$data.LyricsKey=index;
								break;
							}
						}
						return -(this.$data.LyricsKey) * 35
						//p标签字体大小21+margin的14, 把正在播放的歌词维持在lyricsContainer 1/3的高度
					}
					else {return 0}
				}
		},
		methods:{
			back:function(){
				this.$router.go(-1)
			},
			openBottomList:function(){
				this.$refs.bottomlist.openBottomSheet();
			},
			next:function(){
				this.$store.commit('NextSong');
				let id= this.songList[this.currentIndex - 1].id;
				this.$store.dispatch("getSong",id)
			},
			pre(){
				this.$store.commit('PreSong');
				let id= this.songList[this.currentIndex - 1].id;
				this.$store.dispatch("getSong",id)
			},
			play:function(result)
			{
				var audio=document.getElementById('audioPlay')
				if(result)
				{
					audio.play();
					this.$store.commit("play")
				}
				else{
					audio.pause();
					this.$store.commit("pause")
				}
			},
			changeSlider:function(val)
			{
				let currenttime=(Number(val)*this.durationTime)/100;
				if(this.bufferedTime>Number(val)){
					let audio=document.getElementById("audioPlay")
					audio.currentTime=currenttime;
					this.$store.commit("setCurrentTime",currenttime)
				}
				else{
					this.$refs.toast.showToast('歌曲未缓冲到这里');
				}
			},
			LoadLyrics:function(id)
			{

				this.$http.get(api.getLrc(id)).then((res)=>{
					if (res.data.nolyric) {
						this.LyricsArr = [{'txt':' 没有歌词'}]
					} else {
						this.Lyrics = res.data.lrc.lyric
						this.FormatLrc()
					}
				},(rej)=>{
					this.LyricsArr = [{'txt': '加载歌词失败'}]
				}).catch((err)=>{
					this.LyricsArr = [{'txt': '加载歌词失败'}]
				})

			},
			FormatLrc:function()
			{
					//借用了NeteaseCloudWebApp里面的思路；
					//排成了时间+歌词的结构
					let lyrics = this.Lyrics.split('\n');
					let lyarr=[];
					let Reg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
					for(let item of lyrics)
					{
					//	console.log("item:"+item)
					let RegArr = item.match(Reg)
					if (!RegArr) continue;
					let txt = item.replace(Reg, '');
					//	console.log(txt);
					if(txt==""){continue}
						for (let RegItem of RegArr) {
							let obj = {}
							let min = Number(String(RegItem.match(/\[\d*/i)).slice(1))
							let sec = Number(String(RegItem.match(/\:\d*/i)).slice(1))
							let time = min * 60 + sec
							//console.log(time)
							obj.time = time
							obj.txt = txt
							lyarr.push(obj)
						}
					}
					
					this.$data.LyricsArr=lyarr;
				//	console.log(lyarr);
			},
			showLyricsList:function()
			{
				let result=this.showLyrics;
				this.showLyrics=!result;
			},
			changeMode:function()
			{
				this.$refs.toast.showToast('目前只有列表循环');
			},
			
		},
		filters:{
			formatTime:function(time)
			{
				let numtime=Number(time)
				let duration=Math.floor(numtime);
				let minute=Math.floor(numtime/60);
				(minute<10)?minute='0'+minute:minute;
				let second=duration%60;
				(second<10)?second='0'+second:second;
				return ""+minute+":"+second+"";
			}
		},
		watch:{
			audio:function(value)
			{
				this.LoadLyrics(value.id)
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm=>{
				vm.$store.commit("setPlayBar",false);
				vm.LoadLyrics(vm.audio.id)
			})
		},
		beforeRouteUpdate(to, from, next) {
			this.$store.commit("setPlayBar",false);
			next(true)
		},
		beforeRouteLeave(to, from, next)
		{
			this.$store.commit("setPlayBar",true);
			next(true);
		}
	}
</script>
<style lang="less" scoped>
	@import "../assets/theme.less";
	.DetailContainer{
		overflow:hidden;
		@media screen and (max-width:540px)
		{
			width:100%;
		}
		@media screen and (min-width:540px)
		{
			width:540px;
		}
		height:100%;
	}
	.titlebar
	{
		@media screen and (max-width:540px)
		{
			width:100%;
		}
		@media screen and (min-width:540px)
		{
			width:540px;
		}
		height:60px;
		z-index:10;
		top:0;
		color:#fff;
		// background-color:#f44336;
		position:fixed;
		&_song{
			display:flex;
			flex-direction:column;
			align-items:flex-start; 
			margin-left:1rem;
		}
	}
	.barContainer
	{

		display:flex;
		flex-direction:row;
		align-items:center;
		padding:4px;
	}
	.songName{
		font-size:18px;
		white-space:nowrap;
	}
	.singerName{
		font-size:14px;
		white-space:nowrap;
		color: #a8a7a7;
	}
	.bar-line {
		display: block;
		bottom: 0 ;
		left: 0;
		display: block;
		width: 100%;
		height: 2px;
		background: radial-gradient(#d3d3d3 -90%, transparent 100%);
	}
	.playContainer{
		margin-top:60px;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		width:100%;
		//background-color:#f44336;
	}
	.background{
		position:absolute;
		@media screen and (max-width:540px)
		{
			width:100%;
		}
		@media screen and (min-width:540px)
		{
			width:540px;
		}
		height:100%;
		z-index:1;
		overflow:hidden;	
		top:0;
	}
	.bgAlbum{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		filter: blur(35px);
		-webkit-filter: blur(35px);
		-webkit-transform: scale(1.1);
	}
	.cd{ 
		//position:relative;
		display:flex;
		flex-direction:column;
		flex-wrap:wrap;
		z-index:11;
		width:inherit;
		height:inherit;
		align-items:center;
		&_stick{
			position:relative;
			left:65px;
			width: 150px;
			height: 150px;
			background: url("../../static/stick_bg.png") no-repeat left -.7rem;
			background-size: contain;
			z-index: 8;
			-webkit-transition: all 300ms ease-in;
			transition: all 300ms ease-in;
			-webkit-transform-origin: left top;
			transform-origin: left top;
			-webkit-transform: rotate(-27deg);
			transform: rotate(-27deg);
		}
		&_wrapper
		{
			position: relative;
			bottom:70px;
			@media screen and (max-width:280px)
			{
				height: 200px;
				width: 200px;
			}
			@media screen and (min-width:280px)
			{
				height: 280px;
				width: 280px;
			}
			height:100%;
			border-radius: 50%;
			background: rgba(107, 107, 107, 0.3);
		}
		&_cdimg{
			position: absolute;
			width: 100%;
			height: 100%;
			display:flex;
			justify-content:center;
			align-items:center;
			top: 0;
			left: 0;
			background: url('../../static/cd_wrapper.png') no-repeat center center;
			background-size: contain;
			text-align:center;
		}
	}
	.innerimg{
		@media screen and (max-width:280px)
		{
			height: 138px;
			width: 138px;
		}
		@media screen and (min-width:280px)
		{
			height: 183px;
			width: 183px;
		}
		border-radius: 50%;
	}
	.imgdiv
	{
		text-align:center;
	}
	@keyframes rotating{
		0% {transform:rotate(0deg);}
		100% {transform:rotate(360deg);}
	}
	@-webkit-keyframes rotating{
		0% {-webkit-transform:rotate(0deg);}
		100%{-webkit-transform:rotate(360deg);}
	}

	.rotatecd{
		animation:rotating 10s  linear .3s infinite;
		-webkit-animation:rotating 10s  linear .3s infinite;
	}
	.stickplay{
		.cd_stick{
			-webkit-transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-ms-transform: rotate(0deg);
			transform: rotate(0deg);
		}
	}
	.slider
	{
		@media screen and (max-width:540px)
		{
			width:95%;
		}
		@media screen and (min-width:540px)
		{
			width:513px;
		}
		position:fixed;
		bottom:65px;
		display:flex;
		align-items:flex-start;
		justify-content:space-between;
		color:#fff;
		z-index:20;
	}
	.btnCotainer
	{
		z-index:20;
		display:flex;
		flex-direction:row;
		@media screen and (max-width:540px)
		{
			width:100%;
		}
		@media screen and (min-width:540px)
		{
			width:540px;
		}
		justify-content:space-around;
		align-items:center;
		position:fixed;
		bottom:14px;
	}
	.borderwhitefont{
		border: 2px solid @darkerAccentColor;
		color:white;
		padding:10px;
	}
	.whitefont
	{
		color:white;
	}
	.mask {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 5;
		@media screen and (max-width:540px)
		{
			width:100%;
		}
		@media screen and (min-width:540px)
		{
			width:540px;
		}
		height: 100%;
		background-color: rgba(0,0,0,.3);
	}
	.lyricsContainer
	{
		z-index:20;
		width:95%;
		overflow:hidden;
		.lyrics{
			width:100%;
			transition:transform 0.3s ease-out;
			transition:-ms-transform 0.3s ease-out;
			transition:-moz-transform 0.3s ease-out;
			transition:-webkit-transform 0.3s ease-out;
			transition:-o-transform 0.3s ease-out;
			transform-origin: 0px 0px 0px;
			p{
				text-align:center;
				color: #a8a7a7;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow:hidden;
			}
		}
	}
	.playingLyrics
	{
		color:#fff !important;
	}
</style>