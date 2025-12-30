let windowInfo = uni.getWindowInfo()
export const getStatusBarHeight =()=> windowInfo.statusBarHeight || 15

export const getTitleBarHeight =()=>{
	if(uni.getMenuButtonBoundingClientRect){
		let {top,height} = uni.getMenuButtonBoundingClientRect()
		return  height + (top - getStatusBarHeight())*2
	}else{
		return 50
	}
}

export const getNavBarHeight =()=>getStatusBarHeight()+getTitleBarHeight()