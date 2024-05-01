import Vue from "vue";
import App from "./App";
import * as filters from "./utils/filters.js"; // global filter
import uView from "uview-ui";
import store from "./store";
import config from '@/config/config';
import airBtn from "@/components/m-airbtn/index.vue";
import socketIO from './pages/mine/im/socket';
import messages from './locale/index'

let i18nConfig = {
  // locale: uni.getLocale(),
  locale: 'pt',
  messages
}

// #ifndef VUE3
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  i18n,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
const i18n = createI18n(i18nConfig)
export function createApp() {
  const app = createSSRApp(App)
  app.use(i18n)
  return {
    app
  }
}
// #endif












/**
 * 仅在h5中显示唤醒app功能
 * 在h5页面手动挂载
 * 
 */
// #ifdef H5
if (config.enableMiniBarStartUpApp) {
  let btn = Vue.component("airBtn", airBtn); //全局注册
  document.body.appendChild(new btn().$mount().$el);
}
// #endif

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)

/**
 * 全局filters
 */

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

// 引入Vuex
Vue.prototype.$store = store;
// Vue.prototype.socketIo = new socketIO();
Vue.use(uView);
Vue.config.productionTip = false;


/**
 * 注意！
 * 此处将常用的颜色嵌入到原型链上面
 * 颜色使用驼峰命名对应 uni.scss中全局颜色变量名
 * 如需更换主题请修改此处以及uni.scss中的全局颜色
 */
// 主题色
Vue.prototype.$mainColor = config.mainColor;
// 高亮主题色
Vue.prototype.$lightColor = config.lightColor;
// 辅助高亮颜色
Vue.prototype.$aiderLightColor = config.aiderLightColor;


// App.mpType = "app";

// const app = new Vue({
//   ...App,
// });
// app.$mount();
