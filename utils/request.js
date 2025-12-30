// #ifdef H5
// H5端：继续使用相对路径，由 manifest.json 中的 proxy 代理转发
const baBASE_URL = '/api/bizhi'; 
// #endif

// #ifndef H5
// 小程序或 App 端：直接使用完整的 HTTPS 绝对路径
// 这里的域名必须是你 manifest.json 代理中 target 的地址
const baBASE_URL = 'https://tea.qingnian8.com/api/bizhi'; 
// #endif

export function request(config={}){
	
	let {
		url,
		data={},
		method="GET",
		header={}
		}= config
			
	url =  baBASE_URL + url
	header['access-key']="207789253"
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url,
			data,
			method,
			header,
			success:res=>{
				if(res.data.errCode===0){
					resolve(res.data)
				}else if(res.data.errCode===400){
					uni.showModal({
						title:"错误提示",
						content:res.data.errMsg,
						showCancel:false
					})
					reject(res.data)
				}else{
					uni.showToast({
						title:res.data.errMsg,
						icon:"none"
					})
					reject(res.data)
				}
			},
			fail:err=>{
				reject(err)
			}
		})
	})	
} 