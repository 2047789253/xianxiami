import { request } from "@/utils/request"

export const apiGetBanner = ()=>{
	return request({
		url: '/homeBanner',
		method:"POST"
	})
}

export const apiGetDayRandom = ()=>{
	return request({url: '/randomWall'})
}

export const apiGetNotice = (data)=>{
	return request({
		url: '/wallNewsList',
		data
	})
}

export const apiGetClassify= (data)=>{
	return request({
		url: '/classify',
		data
	})
}

export const apiGetClassList= (data)=>{
	return request({
		url: '/wallList',
		data
	})
}

export const apiGetSetupScore= (data)=>{
	return request({
		url: '/setupScore',
		data
	})
}

export const apiWriteDownload= (data)=>{
	return request({
		url: '/downloadWall',
		data
	})
}

//获取用户个人信息接口
export const apiUserInfo= (data)=>{
	return request({
		url: '/userInfo',
		data
	})
}

export const apiGetHistoryList= (data)=>{
	return request({
		url: '/userWallList',
		data
	})
}

export const apiNoticeDetail= (data)=>{
	return request({
		url: '/wallNewsDetail',
		data
	})
}

export const apiSearchData= (data)=>{
	return request({
		url: '/searchWall',
		data
	})
}
