<template>
  <view>
    <view
      v-if="!hid"
      class="flex-row-center"
      :style="{ top: scHight }"
      style="width: 750rpx; position: fixed; z-index: 100; left: 0"
    >
      <view
        class="flex-column-center"
        style="background-color: #fcfcfc; padding: 30rpx; border-radius: 10rpx"
      >
        <movable-area
          class="flex"
          style="width: 100%"
          animation="false"
          :style="{ height: originalHeight }"
        >
          <movable-view
            scale-value="1"
            animation="false"
            damping="5000"
            :x="moveX"
            :style="{
              height: sliderHeight,
              width: sliderWidth,
              'z-index': 101,
            }"
            direction="horizontal"
          >
            <image
              :src="imgbk"
              class="image"
              mode="aspectFit"
              :style="{
                height: sliderHeight,
                width: sliderWidth,
                'margin-top': imgbKH,
              }"
            ></image>
          </movable-view>
          <image
            :src="img"
            mode="aspectFit"
            :style="{ height: originalHeight, width: originalWidth }"
            style="border-radius: 10rpx"
          ></image>
        </movable-area>

        <movable-area
          class="flex-row-start"
          style="
            width: 100%;
            background-color: #efefef;
            height: 80rpx;
            border-radius: 40rpx;
            margin-top: 30rpx;
          "
        >
          <movable-view
            scale-value="1"
            animation="false"
            damping="50"
            :x="movePv"
            class="flex-row-center"
            style="
              border-radius: 50%;
              height: 100rpx;
              width: 100rpx;
              background-color: #ffffff;
              border: 2rpx solid #e3e3e3;
              margin-top: -13rpx;
            "
            direction="horizontal"
            @change="moveChange"
            @touchend="end"
          >
            <u-icon
              :color="mainColor"
              size="40"
              v-if="endLoad"
              name="arrow-right"
            ></u-icon>
            <u-icon :color="mainColor" size="40" v-else name="reload"></u-icon>
          </movable-view>

          <text style="padding-left: 140rpx" :style="{ color: col }">{{
            hasImg
          }}</text>
        </movable-area>
        <view class="flex-row-around padding-top" style="width: 100%">
          <u-icon
            @click="hide"
            :color="mainColor"
            size="40"
            name="close"
          ></u-icon>

          <text class="cu-tag round" @click="getCode">{{$t('shuaxinpintu')}}</text>
          <text class="my-neirong-sm cuIcon-safe" style="color: #c1c1c1"
            >Weeesell-FRAMEWORK</text
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/config/api.js";
import storage from "@/utils/storage.js";
import uuid from "@/utils/uuid.modified.js";
const phone = uni.getSystemInfoSync();
const l = phone.screenWidth / 750;
export default {
  name: "verification",
  created() {
    // 可自行调整
    this.scHight = phone.screenHeight / 2 - 200 + "px";
    this.getCode();
  },
  props: {
    height: {
      type: String,
      default: "80rpx",
    },
    width: {
      type: String,
      default: "350rpx",
    },
    left: {
      type: String,
      default: "180rpx",
    },
    top: {
      type: String,
      default: "30rpx",
    },
    business: {
      type: String,
      default: "LOGIN",
    },
  },
  data() {
    return {
      mainColor: this.$mainColor,
      flage: false,
      key: "", //key
      vsrtx: this.$t('dianjiwanchengyanzhneg'), //按钮提示语
      vsr: false, //
      hid: true,
      col: "#838383",
      movePv: 0,
      hasImg: this.$t('tupdponghuakai'),
      spcode: "",
      tl: 0,
      moveCode: 0,
      //X轴移动距离
      moveX: 0,
      //模版高度
      originalHeight: "",
      //模版宽度
      originalWidth: "",
      //拼图高度
      sliderHeight: "",
      //平涂宽度
      sliderWidth: "",
      scHight: 0,
      //原图
      img: "",
      //拼图
      imgbk: "",
      endLoad: true,
      imgbKH: "",
    };
  },
  methods: {
    show() {
      this.hid = false;
    },
    hide() {
      if (!this.vsr) {
        // vsr判断是否验证成功，成功隐藏验证框
        this.hid = !this.hid;
      }
    },
    error() {
      this.vsr = false;
      this.hid = false;
      this.moveX = 0;
      this.moveCode = 0;
    },
    // 获取验证图片
    getCode() {
      this.col = "#b3afae";
	  let lang = uni.getLocale();
	  this.codeColor = "#999";
	    if (lang == 'en') {
	  	this.hasImg = "Image loading...";
	    }
	    else if (lang == 'pt') {
	  	this.hasImg = "Carregamento da imagem...";
	    }
	    else {
	  	this.hasImg = "图片加载中...";
	    }
      
      if (!storage.getUuid()) {
        storage.setUuid(uuid.v1());
      }
	  var uuid = storage.getUuid()
	  console.log(uuid)
      uni.request({
        url: api.common + "/common/slider/" + this.business,
        header: {
          uuid: uuid,
        },
        success: (res) => {
		 //  res.data = {
			//   "success": true,
			//   "message": "success",
			//   "code": 200,
			//   "timestamp": 1710730627472,
			//   "result": {
			// 	"originalHeight": 150,
			// 	"sliderHeight": 60,
			// 	"effectiveTime": 300,
			// 	"slidingImage": "data:image/png;base64,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",
			// 	"sliderWidth": 60,
			// 	"originalWidth": 300,
			// 	"key": "{VERIFICATION_KEY}_LOGIN1f2b5530-e4d3-11ee-a21e-71f3f8cb6143",
			// 	"backImage": "data:image/png;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCACWASwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDuIGMUxt5D1+ZT0z/n+efaroWoprfzo8A7XU5RvQ1Jay+fGcrtkU7XX+63+ea5ijM8RW5fTluF4eB1YH0B4P8AQ/hWvaSC4tYph/Gob8xVLX8poV24OAqZIzjI9P8APpUnh2VZ9FhIOdpZSfof/r0+hTWiZpBalC0oWnhT2pCECg04J9KUZHUU5WB9j6GkAzyiTxx+NKFZRgnIFS9+v1pDnGQSKAICR0I/wpnBO0Ptb0zmrBXIyVINM8sFsncD+FMREVf5udxzwMZoC8fdA9+1OCFScZ3HtSneRyVz6EdRQIjC7s4PtzxTguOpA9jUgwBkgiggHjjHpQBGGYA8e3PenhWYhSR+fWnoqhiSADn160/bz2oAjClWwT8vYU4qAvIJx3FSYHfFKpBBHGe4zQMjRQPmJPPAGcUpRdxXof7vrUp2nA2HjtxSlVYAlenTNIZVdApBA5PGRRsDKGHUc85qc/KpwoyBTCMk5XJx+dICsVAU5IJJ6/4UnTblR8x/CrDooHIIz78GmGMFchckdMnimBCq7sjke5PamOiNkgk9iQc1ZEYC/MB055phhULtBIH9KLgQEIFwSMgcDOagcKFzg7ffirJhVSSVIB6gComjAHH15/pTQioUB5JznoKhmUoWIxnH+c1bdHCkDAHsv/16glgdwAAAAO/ammSypjcCVHU56AU0YGSMDFWijBQAFB9/SofL3AMScdl//VVCGDKnOGx3IIpol3A8Z9Pan7Mk4cEeijmkMW05DEdflzQMrykjIBx7VAVOeFqdshiNxznnnmoiBno35VSEb8TrIOMhh95T1X61HcRvBIt3EpYqNsyDqyeo/wBpeo9RkelSqkVyqyo2cjKyI2Dj2P8ASpAlyn3XikH+0pU/mOP0rI0I72BLvTZVDbkZC6led2Bkfh0rN8FTrc+HY3GOJGU4/CsrxvqGq6H4clNoIokmlCB42JaIHJYDIGAcH6ZPtXI/D3xBqNjq0Omwo9xaTMcwKRkMRksue4A9egNaqk3FyRa+Gx7QqVIq1FFcRyXMluN3mxqrsGUgYbOOT1+6atBaxIGhAeopxUEYp2MdMUoJ9KAGhABxRt9KlAzTgntQBWK9eMe9N255q0UyOlIIzmmBWKn60woc4xmroialMPb+ooApbCemRTlQjrzmrZgA6n9RSeUoP3h+YoEV9vc0bBuzirYRfUZ+opjhY42kc4RAWY+gFFguiHaDkYPPWlVcE4znr715fLJJ5zbXbGfWlj855FRZDuYgDLYH5ngU+ULnqSxgDqQPakKEDGDj6U3Wbd30e7ET7WEZOc44HJ/TNeXtJLn77fnSUbgeolTnkHgU3aQQ2Pr7151pMsw1myxI4zOinB7EgEflXpxhB4pNWGVQNxxjn2o2YbJGfr2qzsxTSnFIZX2Dg4A9aaUJHbFTMhPFMZCB3oAgK56gfnULKQCNuPTBqwyE4PJGKjZSF75poRVeNto7DPPvULo5Y9B25q2V74P0NREEseT9MUxWKhRgoUEkGomVVAUjAq6VBwST9KjKAcYGD2ouFiARg/Nkn1xTGjXbxjPXmrQQ9sj8azPEOtW3h3SX1C8WR4w6oFQAks3Qc/jTjduyBK4yaEZ2jpVN0G45zmudPxR0J1OYblc/dXA9e/oKZ/wnthJ86RIUPKkzKOPpituSS3TB02+h1WgeILXVdPiuIw9o/COJVIRmAGR/9fOa6LzzHjzY2Uf31Usv6cj8RXnUFs/hiVcXxudNuuN0i7l3HpnB/UV0vhxryzsVt5r3z5UySrbjuBJIPIyvBAxyOK5pNJ3Wx0OjpdGB8VtQH9k6dBDMrB52dlU/3V4yP+BGuX8ADPi7TXX7plIIxnB2tVz4n61bapeWEVs5Y26SLKpBBV9wBU5+lYng1LhvEliLSQR3BmVUZvu7uwPsen416FNfuSHG0dT3eJ8eIZo+zWcbdD2dh/WrMUk41a4hZw0XkRyIhXG35mVue/IHWsPTNUF3ryy+UwzY7ZVHLRssvRl5PfqM1suwXX7F1IZZraaPI6EqysP/AGauFoztYuT3MVvC8s7eVGilnZhwAOpyKkQ7wrDBVhkcY4NNvo/MsLlP70Lrx7qazYNQkSy0VhErR3aRpI7OQULR5XAxySQR2oSA2V/CpBgf/rqNQOOtSjaByaBASPT8jSBh/l6QlfT9KAFI4/8AQaAHggn/AOypxx3x+dMC89R+IpSpA4Kf980APOMdvypp9iPwSmkS4+WRB7FP/r0w+d3dPwQ1SEyYZ/vf+O1FeRNLY3CIQzvGyqOmSRQDIOrr/wB8mnqzjrIP++aAPJvIleVlSNmIySAM8Dk/pSFSvBHNekQ+INLO5FvEjILEqUI7kk9O/X3z61wmt3EFzq1xNb/6tnJBH8Xqfx6/jTuBNceINSurMWs1wWj4zwMnHqe9ZZFJuFG4etAFrS2VNXsndgqrPGSScADcOa9PW+sWlSJbuBnf7oDg56cfXmvJkBkkVIwWdiAqqMkn0FXl0nVGmSIWc4kf7oZCPTnnoORz70NDPUylNKUlnHLHZQRzOHlSNVdgc7mA5OfrUpHNRYZAU9KaY+KnI56U0+9KwFR4+tQunsKtuyA/xfgpqNtp/wD1UDKbJntULxEHgCtAhT6VA6DdwATSAoGIdhTDGO4HHSrroMc45quVIpiIghOB2riviou7wbsPQ3cQ5/4FXdhCe1cP8SL+G0tLS0uFTy5S0rFgT93AAx9WrWjfnVgWjPG4tFma1uZjHgKv7skfeO4A4/X86u6VpcC2hE+TJvOSB/8AWrpJnijij8xwg3AYXocDOKjhjiYyFWzhyCdg616PPJ7j52dWLqX7OkG4eUn3VwMCtqzQ3mjyyNb/AGm4jLKi52t0zgN1rx4+IbzvqLD6H/AV0/gzxbf2mpwpJcmewmmWOYOM7S3AYHqDx9ODXHVw8uW5cZ2eiMvxtaW6amjw29zbSsmZoJ49u1ieobJDZ9RWd4e1EaJqtpeOjOIJlkKjjIB5r6JlgiuIzFNEkiMNrK6hgfzrltU8B2U2ZNPX7PJ18thuQ/Tuv6iop4uKjySRppLRmXf6/FBrWneJ9HYGGa2Y30JG0yRK6gkDuy7ieP7tdrfyw3D6FqNnc7oXu1CSRnKusiMMkd+ce/NedR2uoaLq1vcapp8ktnDBJAImTK7WOSQw4604apN4bgWG1SSbQ5biO6ti6/NC6urOvsvX2GR61OjskKVLqj2A7dpWTIDcEjnrXMRN5/w8t54G3SwW6zJgHlom3cf98kVvWOsWl9IqxOFlJB8t+Gx7ev4VQ8MLu8PxwyKCFlniYHuBKwx+VZpq2hjZrcjvb27t9VtrqyDXcF9BiO3Mm1VK4bK9slWJ567a1otRtZnaNZ1MqMFdT8rBvTB5zXK21048FQXG1vtWi3A3q3LbYXKtnHqhNa3iNLaK1t9VFvGzWtxFKZCgJKFgrHOP7rZz2xxTa1C3Q2DMB0LUCdR1zVDU9WGmm33W0snnXCwAoBwzHAJyefoPf0q2WnyNqA+tRruKxOJ4gcE/nThNbn+7mq5Mx6ov4rmml3AIePI/2eKOYLF4PFjPQe9JvTsy/wDfVZxZByY2C/7xFIXiPIjYCmpCaNPeO7oPxqC+K/2bdfOh/cv0PsaqCVAB8p/LpSXDxzWc0KkhnRlGegJHenzAkebPgueaTAq+PDmpsxxbj8ZF/wAae/hvUoonkeJQiKWY+apwB+NVzILGZtFG0UQxGedIYvmkkYIozjJJwK1m8K6qoybdf+/q/wCNO4FTSUU6zYjAINxHx6/MK9WFvEORDz9f/r151pmg3kGqWsk6LHFHKrsxcHABz257V3f2ix7Ox9gTUyBFwbU/gCD1yKa1xCOsyj/gQqp9ttU4FvK3/AM5oFzCeV0+Un/rnikMsi4hYfLIrH03CkM4I42n/gYqNZ1OM2Uo/wCAUx50J5sZj/wAH+tADzON2N8X/fYzQSW6Mp+uaYZ4OjRsh906VDLLGRxesnttH+FAEx3Y5EY/Gon3Z42H6Niow1sw5uVc+vTP4U0pbt/q3Qn/AGiR/KkBKVYr/D7DeahMeScgD6NmleGMg5VPw5/nUQiVT8rMPUdqAHBQp/8Ar15b8W5WbUNFtVZQJVk3jA6bl5yenSvT3YIjOW2hQWZmPAA6k1454g1aLXfEtxdDD29kTFblFyWXPLfmD+db4de9fsC7lBLJJYXWZ/NVm3Ybov0rF1y8exvxFC4RSgYqM8Ek+9bysVvPIHRhu246c4/pXJeKoZTrj4OQEUdPauyLTeoRWup1EXgjT0uQ7TzvGDnyyQM+xI5rdh0zT7ZSIbKFRuBwqjqOh/DNcYfEWttu/fQR+m2MH+dQHXNcLfPf4UckIqj+lTKE5bs1TR9DadK91p8E4ZmLLyPccH9amdZgQUbb7NzmuN+HGvCbw00N1KzSQzFQ21nZg3I6A98iuwGo7hm2sLyYt/F5ewfmxFeVUpWk0NSe9hxWSWMqU3Kwwyy/dI+n+NefeKdFsEYm2mmWMttnjRisfJzhW6ZyPu89K7yS31G9BElnaqvUCdyxz2+VRj9aiPhh7yVZNXu2uFQ5WBE2RL+HU0qcXB3uaKol1MnQLQW2hWdvdOAWw0M6EHK5yoyfun8ceh7Va8PX6adbXFvc39jLGbmZ0aKUtIdzFiGXH3hzkDmr2uW63Ogzw6bqENvKgBR45FAUAjgnsMZ/KvO7vxYtvezJbSW6+Q/lo0tslww45IJ+YlupPfPWrpQlJu3UJNTWh3+lR2tzcazbiVGt7qdpoCOoV0VZAQR03DkH1qlpmoR6j4NuNGvp1W9hgltJs8A7coGBPXovvmuCHj2/hyokgU54ZLVUxnvtB6/U10nh7UtL1h5TIk0Vw224M+/Lhh8rNwMAHjIHFbzi4K72M/ZstTawdW8KWOp/vAbW9tlcuuMusiq7D2JP867EySKSN+MHHSvPkdj4D8QW6yI62N7IU2ZyFEquM5/Eiu9wrDeXJyM/d9aiaS27mclYf57jrOx/4DThcnoXbHsKhJRTknJ+mKQyAnhcH0qCLlkTwk/PvIoL2vYSfTNVxcN0H8hUv2hx/CoP+7QFx/8Aox6eYPypojVjhS34imz6otnbvcXNxFDCgy0khCqo+prlJfi34fhvxbfariSLB3XEcBKKf5ke4FVGnKfwpscYt7K52AtnxkFSOvXGPzqO4tHubCYRFX8yNgpVgQSR61TGu6LrelzyDULS8slQmUB1IC45yOo4zXMfDrVrK18CieS7jtreO5m/10oUIpbKjk+hFV7OXK31TSKUNLmdZ2V4dUjigjYTpIDkqcIQRy3HAB616c93FGOI8kds1wd38VfDdvfLAs1zdJzvmhhJRfpnBb8BXQ6N4h0PxAp/s26iuGUbmjViHX6qcH+lEqc0ryTSBwkldo2hqS4AMYGfUZpp1CMHldvuqUD7Oq4a0kI9QKjMunDj7LKfpn/GoWpF7D/7RiBGZ5cegGKaby2k/wCXu4U+metRtcaYAc2cv+fxqL7VpW7P2SQEdi3/ANenYLloSW5OTev+Mm000ypuOy+Zh/dZifyIqsLvT2OfssgA4+V80n2i1LAx2hCnjdvIxSsFx8kwB5niZf7rEn8jTN8DgkRZ7fdJ/U1XleOSQARfKpx8zGh3TblRwONpfv8AnTAmMltGMGNSO5Cn/Gmi8t1IEckSD/aQ1XMDyZOAcdhVYwqD80Ln6GnZCua32q2cYae3z/ugUoeLIxKoHbkEVjotsjBiJ8+gUZFWFNtuDs04/wB5AP5Umh3Mrx/MP+EK1BY5G3vsTEbbWO51BH415ToUaIk0kJkOXVCsowwOTnJ/Hr7V6X8QDAPB115asSZIclhgY3rnkVyunWWLdRGhXncR15zmuqk7U/mWthjxFGjY8sGxn2NYOty6ZDqTJcxSGXYuSr8dK66SyeSBU2/MCCT6VwXiUifWpfJjikVFWMsQeSBg9qcJJvcFHuVvshB+Yv6fcA/rT0sCxAIcknAHFXTv77VOOpyf8KYbWeSRXFyyqqkFUG3JxxWyk+5qqaXQuaPY3S6lAlvAzTmRfKVpiillORnGAenrXrckfi2Z1Z9asLfcvzLFZsxU9e56ivLPD3hTUdS02LULa6EhZcfLcLujY+qnp0/wrb8S3Hifw94bitrjUkltiyxG7jVlmVuSFJJ5BxjPXiuWr701FNX2KUdLpFzxHryWQlsrvxnqEt3C2x4LazC4PozbgM89c1yU3iW7li2QrczRdPMv7hnBP+7kL+e6uSu9QuZr+W6kuZJJ3bc8jtuZjx8xPc1o6ZdXE0bsJIomVgWlZct/wEmuyOGjCN3qJppXNc/2jeoPtMzGAdFysUQ+gOF/IVVvXsLa2VIb3zpzzKEj+VR0wrZ+YfgO9NaS2aRpJXlvJWPLTvhc1eOg3+orCkMUKlrVruJYlyWjDbW6DqCOlD5Y7uyHBNO6M23vonZAHViDgK6cfrxXR6ZqQ0q7DmwmikeMsPs0pXKnuFYMuOOw7VzD6Tco23eu4diMGuo8KWTXGoafDqcjTwWrM0UO4hQuCxHXIBNRV5LXT0N/VE2k6yHn1+wSdlj1KFiGuFyeFyzNtwMgZOR6e9dvY/EPTUsLVL6C5gm8lct5OVb5RyOckGuL1q8tYPFd4gtxFJdNDAFhUKscbLhtox13BR9M+tdHpfh2y1PwjpjTS+U0sC7TtG3cBg8E9cg8jB56nFc1dRSTlonYz5YyV2joU8YeHrlcjVEQ+kkLL/Sp01vRWxs1myG7kBpdv8xXIzeGYbOPNzpBnjXk3Gn3DBgPUxsT+lJbaFp1+rLpWuXUUg+VopACyj0KkA1nGMGrpuxjKEFvdHZ/2zpTttGq2ZIOOJlqzFdW0pxFdQP7rKpHb39x+debyeBNRT5Yr20kX0ZSpGOnb+tQHwfrySkhIWJPysk+0L/L+VX7KL2kTyU3sztdX8JDxDdma+vZpLZGHkQRKNiHHJPXc2e9ZF/8N7eaJkt75kBYnbPEGAz7jBqiuleIdrWccUiywpuMwuyPMZjg/Me23PFWreDxzaRBIbiUsMKpaeJ1C+mG9/8ACnHmjtJaFpuKtGRw/iT4faloGly6rJcW0kIZVeOHdlctgdRgjoc+p/GoPCXgu68VWs9zBcwKLWdVaGbcN2RknI6cZr0fUYPFGsabdWF9bsYLk7WVY4SVUEYwdw54z9TWJoWmeLvC8c9tp1pI1s8pkCyoje2fvcHGK644mTptNq5ftHy7q5p2Xwtto8C81EugAG2GML0P945Pf0rQT4c6HBdJcw3F9FcxuHSWObaVwegwPwpltrni/wA5RcaMPLP3mWAZA+m8Vuf278n7zQ9XZgOSsCgE/QtxXHOdS+/3Myc6j6mmZ2U8O5x70x5Zj8yux/AVkSa4hHGia1/34X/4qq8muooydI1hRnj9wv8A8VWSgzLlZsiW5ZjtZs/7RGP1p5hvnXBCkegZa5S58XWcP+ssNYB94B1/OqUnj7So1+ey1MMedrIoqlTk9kHs5PodkbefgMgUA9Nyj+tSRQRKrCRHzn+F92fyrgD8SdJUHOnagPfKj+lOl+J2nwiPZpl20TruBEoHsQR2NV7GY1Ta6HobXFsi8wsR0+bP+JpUe325OEJ6ZOK8y/4WnaKxEekTAHs06/8AxNN/4WpAGyujMuOuJ15/8dp+wqdh8kux6PdTgDMMpwO/UfqKo/2hdqxwzN7EdK4lfi66cR6QoJH8VwAP0FD/ABfuMcaTEOe84/wo9jUXQn2cjtxqupt0ZSOxKD/CnR6ldOfmG4jsuOa4RPixdSMQNGsVJPLGZh/JetWU+JNywwbbTFXPdpmP6LQ6U1ug5JGz4wvJ7jw7cQPbDBZGyTxwwPP5V4Pba7qFjcb4Lh0IJ49c+teuXvjA6xbNYtFbHzOhjjmHI5HLKB+deKTriVuMZJ4rrwkE4tSRrTVrpnY6b4+vA6x3aKxYhRIrBdo9TkGtttbt7h2eWFt2cfNEjH8815eDtbPft7UxhlsknNaywkJO60NGj6NHg/RHYg2bA8ciZv8AGrSeD9FjjJFluO0/edm7fWr6TsoyUx6gtUouiQAAu48EZ6/SvCVSXVsbUuhjfDyKL/hCdOYBVLBw+FALEOw5PesX4vJt8IR4bg3kYC+vytV74dXD/wDCHWqgrhZplIOf75x/Osr4tyu3hSJXTcBeRlXUkYO1sgj/AArem19ZS8wipJ3PJNOslvrq3hLlBLKsZYDOAWAz+tei+LPAemeFfCklzbXNxc3YnRDI5CqAc5wo+nc1wGiXlvZ31rJcOypHMsjEKTwGBP8AKvXfEHi7w74k0kWyQz3MRdZWDN5S5GcAnqRzzjFejiZ1VUjy3t1Bu2548zhpYhwfmGeK9X0C4tYtU8KLEx3i0uLadSTuUkblyOvY/WuLe70nTZJZLe3jVmYkKOQo9AT2o0jVvtmvW8s14bG3hbzDPtLE4IO1cc7iMgfWitF1Y7WSTBS1uloe2XY011C3trDKxBxH5Qd2HqBjIHueKzv7JsystzbWUVmVGCIVG8/Vv4fov51p21jGYUeza1WOVQxO75mUjKktzk1M9hMlrO+FAKnAVtw/lXhqUk7I3Tj1Z53c6Pbah4uuraZjEv8AZ6TKUQM25XxkZPB560nhXV7qXRrext7pVaMsI4pJAC4VicKGBAPPYg8mrV9aXN54ytYbaUxSXNhNFu3MMgMCR8vPQ/T2NS6P4WuNFjlsb6d1s5CWjmST5FkIG1ieCrAjg9O1d1SceS0nro0iklc27XxDqUHzXujyvF0Lwhidvrn5gT7e1X7jTtE1mFbhwWJzslCFZFx/tDBBrP0m9mtL6S01LykunJ+bIAmIxll568g/Q5FbsV5BJL5ZXcWUk/LnOMf41yqfLKyVr9jmrQ+0uhkjTtVsQW0/UI9QgXpBfIVb6LIo/wDQqcPENpbsE1e2vNKkPG6VN8J+jr/WukgWLaDswTzymf6VOYoPLZTAmG4IKjBFb86e6ObR7oo2S2d/CHtLqO5jIzvhdWH86sNYAfdOfY1kXPhHRp5DcxQNZXGflnsnMLZ/D5T+VQi08T6cy/ZNVttUhX/ljfp5chHs69/cijR7P7x8sehtG1kA4VajMMg9APes4+JntsDVdOvLFgPmcRedFn2ZM8fUCtTT9X0/UgTZ3ttcEEj924J4OOnWpd1q0JwZAyOPb6Uwhx1BP0rZK7hkMuPeo2gjfqzA/wCyKLi5TIyccbvxqJsZyAQa2HtIh/y0Y/Uc1XNnCxx5jKfdafMhWZQRNz4K8+5xWiII4YQZI9ynuGyPxqNbSFHyxPsc4qd4lVD8jSZ/vyUnK40rFUrbf7JH91hkfrSrDARk20LL05jU/wBKgZFVuVYewORTkdkYY+ancLk32OwYZNjb4A7QL/hVaWx0o7g1hbL/ALXkr/hVj7UdoJ/KozI8x+6pGe/anGTQncy5LC1QkC0tSp4G5FH9KzZLW3RiBbxLk/wov+FbtzApBMkgDDoFTisiWPk7Tn1wK0U7kaogiSJZMlFC+ygf0q2sKPjaVHPHH/16p7WLYBHX14rRjsJWXcZtuBxtXnP9aUmNamTr9slno8100wbBVQrDglmAwOT614RfRlZj8uOvH417p4ntJl0VnluPNRZY8oUI53Dn8OteG6k/+kMM56/z/lXdg+ptSKDjaxHcU2lJptd5sfUYjBAwSPfbigBAwQsCc54PSosZcFWbb3BPNBUSlowdoOQx5B546+tfK21KT8znvh0QPDDoCTtvJwcdsNWf8R72w1HQ7nS0voY761dLhoHbazKAeFzwThsgD0NcLZeLZPDvh290rTjIL2e5fdOx4jQfKNv+0cHnt161y8txNcTNLNI0sjnLs53Mx9ST3r1aWEk6vtG7LoO7tZDQh3DHPpitSxjl8s4BKkngsQO3X/IrOBAArbDbYwHIIUdzjFehUlpYzk7EYt7aMsXZpXx26UKWPCAKDwSKry3kKDA+Zv8AZqKC7eS5RAAqscEDkmpUZNXYWbR9EeE3iXwrpO4EsLZARz155PNWdSS2u2xJLeQk4UC2mZd2Og2jg9fSsfwrNHceGdOeFEcrAqHOThlyDkZxnOavX8l/eWrx262qyKQV3FgwYe/OPyr5uelR621Z0qOie559rssmj+LdNa2vL6eJQ21Xfa+GJVk3Lz2+tdronjmx1SVre6iSBm+VS8oZSfQ5HH41Qk8N3WoTxrc26W7wt5qXsUxV92c4xkr156du1V9SeFCbbUxZS3Bby1vYkVRKehUkfdYA8g/h1rpnKFWKT1aKSRZu4Lm01cm2kikiaNibcqUCqGG0K2SVbJ4B4Ge1Lp+tG48T2lmxZJVt5mctlSCSuAw7H5ST27isC68V22n3EpksbgKkUcSsjqwHJyzHryfQHpVbwgzan4ivtQmd2BQhWx0yRj6cA/gKuFB2cpLZaM56svdZ7DbyO7L83mJ0+XJqy84GCSV9BjmuU8gxpmO4cE8jr/hT45HVhi5de5G0k/hxUuJxqR0n3gC6ZJ4H/wBemtIqDChQe9ZsMwI+aebk9CQBUrOhLKXBPqzf/XqWh3JxJuYkkgf71RT6NpV+d9zYQyP/AM9Sm1h7hhg/rUXmBDt3jHpmpRNIegyPzo1WwJ2MlvBthbyM+n6pqmnuTkCG4LL1z91s/wA6uq3iG2jVI7jTtQKjH71Hhdj6kruXP5U95nViCm33wMU0Tzn7oZh7D/61U23vqPnfUpz694htxtu/CjyAf8tLK5WT9DzVYeP9MVgl5De2bDgie1YAfiK1hdygcx8+5P8AKlN00uFZFIPBwwI/LNO8eq+5hdEsGo2t4qtBcwShhkbJFYn8M0ruQuCzDPQKOD6VnS6LpV43+k2Fs3owiCkH6jBqhP4YsLfP2eS6t9pypguXVemOBkipSXcb5TSmbZIQX6+ppYpeSA/GOnWsE6TdRkeVrl8oGOHKSDgYxyvSmrba7DtEerWsqjA/f2YyfxU1XLpuTZdzeLhjgjtyV7VJDMvCZyv94VzTy+IVwpTSLkgDkNJEev4inJqOsRHc+iI5HUx364P4Fabiwt5nQXLsFKqMjOAQOtZMjleR37dKjl1y/Zf33h68X02zRMM/mDWXLq8m7nR9TXpnCKQPX+KnFMHFmgLjbKPlJHcVsw36BfuNs6biCBXHf24Ucn+zNVVtrcLAM5Hbr3qwniTylyNH1bGVwzWZbgjnvTcW+glFot+LdUZdClCxOqrIhdsBhs3YbHvzXhF3mC+c/eAbjcOozxx2r1vXvEst1oN9bvaajGJISN01mUVSCMZYcCvI78f6U5D7wejY6134NWTTRrTTW5VZ9zMxHLHNNpOlFdxofTwDc5JOOuMflUqJvYZjUBjgn15rj9T8f6HpepGznuJpJFAEjQRhlVv7pOeo79akg+I3heVwf7Rki5BPmQuo/ka+dVCo9UmJXPFdRG3UrlT2mcf+PGokGQKdfSJLf3DxkMjSuykdCCxIpqHgV76+FGiJf4Vrob+5ibw7DbBGEq3DSswT5QpVVA3euQeK53PArTltp7pEZXVIAMbpH2ru74HUnGOgNZySbTZMn7yMpzgmrUSeTdwxMm2ZSwkHOc9h1x09KtW9vBaXAlcRXQUZ2yoduc9cA5P4/lT5J4nneURxI7knbEgUD2CjpVOfRDck1ZHrHwvlV/D0se9fMhumLREYba2MN9Cc/lXeb7WKEkN5XPLbMEH3NebWGoado8kF/oqXLW5jRrqFx8rKRglec5BycEfSr9/4lF7Ctwt6kdivzDaR849CTyB0yo9OtfP1qbnUcktGadjobnxLF9lJhmaVdxUNs2FiOxzyBz1x9K4a/vraVZpLzaysu5kYgfL6A+vf1NZup64kgKwOxwTl87VA9s8n61zFzK9yxeZiIlPTP3h/hXTQwr3en5kua2RLc3LXcj4LeTjb8x6qCduf8a77wpZtZaMspVla6bzcnIG3aAuP1P41x3h7QZ/EF6SVaLT4SDI+O/8AdHuf0HNerRwRpGEO1UHyqAduOOg9q6a8opKCOarLoVY72WMgBm6/nV2J57htyxsFBGSdoAP4imJFFC4cg4ByAHA59s1tWU8KKApIflmbeWK8dM46/SuSTS2RjFXKYgnkyVK5HXLencYOf0q7DCmwbl3dmLI2P/rVbe9KwCSJuGOArOefp3qtPPLIWR9+3+8WLbfUYA4rO9yrWLIW2TACxg4zkAnH5ircQQD5MZ9fWsKMS7gYQDjoSxJx+QqwslxwHLbupGM4/Gk0O5tHeqnG3OOOeKjz8vKqT6gVlP57dGAPqF3H9TUHmX4JXzHwOvyAUWuFzXZlwQTg9eDzVGb5W65I9RVR2nY7WnQ5/vDn8+ahdZlJHm7h/s4oSBsneZwuAcAdjUUjo8YJfk88JSJJhcktuzznn86S7eNmBG3LL82BgAeoqktQK29SMHdk8DP9aUOFIw+PXOagaYBsAsCvpQj4YMeQeox1q7Elhy+0glWz6sP0pG3ooIBY4zjBH5+1VzKjuEztPT5ulBmUMQeGXj72M0WAkmlfH3CG7L/9eqrltoZh1HUU57l5m2koAP4Tzn+dRmaSI5A3DurLmmkA6GNHYuCTt6YU4rQjkUgIAQQeNtUoXLBXAKjpt6k5qUuh7Ovrt6ik9QRU8Vr5ng/VV4YGBmLZwRjBH16V4cEjkOHAPcHuK9s19S3hzUhIN262k+9wfumvD0bn24rtwuzNYbBPp6kFo25PZqpNbyBuFFaxf5Rgnp3qFfuiupTktyk2hus6NcaReywXEkcjq5UshOD78j3rNA5H1ooq47I0Ww+QAYxSox6UUU+gMmA4Xnv6Ve38Lx04ooqJESHZGASTz6U3cwBKsRu64/xooqUUiazvLuxczW1w8begPB+oqxNdJFIWkVpJ26scAZPU0UVDS5hMi3Hl5SXbbx6L9BTLYve3SIWwDwPYZooqn1Gup7zYQWmlaXDa2kBihiXgAgktnBJyOSeuarzmF3BCEEnGcA4ooryvtHNIiiQtLtBwAcDj8a0rREj/AHmG2gEkAgEn8umKKKbJRuWDW4QSiLBYZ4xxzVszAkjYB24oorFlled0jk+5yB1FVZbgLEHCnnnGaKKENlM6rHkYDg/Qf41bFwfL3nO3pgdaKKdiUQtKskJ3bsjJyO/NQoAYgxJ5GdvYd6KKAIoCs23g/M2M9CCfp1FPkt4oyQQeCB1zj6ZooquoAbCAwiVVzwCc8H8MUgskYNtQdM/M2f6UUUAUntWUYVl3Z4yoIH6VFJDJuYt5bhQMDaB1H0NFFNCZXkiOFJY44Ix1GaqncOQ54zjPNFFXETHwlsHLEk4JNW0ZpOgXPIJI64oooYIqawobQNSU9TayDrkfdJrwxOx+lFFdmF+FmsNifPyj8KcvSiiuhjZ//9k=",
			// 	"randomY": 17
			//   }
			// }
          this.col = "#838383";
		  
		  let lang = uni.getLocale();
		  
		  if (lang == 'en') {
			this.hasImg = "Drag the slider to complete the puzzle";
		  }
		  else if (lang == 'pt') {
			this.hasImg = "Arraste a barra deslizante para completar o puzzle";
		  }
		  else {
			this.hasImg = "拖动滑块以完成拼图";
		  }
          var data = res.data.result;

          // base64的图片
          this.img = data.backImage;
          this.imgbk = data.slidingImage;
          // 根据参数动态适应验证图片的高宽
          this.imgbKH = data.randomY * 1.8 + "rpx";
          this.originalHeight = data.originalHeight * 1.8 + "rpx";
          this.originalWidth = data.originalWidth * 1.8 + "rpx";
          this.sliderHeight = data.sliderHeight * 1.8 + "rpx";
          this.sliderWidth = data.sliderWidth * 1.8 + "rpx";
          // 适应比率，用来适应滑动距离
          this.tl = 1 / (1.8 * l);
          // 无用信息
          this.spcode = data.capcode;
          // 验证令牌
          this.key = data.key;
          this.$store.state.verificationKey = data.key;
        },
      });
    },
    end(e) {
      this.endLoad = false;
      // 验证拼图位置是否正确
      uni.request({
        method: "POST",
        url:
          api.common +
          "/common/slider/" +
          this.business +
          "?xPos=" +
          parseInt(this.moveCode * this.tl),
        header: {
          uuid: storage.getUuid(),
        },
        success: (res) => {
          this.endLoad = true;
          res.data.result == false
            ? (res.data.result = false)
            : (res.data.result = true);

          if (res.data && res.data.result) {
            //验证成功后把key发送出去,后端会把验证信息存在缓存里
            this.$emit("send", this.key);
            this.hide();
            this.vsr = true;
            this.vsrtx = "已通过验证";
          } else {
            this.getCode(); // 让滑块回到起始位置
            if (this.movePv == 1) {
              this.movePv = 0;
            } else {
              this.movePv = 1;
            }
          }
        },
        fail: (res) => {
          this.$msg("连接服务器失败");
        },
      });
    },
    // 绑定拼图位置
    moveChange(e) {
      this.moveX = e.detail.x;
      this.moveCode = e.detail.x;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./animation.css";
@import "./icon.css";
// @import './main.css';
.dh-wt {
  animation: at 1.1s ease;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  background-color: $main-color;
  border-radius: 50%;
}

@keyframes at {
  from {
    width: 27rpx;
    height: 27rpx;
  }

  to {
    width: 45rpx;
    height: 45rpx;
  }
}

.ttcl {
  color: $main-color;
}

.border-index {
  border: 1rpx solid $main-color;
}

.status_bar {
  height: var(--status-bar-height);
  background-color: #f1f1f1;
  width: 100%;
}

.status_bar-nobg {
  height: var(--status-bar-height);
  width: 100%;
}

/* 转圈动画 */
.turn-load {
  animation: turnmy 1s linear infinite;
}

@keyframes turnmy {
  0% {
    -webkit-transform: rotate(0deg);
  }

  25% {
    -webkit-transform: rotate(90deg);
  }

  50% {
    -webkit-transform: rotate(180deg);
  }

  75% {
    -webkit-transform: rotate(270deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

.status_bar-fixed {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  background-color: #f1f1f1;
  z-index: 20;
}

.head-dh-my {
  display: flex;
  position: fixed;
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 10rpx;
  z-index: 15;
  background-color: #e3e3e3;
  width: 750rpx;
}

.padding-left {
  padding-left: 20rpx;
}

.padding-left-top {
  padding-left: 20rpx;
  padding-top: 20rpx;
}

.padding-right {
  padding-right: 20rpx;
}

.input-my {
  padding-left: 20rpx;
  border-radius: 40rpx;
  height: 50rpx;
  margin: 10rpx;
}

.tb-tag-absolute {
  position: absolute;
  z-index: 5;
  border-radius: 25rpx;
  font-size: 16rpx;
  margin-left: 25rpx;
  margin-top: -35rpx;
}

.flex-column-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.flex-column-between {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.flex-column-start {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex-column-around {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.flex-row-around {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.flex-row-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.flex-row-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.my-title {
  font-size: 35rpx;
  font-weight: bold;
}

.my-neirong {
  font-size: 26rpx;
  color: #6d6d6d;
}

.my-neirong-sm {
  font-size: 23rpx;
  color: #616161;
}

.my-tag-text {
  font-size: 22rpx;
  padding-top: 20rpx;
  color: #bababa;
}

.padding-top {
  padding-top: 35rpx;
}

.padding-top-sm {
  padding-top: 20rpx;
}

.bottom-dh {
  background-color: #f1f1f1;
  position: fixed;
  z-index: 10;
  bottom: 0;
  width: 750rpx;
  height: 110rpx;
}

.tb-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom-text {
  width: 750rpx;
  position: fixed;
  text-align: center;
  font-size: 26rpx;
  color: #9d9d9d;
  bottom: 70rpx;
}

.moneycolor {
  color: #ea5002;
}

.margin-top {
  margin-top: 20rpx;
}

.margin-top-sm {
  margin-top: 12rpx;
}

.margin {
  margin: 20rpx;
}

.margin-left {
  margin-left: 20rpx;
}

.margin-right {
  margin-right: 20rpx;
}

.main-color {
  color: #07d188;
}
</style>
