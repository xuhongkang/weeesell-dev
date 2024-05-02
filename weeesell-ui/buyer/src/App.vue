<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import storage from "@/plugins/storage";
import { getBaseSite } from "@/api/common.js";
import { onMounted, ref } from 'vue'



export default {
  name: "App",
  mounted() {

      if (document.body.offsetWidth < 876) {
        console.log("手机端")
        window.location.href = 'https://m-b2b2c.weeesell.shop/'
      }
      else{
        this.init();
      }
  },
  created(){
    this.initLanguage();
  },
  methods:{
    init(){
      if(!storage.getItem("siteName")||!storage.getItem("logoImg")||!storage.getItem("sitelogo_expiration_time")) {
        this.getSite();
      }else{
        // 如果缓存过期，则获取最新的信息
        var now = new Date();
        if (now > storage.getItem("sitelogo_expiration_time")) {
          this.getSite();
          return;
        }else{
          window.document.title = storage.getItem("siteName");
          //动态获取icon
          let link =document.querySelector("link[rel*='icon']") ||document.createElement("link");
            link.type = "image/x-icon";
            link.href = storage.getItem("siteIcon");
            link.rel = "shortcut icon";
            document.getElementsByTagName("head")[0].appendChild(link);
        }
      }
    },
    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag;
    },
    initLanguage(){
      sessionStorage.getItem('language') ?
        sessionStorage.getItem('language'):sessionStorage.setItem('language','Chinese');
    },
    getSite(){
      //获取基本站点信息
      getBaseSite().then((res) => {
        if (res.success && res.result.settingValue) {
          let data = JSON.parse(res.result.settingValue);
          var now = new Date();
          // 过期时间
          var expirationTime = new Date().setHours(now.getHours() + 1);
          // 存放过期时间
          storage.setItem("sitelogo_expiration_time", expirationTime);
          // 存放信息
          storage.setItem('siteName', data.siteName);
          // storage.setItem('logoImg', data.buyerSideLogo);
          storage.setItem("siteIcon",data.buyerSideIcon);
          window.document.title = data.siteName;
          //动态获取icon
          let link =document.querySelector("link[rel*='icon']") ||document.createElement("link");
          link.type = "image/x-icon";
          link.href = data.buyerSideIcon;
          link.rel = "shortcut icon";
          document.getElementsByTagName("head")[0].appendChild(link);
        }
      });
    }
  }
};
</script>
<style lang="scss">
#app {
  @include background_color($light_background_color);
}
</style>
