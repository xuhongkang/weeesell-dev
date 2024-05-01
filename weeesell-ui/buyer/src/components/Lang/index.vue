<template>
  <li>
    <div class="username-p">
      <div>
<!--        语言切换-->
        <span class="username">{{ $t('language') }}</span>
      </div>
      <transition name='fade'>
        <ul class="drop-items">
          <li @click="changeLanguage('zh')">中文</li>
          <li @click="changeLanguage('en')">English</li>
          <li @click="changeLanguage('pt')">Português</li>
        </ul>
      </transition>
    </div>
  </li>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    changeLanguage(lang) {
      console.log('切换多语言成功')
      console.log(lang)
      this.$i18n.locale = lang // 设置给本地的i18n插件
      // this.$store.dispatch('language', lang)
      if (lang == 'zh')
      {
          sessionStorage.setItem('language', 'Chinese')
      }
      if (lang == 'en')
      {
          sessionStorage.setItem('language', 'English')
      }
      if (lang == 'pt')
      {
          sessionStorage.setItem('language', 'Portuguese')
      }
      const language = sessionStorage.getItem('language') ? sessionStorage.getItem('language') : 'Chinese';
      console.log("切换多语言成功" + language)
      location.reload()
    }
  }
}
</script>

<style scoped lang="scss">
.username-p {
  position: relative;

  div {
    cursor: pointer;

    > span {
      margin-left: 5px;
    }
  }

  .drop-items {
    position: absolute;
    display: none;
    top: 45px;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 5px 10px;
    z-index: 20;
    height: 120px;
    background-color: #fff;
    width: 80px;
    border: 1px solid #eee;
    box-shadow: 2px 2px 7px #999;

    li {
      color: rgb(107, 106, 106);
      width: 100%;
      border-bottom: 1px solid rgb(207, 206, 206);
      font-weight: normal;
      text-align: center;

      &:last-child {
        border: none;
      }

      &:hover {
        cursor: pointer;
        color: $theme_color;
      }
    }

    &::before {
      position: absolute;
      top: -20px;
      left: 30px;
      content: '';
      width: 0;
      height: 0;
      border: 10px solid #999;
      border-color: transparent transparent #fff transparent;
    }

    &::after {
      content: '';
      position: absolute;
      width: 80px;
      height: 20px;
      top: -20px;
      left: 0;
    }
  }

  &:hover {
    .drop-items {
      display: block;
    }
  }
}
</style>
