import Foundation from "./Foundation.js";
import storage from "@/utils/storage.js";
import { logout } from "@/api/login";
import { getUserInfo } from "@/api/members";
import Vue from "vue";
import i18n from '../locale'
// export default {
// 	'401': i18n.t('errorCode.401'),
//     '403': i18n.t('errorCode.403'),
// 	'404': i18n.t('errorCode.404'),
// 	'default': i18n.t('errorCode.default')
// }



/**
 * 金钱单位置换  2999 --> 2,999.00
 * @param val
 * @param unit
 * @param location
 * @returns {*}
 */
export function unitPrice (val, unit, location) {
  if (!val) val = 0;
  let price = Foundation.formatPrice(val);
  if (location === "before") {
    return price.substr(0, price.length - 3);
  }
  if (location === "after") {
    return price.substr(-2);
  }
  return (unit || "") + price;
}

/**
 * 格式化价格  1999 --> [1999,00]
 * @param {*} val
 * @returns
 */
export function goodsFormatPrice (val) {
  if (typeof val == "undefined") {
    return val;
  }
  let valNum = new Number(val);
  return valNum.toFixed(2).split(".");
}


/**
 * 将内容复制到粘贴板
 */
import { h5Copy } from "@/js_sdk/h5-copy/h5-copy.js";
export function setClipboard (val) {
  let lang = uni.getLocale();
  // #ifdef H5
  if (val === null || val === undefined) {
    val = "";
  } else val = val + "";
  const result = h5Copy(val);
  if (result === false) {
    if (lang == 'en') {
      uni.showToast({
        title: "Don't support",
      });
    }
    else if (lang == 'pt') {
      uni.showToast({
        title: "Não apoie",
      })
    }
    else {
      uni.showToast({
      title: "不支持",
      });
    }
  } else {
    if (lang == 'en') {
      uni.showToast({
        title: "Copied successfully",
        icon: "none",
      })
    }
    else if (lang == 'pt') {
      uni.showToast({
        title: "Copiado com sucesso",
        icon: "none",
      })
    }
    else {
      uni.showToast({
      title: "复制成功",
      icon: "none",
      });
    }
  }
  // #endif

  // #ifndef H5
  uni.setClipboardData({
    data: val,
    success: function () {
      if (lang == 'en') {
        uni.showToast({
          title: "Copied successfully!",
          duration: 2000,
          icon: "none",
          });
      }
      else if (lang =='pt') {
        uni.showToast({
          title: "Copiado com sucesso!",
          duration: 2000,
          icon: "none",
          });
      }
      else {
        uni.showToast({
        title: "复制成功!",
        duration: 2000,
        icon: "none",
        });
      }
    },
  });
  // #endif
}

/**
 * 拨打电话
 */

export function callPhone (phoneNumber) {
  uni.makePhoneCall({
    phoneNumber: phoneNumber,
  });
}

/**
 * 脱敏姓名
 */

export function noPassByName (str) {
  if (null != str && str != undefined) {
    if (str.length <= 3) {
      return "*" + str.substring(1, str.length);
    } else if (str.length > 3 && str.length <= 6) {
      return "**" + str.substring(2, str.length);
    } else if (str.length > 6) {
      return str.substring(0, 2) + "****" + str.substring(6, str.length);
    }
  } else {
    return "";
  }
}

/**
 * 处理unix时间戳，转换为可阅读时间格式
 * @param unix
 * @param format
 * @returns {*|string}
 */
export function unixToDate (unix, format) {
  let _format = format || "yyyy-MM-dd hh:mm:ss";
  const d = new Date(unix * 1000);
  const o = {
    "M+": d.getMonth() + 1,
    "d+": d.getDate(),
    "h+": d.getHours(),
    "m+": d.getMinutes(),
    "s+": d.getSeconds(),
    "q+": Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds(),
  };
  if (/(y+)/.test(_format))
    _format = _format.replace(
      RegExp.$1,
      (d.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (const k in o)
    if (new RegExp("(" + k + ")").test(_format))
      _format = _format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return _format;
}

/**
 * 人性化显示时间
 *
 * @param {Object} datetime
 */
export function beautifyTime (datetime = "") {
  let lang = uni.getLocale();
  if (datetime == null || datetime == undefined || !datetime) {
    return "";
  }
  datetime = timestampToTime(datetime).replace(/-/g, "/");

  let time = new Date();
  let outTime = new Date(datetime);
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (time.getTime() < outTime.getTime()) {
    return parseTime(outTime, "{y}/{m}/{d}");
  }

  if (time.getFullYear() != outTime.getFullYear()) {
    return parseTime(outTime, "{y}/{m}/{d}");
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, "{m}/{d}");
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate();
    if (day == -1) {
      if (lang =='en') {
        return parseTime(outTime, "Yesterday {h}:{i}");
      }
      else if (lang == 'pt') {
        return parseTime(outTime, "Ondem {h}:{i}");
      }
      else {
        return parseTime(outTime, "昨天 {h}:{i}");
      }
    }

    if (day == -2) {
      if (lang =='en') {
        return parseTime(outTime, "2 days {h}:{i}");
      }
      else if (lang == 'pt') {
        return parseTime(outTime, "2 dias {h}:{i}");
      }
      else {
        return parseTime(outTime, "前天 {h}:{i}");
      }
    }

    return parseTime(outTime, "{m}-{d}");
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, "{h}:{i}");
  }

  let minutes = outTime.getMinutes() - time.getMinutes();
  if (minutes == 0) {
    if (lang == 'en') {
      return "Just now";
    }
    else if (lang == 'pt') {
      return "Agora mesmo";
    }
    else {
      return "刚刚";
    }
  }

  minutes = Math.abs(minutes);
  if (lang == 'en') {
    return `${minutes} minutes ago`;
  }
  else if (lang == 'pt') {
    return `${minutes} minutos atrás`;
  } 
  else {
    return `${minutes}分钟前`;
  }
}
// 时间转换
function timestampToTime (timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

/**
 * 13888888888 -> 138****8888
 * @param mobile
 * @returns {*}
 */
export function secrecyMobile (mobile) {
  mobile = String(mobile);
  if (!/\d{11}/.test(mobile)) {
    return mobile;
  }
  return mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
}

/**
 * 人性化时间显示
 *
 * @param {Object} datetime
 */
export function formatTime (datetime) {
  let lang = uni.getLocale();
  if (datetime == null) return "";

  datetime = datetime.replace(/-/g, "/");

  let time = new Date();
  let outTime = new Date(datetime);
  if (/^[1-9]\d*$/.test(datetime)) {
    outTime = new Date(parseInt(datetime) * 1000);
  }

  if (
    time.getTime() < outTime.getTime() ||
    time.getFullYear() != outTime.getFullYear()
  ) {
    return parseTime(outTime, "{y}-{m}-{d} {h}:{i}");
  }

  if (time.getMonth() != outTime.getMonth()) {
    return parseTime(outTime, "{m}-{d} {h}:{i}");
  }

  if (time.getDate() != outTime.getDate()) {
    let day = outTime.getDate() - time.getDate();
    if (day == -1) {
      if (lang == 'en') {
        return parseTime(outTime, "Yesterday {h}:{i}");
      }
      else if (lang == 'pt') {
        return parseTime(outTime, "Ondem {h}:{i}");
      }
      else {
        return parseTime(outTime, "昨天 {h}:{i}");
      }
    }

    if (day == -2) {
      if (lang == 'en') {
        return parseTime(outTime, "2 days {h}:{i}");
      }
      else if (lang == 'pt') {
        return parseTime(outTime, "2 dias {h}:{i}");
      }
      else {
        return parseTime(outTime, "前天 {h}:{i}");
      }
    }

    return parseTime(outTime, "{m}-{d} {h}:{i}");
  }

  if (time.getHours() != outTime.getHours()) {
    return parseTime(outTime, "{h}:{i}");
  }

  let minutes = outTime.getMinutes() - time.getMinutes();
  if (minutes == 0) {
    if (lang == 'en') {
      return "Just now";
    }
    else if (lang == 'pt') {
      return "Agora mesmo";
    }
    else {
      return "刚刚";
    }
  }

  minutes = Math.abs(minutes);
  if (lang == 'en') {
    return `${minutes} minutes ago`;
  }
  else if (lang == 'pt') {
    return `${minutes} minutos atrás`;
  }
  else {
    return `${minutes}分钟前`;
  }
}

/**
 * 时间格式化方法
 *
 * @param {(Object|string|number)} time
 * @param {String} cFormat
 * @returns {String | null}
 */
export function parseTime (time, cFormat) {
  let lang = uni.getLocale();
  if (arguments.length === 0) {
    return null;
  }

  let date;
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";

  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
      console.log("时间判断为number");
    }

    date = new Date(time.replace(/-/g, "/"));
  }

  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };

  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      if (lang == 'en') {
        return ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"][value];
      }
      else if (lang == 'pt') {
        return ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"][value];
      }
      else {
        return ["日", "一", "二", "三", "四", "五", "六"][value];
      }
    }

    return value.toString().padStart(2, "0");
  });

  return time_str;
}

/**
 * 清除逗号
 *
 */
export function clearStrComma (str) {
  str = str.replace(/,/g, ""); //取消字符串中出现的所有逗号
  return str;
}

/**
 * 判断用户是否登录
 * @param val  如果为auth则判断是否登录
 * 如果传入 auth 则为判断是否登录
 */
export function isLogin (val) {
  let userInfo = storage.getUserInfo();
  if (val == "auth") {
    return userInfo && userInfo.id ? true : false;
  } else {
    return storage.getUserInfo();
  }
}

/**
 * 退出登录
 *
 */
export function quiteLoginOut () {
  let lang = uni.getLocale();
  if (lang == 'en') {
    uni.showModal({
      title: "Notification",
      content: "Are you sure to log out?",
      confirmColor: Vue.prototype.$mainColor,
      async success (res) {
        if (res.confirm) {
          storage.setAccessToken("");
          storage.setRefreshToken("");
          storage.setUserInfo({});
          navigateToLogin("redirectTo");
          await logout();
        }
      },
    });
  }
  else if (lang == 'pt') {
    uni.showModal({
      title: "Notificação",
      content: "Tem certeza de que deseja sair?",
      confirmColor: Vue.prototype.$mainColor,
      async success (res) {
        if (res.confirm) {
          storage.setAccessToken("");
          storage.setRefreshToken("");
          storage.setUserInfo({});
          navigateToLogin("redirectTo");
          await logout();
        }
      },
    });
  }
  else {
    uni.showModal({
      title: "提示",
      content: "是否退出登录？",
      confirmColor: Vue.prototype.$mainColor,
      async success (res) {
        if (res.confirm) {
          storage.setAccessToken("");
          storage.setRefreshToken("");
          storage.setUserInfo({});
          navigateToLogin("redirectTo");
          await logout();
        }
      },
    });
  }
}

/**
 * 跳转im
 */
export function talkIm (storeId, goodsId, id) {
  if (isLogin('auth')) {
    let url = `/pages/mine/im/index?userId=${storeId}`
    if(goodsId && id) url = `/pages/mine/im/index?userId=${storeId}&goodsid=${goodsId}&skuid=${id}`
    uni.navigateTo({
      url
    });
  }
  else {
    tipsToLogin()
  }
}

export function tipsToLogin (type) {
	let lang = uni.getLocale()
	console.log(lang)
	if (!isLogin("auth")) {
		if(lang == 'en'){
			uni.showModal({
			  title: "Notification",
			  content: "Haven’t log in yet, please log in now",
			  confirmText: "Confirm",
			  cancelText: "Cancel",
			  confirmColor: Vue.prototype.$mainColor,
			  success: (res) => {
			    if (res.confirm) {
			      navigateToLogin();
			    } else if (res.cancel) {
			      if(type !== 'normal'){
			        uni.navigateBack();
			      }
			      
			    }
			  },
			});
			return false;
		}
		else if(lang == 'pt'){
			uni.showModal({
			  title: "Notificação",
			  content: "Ainda não entrou, entra agora",
			  confirmText: "Confirmar",
			  cancelText: "Canselar",
			  confirmColor: Vue.prototype.$mainColor,
			  success: (res) => {
			    if (res.confirm) {
			      navigateToLogin();
			    } else if (res.cancel) {
			      if(type !== 'normal'){
			        uni.navigateBack();
			      }
			      
			    }
			  },
			});
			return false;
		}
	  else {
		uni.showModal({
		  title: "提示",
		  content: "当前用户未登录，是否登录",
		  confirmText: "确定",
		  cancelText: "取消",
		  confirmColor: Vue.prototype.$mainColor,
		  success: (res) => {
			if (res.confirm) {
			  navigateToLogin();
			} else if (res.cancel) {
			  if(type !== 'normal'){
				uni.navigateBack();
			  }
			  
			}
		  },
		});
		return false;
	  }
  }
  return true;
}

/**
 * 获取用户信息并重新添加到缓存里面
 */
export async function userInfo () {
  let res = await getUserInfo();
  if (res.data.success) {
    storage.setUserInfo(res.data.result);
    return res.data.result;
  }
}

/**
 * 验证是否登录如果没登录则去登录
 * @param {*} val
 * @returns
 */

export function forceLogin () {
  let userInfo = storage.getUserInfo();
  if (!userInfo || !userInfo.id) {
    // #ifdef MP-WEIXIN

    uni.navigateTo({
      url: "/pages/passport/wechatMPLogin",
    });

    // #endif

    // #ifndef MP-WEIXIN

    uni.navigateTo({
      url: "/pages/passport/login",
    });

    //  #endif
  }
}

/**
 * 获取当前加载的页面对象
 * @param val
 */
export function getPages (val) {
  const pages = getCurrentPages(); //获取加载的页面
  const currentPage = pages[pages.length - 1]; //获取当前页面的对象
  const url = currentPage.route; //当前页面url

  return val ? currentPage : url;
}

/**
 * 跳转到登录页面
 */
export function navigateToLogin (type = "navigateTo") {
  /**
   * 此处进行条件编译判断
   * 微信小程序跳转到微信小程序登录页面
   * H5/App跳转到普通登录页面
   */
  // #ifdef MP-WEIXIN
  uni[type]({
    url: "/pages/passport/wechatMPLogin",
  });
  // #endif
  // #ifndef MP-WEIXIN
  uni[type]({
    url: "/pages/passport/login",
  });
  //  #endif
}

/**
 * 服务状态列表
 */
export function serviceStatusList (val) {
  let lang = uni.getLocale();
  if (lang == 'en') {
    let statusList = {
      APPLY: "Customer service applied",
      PASS: "Customer service passed",
      REFUSE: "Customer service rejected",
      BUYER_RETURN: "Return, waiting for seller",
      SELLER_RE_DELIVERY: "Replacement",
      SELLER_CONFIRM: "Seller confirm",
      SELLER_TERMINATION: "Customer service terminated by seller",
      BUYER_CONFIRM: "Buyer confirm",
      BUYER_CANCEL: "Customer service cancelled by buyer",
      WAIT_REFUND: "Waiting for refund",
      COMPLETE: "Customer service completed",
    };
    return statusList[val];
  }
  else if (lang == 'pt') {
    let statusList = {
      APPLY: "Atendimento ao cliente aplicado",
      PASS: "Atendimento ao cliente aprovado",
      REFUSE: "Atendimento ao cliente rejeitado",
      BUYER_RETURN: "Devolução, aguardando vendedor",
      SELLER_RE_DELIVERY: "Substituição",
      SELLER_CONFIRM: "Vendedor confirma",
      SELLER_TERMINATION: "Atendimento ao cliente encerrado pelo vendedor",
      BUYER_CONFIRM: "Comprador confirma",
      BUYER_CANCEL: "Atendimento ao cliente cancelado pelo comprador",
      WAIT_REFUND: "Aguardando reembolso",
      COMPLETE: "Atendimento ao cliente concluído",
    };
    return statusList[val];
  }
  else {
    let statusList = {
      APPLY: "申请售后",
      PASS: "通过售后",
      REFUSE: "拒绝售后",
      BUYER_RETURN: "买家退货，待卖家收货",
      SELLER_RE_DELIVERY: "商家换货/补发",
      SELLER_CONFIRM: "卖家确认收货",
      SELLER_TERMINATION: "卖家终止售后",
      BUYER_CONFIRM: "买家确认收货",
      BUYER_CANCEL: "买家取消售后",
      WAIT_REFUND: "等待平台退款",
      COMPLETE: "完成售后",
    };
    return statusList[val];
  }
}

/**
 * 订单状态列表
 */
export function orderStatusList (val) {
  let lang = uni.getLocale();
  if (lang == 'en') {
    let orderStatusList = {
      UNDELIVERED: "Waiting for delivery",
      UNPAID: "Waiting for payment",
      PAID: "Paid",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
      COMPLETE: "Completed",
      TAKE: "Waiting for check",
      STAY_PICKED_UP: "Waiting for pick up",
    };
    return orderStatusList[val];
  }
  else if (lang == 'pt') {
    let orderStatusList = {
      UNDELIVERED: "Esperando pela entrega",
      UNPAID: "À espera de pagamento",
      PAID: "Pago(a)",
      DELIVERED: "Entregue",
      CANCELLED: "Cancelado(a)",
      COMPLETED: "Concluído(a)",
      COMPLETE: "Concluído(a)",
      TAKE: "Aguardando verificação",
      STAY_PICKED_UP: "Esperando para pegar",
    };
    return orderStatusList[val];
  }
  else {
    let orderStatusList = {
      UNDELIVERED: "待发货",
      UNPAID: "未付款",
      PAID: "已付款",
      DELIVERED: "已发货",
      CANCELLED: "已取消",
      COMPLETED: "已完成",
      COMPLETE: "已完成",
      TAKE: "待核验",
      STAY_PICKED_UP: "待自提",
    };
    return orderStatusList[val];
  }
}
