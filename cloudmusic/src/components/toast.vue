<template>
	<transition name="showtoast">
	<div class="toastContainer" v-show="toast">
			{{mgs}}
		</div>
	</transition>
</template>
<script>
	export default {
		data(){
			return {
				toast: false,
				mgs:"提示"
			}
		},
		methods:{
			showToast (val='可能网络原因,加载出错') {
				this.$data.mgs=val;
				this.toast = true;
				if (this.toastTimer) clearTimeout(this.toastTimer)
					this.toastTimer = setTimeout(() => { this.toast = false;
						clearTimeout(this.toastTimer) }, 2000)
			},
	}
}
</script>
<style scoped>
	.toastContainer{
		position: fixed;
		z-index:99999;
		bottom:4rem;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		word-wrap:break-word;
		width:12rem;
		background-color: rgba(0, 0, 0, 0.7);
		color: #ffffff;
		text-align: center;
		padding: 5px;
	}
	.showtoast-enter-active, .showtoast-leave-active {
		 transition: opacity 0.5s ease-out;
	}
	.showtoast-enter, .showtoast-leave-to {
		opacity: 0;
	}
</style>