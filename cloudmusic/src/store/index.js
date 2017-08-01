import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import api from '../api'
Vue.use(Vuex)
const store=new Vuex.Store({
	state:{
		audio: {
			'id': 0,
			'name': '歌曲名称',
			'singer': '演唱者',
			'albumPic': '/static/default_cover.png',
			'location': '',
			'album': ''
		},
		currentIndex:0,//当前歌在歌单中的位置
		playing:false,//正在播放
		songList: [],// 播放列表
		songLoading:false, //正在读取要播放的歌曲
		nowSongListId:0,//目前的歌单id
		playBarShow:true,//这个参数为true&&歌单长度>0,显示player.vue
  		currentTime:0,//目前歌曲时间
  		bufferedTime:0,//缓冲时间
  		durationTime: 0,//当前歌曲长度
  		songError:false,//歌曲读取错误
  		//currentPercent:0,

  	},
  	getters:{
  		audio:state=>state.audio,
  		songList:state=>state.songList,
  		nowSongListId:state=>state.nowSongListId,
  		songLoading:state=>state.songLoading,
  		playing:state=>state.playing,
  		currentIndex:state=>state.currentIndex,
  		playBarShow:state=>state.playBarShow,
  		currentTime:state=>state.currentTime,
  		bufferedTime:state=>state.bufferedTime,
  		durationTime:state=>state.durationTime,
  		currentPercent:state=>{
  		  return (state.currentTime/state.durationTime)*100;
  		},
  		songError:state=>state.songError,
  	},
  	mutations:{
  		pause (state) {
  			state.playing = false
  		},
  		play(state){
  			state.playing = true
  		},
  		setSong(state,song)
  		{
			//var arr=Array.prototype.concat.apply(song,[]);
			state.songList.forEach(function(value,index){
				if(value.id===song.id)
				{
					state.currentIndex=index+1;
				}
			})
		},
		setCurrentIndex(state,index)
		{
			state.currentIndex=index;
		},
		clearSongList(state)
		{
			state.songList=[];
		},
		allIn(state,songArr)
		{
			state.songList=songArr;
		},
		songLoading(state)
		{
			state.songLoading=true;
		},
		songLoadingClose(state)
		{
			state.songLoading=false;
		},
		setAudio(state)
		{
			state.audio=state.songList[state.currentIndex-1]
		},
		setAudioLocation(state,url)
		{
			state.audio.location=url;
		},
		nowSongList(state,listid)
		{
			state.nowSongListId=listid;
		},
		NextSong(state)
		{
			state.currentIndex++
			if (state.currentIndex > state.songList.length) {
				state.currentIndex = 1
			}
		},
		PreSong(state)
		{
			state.currentIndex--
			if (state.currentIndex < 1) {
				state.currentIndex = state.songList.length;
			}
		},
		removeSongFromArr(state,index)
		{
			state.songList.splice(index, 1);
			if (state.songList.length === 0) {
				state.audio = {
					'id': 0,
					'name': '歌曲名称',
					'singer': '演唱者',
					'albumPic': '/static/player-bar.png',
					'location': '',
					'album': ''
				}
				state.playing = false
			}
		},
		setPlayBar(state,result)
		{
			state.playBarShow=result;
		},
		setBufferedTime(state,buffer)
		{
			state.bufferedTime=buffer;
		},
		setDurationTime(state,time)
		{
			state.durationTime = time;	
		},
		setCurrentTime(state,time)
		{
			state.currentTime = time;
		},
		unshiftSong(state,song)
		{
			state.songList.unshift(song)
		},
		songError(state,result)
		{
			state.songError=result
		},
		// currentPercent(state,percent)
		// {
		// 	state.currentPercent=percent;
		// }
	},
	actions:{
		getSong({commit,state},songId){
			commit("songLoading");
			Axios.get(api.getSong(songId)).then(res=>{
				let url = res.data.data[0].url;
				commit("setAudio");
				commit("setAudioLocation",url);
				if(url==null)
				{
					commit("songError",true)
				}
			}).catch((err)=>{
				console.log(err)
				commit("songError",true)
				//window.alert('获取歌曲信息出错！')
			})
		}
	}
})
export default store