// 国际化 json 文件，文件内容详见下面的示例
import en from '@/locale/en.json'
import zhHans from '@/locale/zh-Hans.json'
import pt from '@/locale/pt.json'
const messages = {
	en,
	pt,
	'zh-Hans': zhHans
}
 
let lang = uni.getLocale()
 
// #ifdef H5
// 这是为了掩饰，强制H5平台下为英文
lang = 'en'
// #endif
 
let i18nConfig = {
	locale: lang, // 获取已设置的语言
	messages,
	fallbackLocale: 'en',
}
 
 
// VUE3
// #ifdef VUE3
import {
	createI18n
} from 'vue-i18n'
const i18n = createI18n(i18nConfig)
export default i18n
// #endif