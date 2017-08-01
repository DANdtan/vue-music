<template>
	<div>
		<mu-appbar >
			<mu-icon-button @click="back" icon='arrow_back' slot="left"/></mu-icon-button>
			<mu-text-field v-model="searchText" @input="debounce" hintText="搜索音乐、歌手、歌词"/>
		</mu-appbar>
		<mu-list>
			<div v-for="(item,index) in listMsg" @click="playmusic(item)">
				<mu-list-item :title="item.name" :key="index" :describeText="item.ar[0].name+'-'+item.al.name">
				</mu-list-item>
			</div>
		</mu-list>
		<Toast ref="toast"></Toast>
	</div>
</template>
<script>
	import debounce from '../assets/throttle'
	import api from '../api'
	import Toast from '../components/toast'
	export default{
		data(){
			return {
				searchText:"",
				listMsg:[],
			}
		},
		components:{Toast},
		methods:{
			back(){
				this.$router.go(-1);
			},
			search(){
				let val =this.$data.searchText;
				let reval=val.replace(/(^\s*)|(\s*$)/g, ""); 
				if(reval!=""){
					this.$http.get(api.search(val)).then((res)=>{
						this.$data.listMsg=res.data.result.songs;
					},(rej)=>{
						this.$refs.toast.showToast('没有搜索到相关信息');this.$data.listMsg=[];
					}).catch((err)=>{
						this.$refs.toast.showToast('没有搜索到相关信息');this.$data.listMsg=[];
					})
				}
				else{
					this.$data.listMsg=[];
				}
			},
			debounce(val){
				//防抖动
				(debounce.debounce(this.search,1400))();
			},
			playmusic(song)
			{
				var audioPlay=document.getElementById("audioPlay");
				audioPlay.pause();
				this.$store.commit('pause');
				var audio = {};
				audio.id = song.id;
				audio.singer = song.ar[0].name;
				audio.albumPic = song.al.picUrl;
				audio.name = song.name;
				audio.other=true;
				this.$store.commit("unshiftSong",audio)
				this.$store.commit("setSong",audio);
				this.$store.dispatch("getSong",audio.id)
			}
		}
	}
</script>
<style scoped lang="less">
	
</style>