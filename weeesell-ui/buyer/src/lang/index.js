import Vue from 'vue';
import VueI18n from 'vue-i18n'; // 引入 i18n 模块
import locale from 'element-ui/lib/locale'; // elementUI语言包
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'; // elementUI中文包
import elementEnLocale from 'element-ui/lib/locale/lang/en'; // elementUI英文包
import elementIdLocale from 'element-ui/lib/locale/lang/pt'; // elementUI葡萄牙包
import zhLocale from './zh.js'; // 本地中文包
import enLocale from './en.js'; // 本地英文包
import ptLocale from './pt.js'; // 葡萄牙

Vue.use(VueI18n);

const messages = {
  Chinese: {
    ...zhLocale,
    ...elementZhLocale
  },
  English: {
    ...enLocale,
    ...elementEnLocale
  },
  Portuguese: {
    ...ptLocale,
    ...elementIdLocale
  }
};

const language = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'Chinese';
console.log("系统语言" + language)
// 创建国际化实例
const i18n = new VueI18n({
  locale: language, // 默认中文
  messages
});
locale.i18n((key, value) => i18n.t(key, value));

export default i18n;
