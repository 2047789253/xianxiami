<template>
	<view class="preview" v-if="currentInfo">
		<swiper circular :current="currentIndex" @change="swiperChange">
			<swiper-item v-for="(item,index) in classList" :key="item._id">
				<image v-if="readImgs.includes(index)" @click="maskChange" :src="item.picurl" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
			
		<view class="mask" v-if="maskState">
			<view class="goback" @click="goBack" :style="{top:getStatusBarHeight()+'px'}">
				<uni-icons type="back" color="#fff" size="20"></uni-icons>
			</view>
			<view class="count">{{currentIndex+1}}/{{classList.length}}</view>
			<view class="time">
				<uni-dateformat :date="new Date()" format="hh:mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box" @click="clickInfo">
					<uni-icons type="info" size="28"></uni-icons>
					<view class="text">信息</view>
				</view>
				<view class="box" @click="clickScore">
					<uni-icons type="star" size="28"></uni-icons>
					<view class="text">{{currentInfo.score}}分</view>
				</view>
				<view class="box" @click="clickDownload">
					<uni-icons type="download" size="23"></uni-icons>
					<view class="text">下载</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="infoPopup" type="bottom">
			<view class="infoPopup">
				<view class="popHeader">
					<view class="close1">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
					<view class="title">壁纸信息</view>
					<view class="close" @click="clickInfoClose">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y>
					<view class="content">
						
						<view class="row">
							<view class="label">壁纸ID: </view>
							<text class="value">{{currentInfo._id}}</text>
						</view>
						
						<view class="row">
							<view class="label">分类: </view>
							<text class="value class">明星美女</text>
						</view>
						
						<view class="row">
							<view class="label">发布者: </view>
							<text class="value">{{currentInfo.nickname}}</text>
						</view>
						
						<view class="row">
							<text class="label">评分: </text>
							<view class="value roteBox">
								<uni-rate touchcancel="false" readonly :value="currentInfo.score" size="16"/>
								<text class="score">{{currentInfo.score}}分</text>
							</view>
						</view>
						
						<view class="row">
							<view class="label">摘要: </view>
							<view class="value">{{currentInfo.description}}</view>
						</view>
						
						<view class="row">
							<view class="label">标签: </view>
							<view class="value tabs">
								<text class="tab" v-for="tab in currentInfo.tabs">{{tab}}</text>
							</view>
						</view>
						
						<view class="copyright">
							搞不懂为什么一堆人在那说1.0剧情，内测和开服被带节奏滤镜太严重了，不至于说好但也算中规中矩。后面boss站演出也不差，跟自己比确实差点意思，但还是超过95%二游。我自己3个原神55级号，前前后后退坑入坑几次，崩铁开服第一天玩到去年8月满级号，崩三也玩过。
						</view>
						
						<view class="safe-area-inset-buttom"></view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
		<uni-popup ref="scorePopup" :is-mask-click="false">
			<view class="scorePopup">
				<view class="popHeader">
					<view class="close1">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
					<view class="title">{{isScore?'评分过了':'壁纸评分'}}</view>
					<view class="close" @click="clickScoreClose">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>
				<view class="content">
					<uni-rate v-model="userScore" allowHalf 
					:disabled="isScore" disabled-color="#ffca3e"/>
					<text class="text">{{userScore}}分</text>
				</view>
				<view class="footer">
					<button @click="submitScore"
					 :disabled="!userScore || isScore" 
					 type="default" size="mini" plain>确认评分</button>
				</view>
			</view>
		</uni-popup>
				
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { getStatusBarHeight } from '../../utils/system'
import {onLoad} from "@dcloudio/uni-app"
import {apiGetSetupScore,apiWriteDownload} from "@/APIs/apis.js"
const maskState = ref(true)		
const classList=ref([])
const infoPopup = ref(null)
const scorePopup = ref(null)
const userScore= ref(0)
const currentId=ref(null)
const currentIndex=ref(0)
const storeClassList = uni.getStorageSync("storgClassList") || []
const readImgs=ref([])
const currentInfo=ref({})
const isScore=ref(false)

const maskChange = ()=>	maskState.value = !maskState.value
const clickInfo = ()=>infoPopup.value.open()
const clickInfoClose= ()=>infoPopup.value.close()
const clickScore= ()=>{
	if(currentInfo.value.userScore){
		isScore.value=true
		userScore.value=currentInfo.value.userScore
	}
	scorePopup.value.open()	
}
const clickScoreClose= ()=>{
	scorePopup.value.close()
	userScore.value = 0
	isScore.value=false
}
const submitScore=async()=>{
	uni.showLoading({
		title:"加载中..."
	})
	let{classid,_id:wallId}=currentInfo.value
	let res = await apiGetSetupScore({
		classid,
		wallId,
		userScore:userScore.value
	})
	uni.hideLoading()
	if(res.errCode === 0){
		uni.showToast({
			title:"评分成功",
			icon:"none"
		})
		classList.value[currentIndex.value].userScore = userScore.value
		uni.setStorageSync("storgClassList",classList.value)
		clickScoreClose()
	}
}
const goBack=()=>{	
	uni.navigateBack({
		success:()=>{},
		fail:(err)=>{
			uni.reLaunch({
				url:"/pages/index/index"
			})
		}
	})		
}

//小图变大图
classList.value = storeClassList.map(item=>{
	return {
		...item,
		picurl:item.smallPicurl.replace("_small.webp",".jpg")
	}
})
//拿到当前点开的图片的索引currentIndex
onLoad((e) => {
	currentId.value = e.id	
	const index = classList.value.findIndex(item =>item._id===currentId.value)
	    if (index !== -1) {
	        currentIndex.value = index;
	        currentInfo.value = classList.value[index];
	    } else {
	        // 兜底：如果没找到，默认取第一张，防止 currentInfo 为空
	        currentIndex.value = 0;
	        currentInfo.value = classList.value[0] || {}; 
	    }	    
	readImagsFun()
})
//轮播图切换改变索引
const swiperChange = (e) => {
	currentIndex.value = e.detail.current
	currentInfo.value = classList.value[currentIndex.value]
	readImagsFun()
}
const readImagsFun = () => {
	readImgs.value.push(
	currentIndex.value<=0?classList.value.length-1:currentIndex.value-1,
	currentIndex.value,
	currentIndex.value+1>=classList.value.length-1?0:currentIndex.value+1
	)
	readImgs.value = [...new Set(readImgs.value)]
}
//点击下载
const clickDownload = async () => {
    // #ifdef H5
    uni.showModal({ content: "请长按保存壁纸", showCancel: false })
    // #endif    

    // #ifndef H5
    try {
        uni.showLoading({ title: "下载中...", mask: true })        
        let { classid, _id: wallId } = currentInfo.value
        let res = await apiWriteDownload({ classid, wallId })
        if (res.errCode !== 0) throw res
        uni.getImageInfo({
            src: currentInfo.value.picurl,
            success: (res) => {          
                uni.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success: (saveRes) => {
                        uni.showToast({title:"保存成功，请在相册查看", icon:"none" })
                    },
                    fail: (saveErr) => {
                        console.error("saveImageToPhotosAlbum 失败：", saveErr);
                    },
                    complete: () => uni.hideLoading()
                })
            },
            fail: (imageErr) => {
                uni.hideLoading()
                uni.showToast({ title:"图片读取失败，请检查域名配置", icon:"none"})
            }
        })        
    } catch (err) {
        console.error("流程触发了 catch：", err);
        uni.hideLoading()
    }
    // #endif
}
</script>

<style lang="scss" scoped>
.preview{
	width: 100%;
	height: 100vh;
	position: relative;
	swiper{
		width: 100%;
		height: 100%;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.mask{
		&>view{
			position: absolute;
			left: 0;
			right: 0;
			margin: auto;
			color: #fff;
			width: fit-content;
		}
		
		.goback{
			width: 38px;
			height: 38px;
			background: rgba(0, 0, 0, 0.5);
			left: 30rpx;
			margin-left: 0;
			border-radius: 100px;
			top: 0;
			backdrop-filter: blur(10rpx);
			border: 1rpx solid rgba(255,255,255,0.3);
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.count{
			top: 10vh;
			background-color: rgba(0, 0, 0, 0.3);
			font-size: 28rpx;
			border-radius: 40rpx;
			padding: 8rpx 28rpx;
			backdrop-filter: blur(10rpx);
		}
		.time{
			font-size: 140rpx;
			top: calc(10vh + 80rpx);
			font-weight: 100;
			line-height: 1em;
			text-shadow: 0 4rpx rgba(0,0,0,0.3); 
		}
		.date{			
			font-size: 34rpx;
			top: calc(10vh + 240rpx);
			text-shadow: 0 2rpx rgba(0,0,0,0.3);
		}
		.footer{
			background: rgba(255,255,255,0.8);
			bottom: 10vh;
			width: 65vw;
			height: 120rpx;
			border-radius: 60rpx;
			color: #000;
			display: flex;
			justify-content: space-around;
			align-items: center;
			box-shadow: 0 2rpx 0 rgba(0,0,0,0.1);
			backdrop-filter: blur(20rpx);
			.box{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 2rpx 12rpx;
				.text{
					font-size: 26rpx;
					color: $text-font-color-2;
				}
			}
		}
	}

	.popHeader{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		border-bottom: 1rpx solid #eee;
		.title{
			font-size: 26rpx;
			color:$text-font-color-2;
		}
		.close{
			padding: 10rpx;
		}
		.close1{
			padding: 10rpx;
			visibility: hidden;
		}
	}

	.infoPopup{
		background: #fff;
		padding: 30rpx;
		border-radius: 30rpx 30rpx 0 0 ;
		overflow: hidden;		
		scroll-view{
			max-height: 60vh;
			margin-top: 20rpx;
			.content{
				.row{
					display: flex;
					padding: 16rpx 0;
					font-size: 32rpx;
					line-height: 1.7em;
					.label{
						text-align: right;
						width: 140rpx;
						color: $text-font-color-2;
						font-size: 30rpx;
					}
					.value{
						flex: 1;
						width: 0;
					}
					.roteBox{
						display: flex;
						align-items: center;
						.score{
							margin-left: 10rpx;
							color: $text-font-color-2;
							font-size: 26rpx;
						}
					}
					.tabs{
						display: flex;
						flex-wrap: wrap;
						.tab{
							border: 1px solid $brand-theme-color;
							color: $brand-theme-color;
							font-size: 22rpx;
							padding: 10rpx 30rpx;
							border-radius: 40rpx;
							margin: 0 10rpx 10rpx 0;
							line-height: 1em;
						}
					}
					.class{
						color: $brand-theme-color;
					}					
				}
				.copyright{
					font-size: 28rpx;
					padding: 20rpx;
					background-color: #f6f6f6;
					color: #666;
					border-radius: 10rpx;
					margin-top: 20rpx;
					line-height: 1.6em;
				}
			}
		}
	}
}
	.scorePopup{
		background: #fff;
		padding: 30rpx;
		width: 70vw;
		border-radius: 30rpx;
		.content{
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20rpx 0;
			.text{
				color: #ffca3e;
				padding-left:10rpx;
				width: 80rpx;
				line-height: 1em;
				text-align: right;
			}
		}
		.footer{
			justify-content: center;
			align-items: center;
			display: flex;
			padding: 10rpx 0; 
		}
	}      
</style>
