/**
 * 时间戳转相对时间
 * @param {Number|String} timestamp 时间戳 (支持10位秒或13位毫秒)
 * @returns {String|null} 转换后的字符串 或 null
 */
export function timeAgo(timestamp) {
  if (!timestamp) return null;
  // 1. 处理时间戳格式（兼容 10 位秒级时间戳）
  // 如果时间戳长度是 10 位，说明是秒，需要乘以 1000 转换为毫秒
  let ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  if (String(ts).length === 10) {
    ts *= 1000;
  }

  // 2. 获取当前时间并计算差值
  const now = Date.now();
  const diff = now - ts;

  // 如果是未来时间，或者非法时间，直接返回 null 或按需处理
  if (diff < 0) return null;

  // 3. 定义时间常量 (毫秒)
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day; // 这里按一个月30天估算

  // 4. 判断逻辑
  // A. 1分钟内 -> 显示 "1分钟"
  if (diff < minute) {
    return "1分钟";
  }
  
  // B. 1小时内 -> 显示 "X分钟"
  if (diff < hour) {
    return Math.floor(diff / minute) + "分钟";
  }
  
  // C. 1天内 -> 显示 "X小时"
  if (diff < day) {
    return Math.floor(diff / hour) + "小时";
  }
  
  // D. 1月内 -> 显示 "X天"
  if (diff < month) {
    return Math.floor(diff / day) + "天";
  }
  
  // E. 3月内 -> 显示 "X月"
  if (diff < 3 * month) {
    return Math.floor(diff / month) + "月";
  }

  // F. 超过3个月 -> 返回 null
  return null;
}

export function gotoHome(){
	uni.showModal({
		title:"提示",
		content:"页面有误，返回首页",
		showCancel:false,
		success:(res)=> {
			if(res.confirm){
				uni.reLaunch({
					url:"/pages/index/index"
				})
			}
		}
	})
}