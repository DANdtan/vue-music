const scrollBottom =function(){
//判断浏览器窗口是否滚动到底部
let scrollTop=document.body.scrollTop;
let clientHeight =document.documentElement.clientHeight
let scrollHeight = document.body.scrollHeight;
if(scrollTop + clientHeight  == scrollHeight)
{
	return true;
}
else{ return false}
}
//节流阀，一定时间内只能执行一次，例如一秒最多一次。
let throttlefun=null;
const throttle=function (func,wait)
{
	let context,
	args,startTime=Date.parse(new Date());
	return function(){
		let currentTime=Date.parse(new Date());
		let time=wait-(currentTime-startTime);
		context=this;
		args=arguments;
		let result=scrollBottom();
		if(result){
			clearTimeout(throttlefun);
			if(time<=0){
				func.apply(context,args)
				startTime=Date.parse(new Date());
			}
			else{
				throttlefun=setTimeout(func,time)
			}
		}
	}

}
//防抖动，触发非常频繁的事件合并成一次执行
let debouncefun=null;
const debounce=function(func,wait){
	return function(){
		clearTimeout(debouncefun);
		debouncefun=setTimeout(func,wait);
	}
}
export default {throttle,debounce};