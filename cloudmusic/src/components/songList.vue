<template>
	<div id="listsheet" class="BottomSheetCt">
		<mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
			<mu-list @itemClick="closeBottomSheet"> 
				<mu-sub-header>
					播放列表({{songList.length}})
				</mu-sub-header>
				<div class="slItemContain">
					<mu-list-item  v-for="(item,index) in songList" :key="index"> 
						<div class="flexlist" :class="{listpying:item.id==audio.id}">
							<div  @click="PlaySong(index)"  class="flexlist_name">{{item.name}}
								<span class="listsinger">
									&nbsp;-{{item.singer}}
								</span>
							</div>
							<div @click="remove(index)" class="flexlist_btn">X</div>
						</div>
					</mu-list-item>
				</div>
			</mu-list>
		</mu-bottom-sheet>
	</div>
</template>
<script>
	import {mapGetters} from 'vuex'
	export default {
		data () {
			return {
				bottomSheet: false
			}
		},
		methods: {
			closeBottomSheet() {
				this.bottomSheet = false
			},
			openBottomSheet() {
				this.bottomSheet = true
			},
			PlaySong(index)
			{
				var audioPlay=document.getElementById("audioPlay");
				audioPlay.pause();
				this.$store.commit('pause');
				let audio=this.songList[index];
				this.$store.commit("setCurrentIndex",index+1);
				this.$store.dispatch("getSong",audio.id)
			},
			remove(index)
			{
				this.$store.commit("removeSongFromArr",index)
			}
		},
		computed:{
			...mapGetters([
				'songList',
				'audio'
				])
		}
	}
</script>
<style lang="less">
	@import "../assets/theme.less";
	.mu-bottom-sheet {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		
		@media screen and (max-width:540px)
		{
			left:50% !important; 
			margin-left:-50%;
			width:100%;
		}
		@media screen and (min-width:540px)
		{
			left:50% !important;
			margin-left:-270px;
			width:540px;
		}
	}
	.mu-overlay
	{
		width:540px;
		@media screen and (max-width:540px)
		{
			left:50% !important; 
			margin-left:-50%;
		}
		@media screen and (min-width:540px)
		{
			left:50% !important;
			margin-left:-270px;
		}
		top: 0;
		bottom: 0;
	}
	.slItemContain
	{
		overflow-y: scroll;
		height:320px;
	}
	.flexlist
	{
		display:flex;
		align-items:center;
		&_name{
			width:92%;
			.listsinger{
				color: #737171;
				font-size: 12px;
			}
		}
		&_btn{
			width:8%;
		}
	}
	.listpying{
		color:@primaryColor
	}
	
</style>