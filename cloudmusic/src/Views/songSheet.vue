<template>
	<div class="ListContainer" id="ListContainer"> 
		<div class="listcontent">
			<div class="ListTitle">
				<mu-chip class="chip">
					全部歌单
				</mu-chip>
			</div>
			<div class="FlexList" id="FlexList" >
				<!-- :style="{height:FlexHeight+'px'}" -->
				<div class="FlexItem" v-for="item in songList" :key="item.id">
					<router-link class="flexLink" :to="{name:'songListView',params:{ id: item.id, name: item.name, coverImg: item.coverImgUrl, creator: item.creator, count: item.playcount, desc: item.name }}">
						<div class="imgCountNum">
							<mu-icon value="headset" :size="12"/>
							{{item.playCount| filterplaycount}}
						</div>
						<img :src="item.coverImgUrl" class="imgInList" lazy="load">
						<div class="itemDescript">{{item.name}}</div>
					</router-link>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import api from '../api'
	import throttle from '../assets/throttle'
	export default{
		data(){
			return {
				songList: [],
				offset: 0,
				loading: false,
				//FlexHeight:0,
				throttleFun:null//存放节流阀返回的函数，离开页面的时候移除这个绑定事件
			}
		},
		methods:{
			getData:function(){
				this.loading = true
				this.$http.get(api.getPlayListByWhere('全部', 'hot', this.offset, true, 6)).then((res) => {
					var total = res.data.total
					var list = (res.data.playlists)
					this.songList.push(...list)
					this.offset = this.offset + 6
					if (this.offset > total) 
					{
						this.offset = total
						this.loading = false
					}
				})
			},
		},
		filters:{
			filterplaycount:(value)=>{
				let num=Number(value);
				let count=(num<=9999)?num:(Math.ceil(num/10000)).toString()+"万";
				return count
			}
		},
		created(){
			this.getData();
		},
		beforeRouteEnter(to,from,next)
		{
			next(vm=>{
				vm.throttleFun=throttle.throttle(vm.getData,1100);
				window.addEventListener('scroll',vm.throttleFun,false);
			})
		},
		beforeRouteLeave(to, from, next)
		{
			window.removeEventListener('scroll',this.throttleFun,false);
			next(true)
		}
	}
</script>
<style lang="less" scoped>
	.ListContainer{
		overflow:auto;
		-webkit-overflow-scrolling: touch;
	}
	.chip
	{
		margin:4px 0px;
	}
	listcontent{
		height:50px;
	}
	.ListTitle{
		width:100%;
		padding:10px;
	}
	.FlexList{
		width:100%;
		margin-Bottom:60px;
		display:flex;
		flex-wrap: wrap;
		align-items:center;
		justify-content: space-around;

	}
	.FlexItem{
		height:auto;
		position:relative;
		width:48%;
		.flexLink{
			width:inherit;
			img[lazy="load"]
			{
				background: url('../../static/default_cover.png') no-repeat;
				background-size: cover;
			}
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

</style>