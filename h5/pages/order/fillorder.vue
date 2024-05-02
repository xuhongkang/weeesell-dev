<template>
  <div class="wrapper">
    <!-- 选择地址 -->
    <div
      class="address-box"
      @click="clickToAddress()"
      v-if="shippingText == 'LOGISTICS' && orderMessage.cartTypeEnum != 'VIRTUAL'"
    >
      <div class="user-box flex">
        <div class="flex-8">
          <div v-if="!address.id">{{$t('qingxuanzedizhi')}}</div>
          <div v-else>
            <div class="user-address">
              <!-- 省市区 -->
              <div class="flex flex-a-c">
                <span class="default" v-if="address.isDefault"><view>{{$t('moren')}}</view></span>
                <div
                  class="address-list"
                  v-if="address.consigneeAddressPath.length != 0"
                >
                  <span
                    class="address-item"
                    v-for="(item, index) in address.consigneeAddressPath"
                    :key="index"
                  >
                    {{ item }}
                  </span>
                </div>
              </div>
              <!-- 详细地址 -->
              <div class="user-address-detail wes-2">
                {{ address.detail }}
              </div>
              <!-- 姓名 手机号 -->
              <div>
                <span>{{ address.name }}</span>
                <span class="mobile">{{ address.mobile | secrecyMobile }}</span>
              </div>
            </div>
          </div>
        </div>
        <u-icon name="arrow-right" style="color: #bababa"></u-icon>
      </div>
      <!-- 背景 -->
      <div class="bar"></div>
    </div>
    <!-- 选择自提点 -->
    <div class="address-box" v-if="shippingText == 'SELF_PICK_UP'">
      <div @click="clickToStoreAddress()">
        <div class="user-box flex">
          <div class="flex-8">
            <div v-if="storeAddress">
              <div class="user-address">
                <!-- 自提点地址 -->
                <div class="user-address-detail wes-2">
                  {{ storeAddress.address }}
                </div>
                <!-- 联系手机号 -->
                <div></div>
              </div>
            </div>
            <div v-else>{{$t('qingxuanzezitidian')}}</div>
          </div>
          <u-icon name="arrow-right" style="color: #bababa"></u-icon>
        </div>
        <!-- 背景 -->
        <div class="bar"></div>
      </div>
    </div>

    <!-- 开团信息 -->
    <view class="group-box" v-if="isAssemble">
      <view class="group-title">
        <span v-if="pintuanFlage"><view>{{$t('nizhengzaikaituangoumai')}}</view></span>
        <span v-else
          ><view>{{$t('weinijiarujincha')}}</view><span>{{ routerVal.parentOrder.toBeGroupedNum }}</span
          ><view>{{$t('rendetuangou')}}</view></span
        >
      </view>
      <view class="group">
        <view>
          <u-image
            borderRadius="50%"
            shape="square"
            class="head-img"
            width="81rpx"
            height="81rpx"
            :src="masterWay.face || userImage"
          ></u-image>
          <view class="btn-one">{{$t('tuanzhang')}}</view>
        </view>
        <view class="line"> </view>
        <view>
          <!-- 如果有最后一名，显示最后一名，没有最后一名，显示等待参团 -->
          <u-image
            class="head-img"
            v-if="endWay.face"
            :src="endWay.face"
            borderRadius="50%"
            shape="square"
            width="81rpx"
            height="81rpx"
          >
            <view slot="loading"></view>
          </u-image>
          <u-image
            class="head-img"
            borderRadius="50%"
            shape="square"
            v-else
            width="81rpx"
            height="81rpx"
            :src="endWay.face || userImage"
          ></u-image>

          <view class="wait">{{ endWay.nickname || $t('dengdaicantuan') }}</view>
        </view>
      </view>
    </view>

    <!-- 店铺商品信息 -->
    <div
      class="box box2"
      v-for="(item, index) in orderMessage.cartList"
      :key="index"
    >
      <div v-if="item.checked">
        <div @click="navigateToStore(item)">
          <div class="store-name">
            <span>{{ item.storeName }}</span>
          </div>
        </div>
        <div class="promotionNotice">{{ item.promotionNotice || "" }}</div>
        <div
          class="flex goods-item"
          v-for="(val, i) in item.checkedSkuList"
          :key="i"
        >
          <div
            class="goods-image"
            @click="
              navigateTo(
                '/pages/product/goods?id=' +
                  val.goodsSku.id +
                  '&goodsId=' +
                  val.goodsSku.goodsId
              )
            "
            :span="3"
          >
            <u-image
              borderRadius="10rpx"
              width="200rpx"
              height="200rpx"
              :src="val.goodsSku.thumbnail"
              alt
            />
          </div>
          <div
            @click="
              navigateTo(
                '/pages/product/goods?id=' +
                  val.goodsSku.id +
                  '&goodsId=' +
                  val.goodsSku.goodsId
              )
            "
            class="goods-detail"
          >
            <div class="flex">
              <p class="goods-name">{{ val.goodsSku.goodsName }}</p>
              <span class="nums">x{{ val.num }}</span>
            </div>
            <p class="goods-prices">
              <span>Kz</span>
              <span class="goods-price">{{
                $options.filters.goodsFormatPrice(val.purchasePrice)[0]
              }}</span>
              <span
                >.{{
                  $options.filters.goodsFormatPrice(val.purchasePrice)[1]
                }}</span
              >
            </p>
          </div>
        </div>
        <u-row>
          <u-col :offset="0" :span="4">{{$t('fapiaoxinxi')}}</u-col>
          <u-col
            :span="8"
            class="tipsColor"
            textAlign="right"
            @click.native="invoice()"
          >
            <span v-if="receiptList"
              >{{ receiptList.receiptTitle }} -
              {{ receiptList.receiptContent }}</span
            >
            <span v-else><view>{{$t('bukaifapiao')}}</view></span>
          </u-col>
        </u-row>
        <u-row>
          <u-col
            v-if="orderMessage.cartTypeEnum != 'VIRTUAL'"
            :offset="0"
            :span="9"
            @click="shippingFlag = true"
            >{{$t('psong')}}
          </u-col>
          <u-col
            v-if="orderMessage.cartTypeEnum != 'VIRTUAL'"
            :span="3"
            textAlign="right"
            @click="shippingFlag = true"
          >
            {{
              shippingMethod.find((e) => {
                return e.value == shippingText;
              }).label
            }}
          </u-col>
        </u-row>
        <u-row>
          <u-col :offset="0" :span="4" class="tl" style="text-align: left"
            >{{$t('peisongxinxi')}}</u-col
          >
          <u-col :span="8" textAlign="right">
            <u-input
              style="text-align: right"
              class="uinput"
              v-model="remarkVal[index].remark"
            />
          </u-col>
        </u-row>
      </div>
    </div>

    <!-- 发票信息 -->
    <invoices
      :res="receiptList"
      @callbackInvoice="callbackInvoice"
      v-if="invoiceFlag"
    />
    <u-select
      @confirm="confirmDistribution"
      v-model="shippingFlag"
      v-if="shippingMethod.length != 0"
      :list="shippingMethod"
    ></u-select>

    <div class="box box5" v-if="orderMessage.priceDetailDTO">
      <div>
        <u-row>
          <u-col :span="9">{{$t('shangpinheji')}}</u-col>
          <u-col :span="3" textAlign="right">
            <span
              >Kz{{ orderMessage.priceDetailDTO.goodsPrice | unitPrice }}</span
            >
          </u-col>
        </u-row>
      </div>
      <div>
        <u-row v-if="shippingText == 'LOGISTICS'">
              <u-col v-if="orderMessage.cartTypeEnum != 'VIRTUAL'" :span="7"
                >{{$t('yunfei')}}</u-col
              >
              <u-col
                v-if="orderMessage.cartTypeEnum != 'VIRTUAL'"
                :span="5"
                class="tr tipsColor"
                textAlign="right"
              >
                <span v-if="orderMessage.priceDetailDTO.freightPrice == 0"
                  >{{$t('baoyou')}}</span
                >
                <span v-else
                  >Kz{{
                    orderMessage.priceDetailDTO.freightPrice | unitPrice
                  }}</span
                >
              </u-col>
            </u-row>
          </div>
          <u-row
            v-if="
              orderMessage.priceDetailDTO.goodsPrice != 0 &&
              orderMessage.priceDetailDTO.goodsPrice != null
            "
          >
            <u-col :offset="0" :span="9" @click="GET_Discount()">{{$t('youhuijuan')}}</u-col>
            <u-col
              :span="3"
              v-if="
                orderMessage.priceDetailDTO &&
                orderMessage.priceDetailDTO.couponPrice
              "
              textAlign="right"
              @click="GET_Discount()"
            >
              <span class="main-color"
                >-Kz{{ orderMessage.priceDetailDTO.couponPrice | unitPrice }}</span
              >
            </u-col>
            <!--  orderMessage.priceDetailDTO.couponPrice | unitPrice  -->
            <u-col :span="3" v-else textAlign="right" @click="GET_Discount()">
              {{ orderMessage.canUseCoupons.length || "0" }} {{$t('zhangkeyong')}}
              <u-icon name="arrow-right"></u-icon>
            </u-col>
          </u-row>
          <div>
            <u-row>
              <u-col :span="9">{{$t('youhuijine')}}</u-col>
              <u-col
                :span="3"
                textAlign="right"
                v-if="orderMessage.priceDetailDTO.couponPrice"
              >
                <span class="main-color">
                  -Kz{{ orderMessage.priceDetailDTO.couponPrice | unitPrice }}</span
                >
              </u-col>
              <u-col :span="3" textAlign="right" v-else>0.00</u-col>
            </u-row>
          </div>
          <div>
            <u-row>
              <u-col :span="6">{{$t('huodongyouhui')}}</u-col>
              <u-col :span="6" class="tr tipsColor" textAlign="right">
                <span v-if="orderMessage.priceDetailDTO.discountPrice"
                  >-Kz{{
                    orderMessage.priceDetailDTO.discountPrice | unitPrice
                  }}</span
                >
                <span v-else>0.00</span>
              </u-col>
            </u-row>
          </div>
        </div>
        
        <!-- 配送地区没有提示 -->
        <div class="notSupportFreight" v-if="notSupportFreight.length != 0">
          <u-notice-bar
            style="width: 100%"
            :volume-icon="false"
            mode="horizontal"
            :list="notSupportFreightGoodsList"
          >
          </u-notice-bar>
        </div>
        
        <!-- 结账 -->
        
        <div class="box6 mp-iphonex-bottom" v-if="orderMessage.priceDetailDTO">
          <div class="tabbar-left">
            <div v-if="!orderMessage.priceDetailDTO.payPoint" class="number">
              <span>Kz</span>
              <span class="price">{{
                $options.filters.goodsFormatPrice(
                  orderMessage.priceDetailDTO.flowPrice
                )[0]
              }}</span>
              <span
                >.{{
                  $options.filters.goodsFormatPrice(
                    orderMessage.priceDetailDTO.flowPrice
                  )[1]
                }}
              </span>
            </div>
            <span v-else class="number"
              ><span style="margin-right: 10rpx">{{
                orderMessage.priceDetailDTO.payPoint | unitPrice
              }}</span
              >{{$t('jifen')}}</span
            >
          </div>
          <div class="navRiv" @click="createTradeFun()">
            <!-- #ifndef MP-WEIXIN -->
            <div class="tabbar-right">{{$t('tijiaodingdan')}}</div>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <div class="tabbar-right">{{$t('weixinzhifu')}}</div>
            <!-- #endif -->
          </div>
    </div>
  </div>
</template>
<script>
import * as API_Trade from "@/api/trade";
import * as API_Address from "@/api/address";
import * as API_Order from "@/api/order";
import invoices from "@/pages/order/invoice/setInvoice";
import { mapState } from "vuex";
import LiLiWXPay from "@/js_sdk/lili-pay/wx-pay.js";
import configs from "@/config/config";
export default {
  onLoad: function (val) {
    this.routerVal = val;
  },
  components: {
    invoices,
  },

  data() {
    return {
      configs,
      userImage: configs.defaultUserPhoto,
      invoiceFlag: false, //开票开关
      shippingText: "LOGISTICS",
      shippingFlag: false,
      shippingMethod: [],
      shippingWay: [
        {
          value: "LOGISTICS",
          label: this.$t('wuliu'),
        },
        {
          value: "SELF_PICK_UP",
          label: this.$t('ziti'),
        },
      ],
      isAssemble: false, //是否拼团
      // 判断是否填写过备注
      remarkFlag: false,
      selectAddressId: "",
      routerVal: "",
      params: {},
      // 优惠劵
      couponList: "",
      // 已选地址
      address: "",
      shopAddress: "",
      // 发票信息
      receiptList: "",
      // 店铺信息
      orderMessage: "",
      data: "",
      // 存储备注
      remarkVal: [],
      remarkVal1: "",
      detail: "", //返回的所有数据
      endWay: "", //最后一个参团人
      masterWay: "", //团长信息
      pintuanFlage: true, //是开团还是拼团
      notSupportFreight: [], //不支持运费
      notSupportFreightGoodsList: ["以下商品超出配送范围："],
      storeAddress: "",
    };
  },
  watch: {
    // 监听备注 并在 vuex 中存储
    remarkVal: {
      handler(val) {
        this.$store.commit("setRemark", val);
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    ...mapState(["remark"]),
  },
  filters: {
    /**
     * 发票收据类型
     */
    receiptType(type) {
      switch (type) {
        case "VATORDINARY":
          return this.$t('VATORDINARY');
        case "ELECTRO":
          return this.$t('ELECTRO');
        case "VATOSPECIAL":
          return this.$t('VATOSPECIAL');
        default:
          return this.$t('bukaifapiao');
      }
    },
  },
  /**
   * 监听返回
   */
  onBackPress(e) {
    if (e.from == "backbutton") {
      let routes = getCurrentPages();
      let curRoute = routes[routes.length - 1].options;
      routes.forEach((item) => {
        if (
          item.route == "pages/tabbar/cart/cartList" ||
          item.route.indexOf("pages/product/goods") != -1
        ) {
          uni.navigateTo({
            url: item.route,
          });
        }
      });

      if (curRoute.addId) {
        uni.reLaunch({
          url: "/pages/tabbar/cart/cartList",
        });
      } else {
        uni.navigateBack();
      }
      return true; //阻止默认返回行为
    }
  },

  async onShow() {
    // 判断是否存在写过备注信息的商品
    if (this.remark && this.remark.length > 0) {
      this.remarkFlag = true;
    }
    uni.showLoading({
      mask: true,
    });
    await this.getOrderList();
    await this.getDistribution();
    if (this.$store.state.isShowToast) {
      uni.hideLoading();
    }
    if (this.routerVal.way == "PINTUAN") {
      this.isAssemble = true;
      this.routerVal.parentOrder = JSON.parse(
        decodeURIComponent(this.routerVal.parentOrder)
      );
      this.pintuanWay();
    }
  },
  mounted() {},

  methods: {
    //发票回调 选择发票之后刷新购物车
    async callbackInvoice(val) {
      this.invoiceFlag = false;
      this.receiptList = val;
      if (val) {
        let submit = {
          way: this.routerVal.way,
          ...this.receiptList,
        };
        let receipt = await API_Order.getReceipt(submit);
        if (receipt.data.success) {
          this.shippingFlag = false;
          this.getOrderList();
        }
      }
    },

    // 跳转到店铺
    navigateToStore(val) {
      uni.navigateTo({
        url: "/pages/product/shopPage?id=" + val.storeId,
      });
    },
    // 点击跳转地址
    clickToAddress() {
      this.navigateTo(
        `/pages/mine/address/address?from=cart&way=${
          this.routerVal.way
        }&parentOrder=${encodeURIComponent(
          JSON.stringify(this.routerVal.parentOrder)
        )}`
      );
    },
    clickToStoreAddress() {
      this.navigateTo(
        `/pages/mine/address/storeAddress?from=cart&way=${this.routerVal.way}&storeId=${this.remarkVal[0].storeId}`
      );
    },

    // 判断团长以及团员信息
    pintuanWay() {
      const { memberId } = this.routerVal.parentOrder;

      const userInfo = this.$options.filters.isLogin();
      if (memberId) {
        this.endWay = userInfo;
        this.masterWay = this.routerVal.parentOrder;
        this.pintuanFlage = false;
      } else {
        this.pintuanFlage = true;
        this.masterWay = userInfo;
      }
    },
    // 判断发票
    invoice() {
      this.invoiceFlag = true;
    },

    // 领取优惠券
    GET_Discount() {
      // 循环店铺id,商品id获取优惠券
      let store = [];
      let skus = [];
      let selectedCoupon = [];
      if (this.orderMessage.platformCoupon)
        selectedCoupon.push(this.orderMessage.platformCoupon.memberCoupon.id);
      if (
        this.orderMessage.storeCoupons &&
        Object.keys(this.orderMessage.storeCoupons)[0]
      ) {
        let storeMemberCouponsId = Object.keys(
          this.orderMessage.storeCoupons
        )[0];
        let storeCouponId =
          this.orderMessage.storeCoupons[storeMemberCouponsId].memberCoupon.id;
        selectedCoupon.push(storeCouponId);
      }
      this.orderMessage.cartList.forEach((item) => {
        item.skuList.forEach((sku) => {
          store.push(sku.storeId);
          skus.push(sku.goodsSku.id);
        });
      });
      store = Array.from(new Set(store));
      skus = Array.from(new Set(skus));
      uni.setStorage({
        key: "totalPrice",
        data: this.orderMessage.priceDetailDTO.goodsPrice,
      });
      this.navigateTo(
        `/pages/cart/coupon/index?way=${this.routerVal.way}&storeId=${store}&skuId=${skus}&selectedCoupon=${selectedCoupon}`
      );
    },

    /**
     * 跳转
     */
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },

    /**
     * 提交订单准备支付
     */

    // 创建订单
    createTradeFun() {
      // 防抖
      this.$u.throttle(() => {
        if (this.shippingText === "SELF_PICK_UP") {
          if (!this.storeAddress.id) {
			let lang = uni.getLocale();
			if (lang == 'en') {
			  uni.showToast({
				title: "Please select a pickup point",
				duration: 2000,
				icon: "none",
			  });
			}
			else if (lang == 'pt') {
			  uni.showToast({
				title: "Seleccione por favor um ponto de recolha",
				duration: 2000,
				icon: "none",
			  });
			}
			else {
			  uni.showToast({
				title: "请选择提货点",
				duration: 2000,
				icon: "none",
			  });
			}
            return false;
          }
        } else if (this.shippingText === "LOGISTICS" && this.orderMessage.cartTypeEnum != 'VIRTUAL') {
          if (!this.address.id) {
		      let lang = uni.getLocale();
			  if (lang == 'en') {
				uni.showToast({
				  title: "Please select an address",
				  duration: 2000,
				  icon: "none",
				});
			  }
			  else if (lang == 'pt') {
				uni.showToast({
				  title: "Seleccione por favor um endereço",
				  duration: 2000,
				  icon: "none",
				});
			  }
			  else {
				uni.showToast({
				  title: $t('qingxuanzedizhi'),
				  duration: 2000,
				  icon: "none",
				});
			  }
            return false;
          }
        }

        //  创建订单
        let client;
        // #ifdef H5
        client = "H5";
        // #endif
        // #ifdef MP-WEIXIN
        client = "WECHAT_MP";
        // #endif
        // #ifdef APP-PLUS
        client = "APP";
        // #endif

        let submit = {
          client,
          way: this.routerVal.way,
          remark: this.remarkVal,
          parentOrderSn: "",
        };
        // 如果是拼团并且当前用户不是团长
        this.routerVal.parentOrder && this.routerVal.parentOrder.orderSn
          ? (submit.parentOrderSn = this.routerVal.parentOrder.orderSn)
          : delete submit.parentOrderSn;

        /**
         * 创建订单
         */
        API_Trade.createTrade(submit).then((res) => {
          if (res.data.success) {
            uni.showToast({
              title: "创建订单成功!",
              duration: 2000,
              icon: "none",
            });
            // 如果当前价格为0跳转到订单列表
            if (this.orderMessage.priceDetailDTO.billPrice == 0) {
              uni.navigateTo({
                url: "/pages/order/myOrder?status=0",
              });
            } else {
              // #ifdef MP-WEIXIN
              // 微信小程序中点击创建订单直接开始支付
              this.pay(res.data.result.sn);
              // #endif

              // #ifndef MP-WEIXIN
              this.navigateTo(
                `/pages/cart/payment/payOrder?trade_sn=${res.data.result.sn}`
              );
              // #endif
            }
          } else {
            uni.showToast({
              title: res.data.message,
              duration: 2000,
              icon: "none",
            });
          }
        });
      }, 3000);
    },

    /**
     * 微信小程序中直接支付
     */
    async pay(sn) {
      new LiLiWXPay({
        sn: sn,
        price: this.orderMessage.priceDetailDTO.billPrice,
      }).pay();
    },

    /**
     * 获取用户地址
     */
    getUserAddress() {
      // 如果没有商品选择地址的话 则选择 默认地址
      API_Address.getAddressDefault().then((res) => {
        if (res.data.result) {
          res.data.result.consigneeAddressPath =
            res.data.result.consigneeAddressPath.split(",");
          this.address = res.data.result;
        }
      });
    },
    // 获取配送列表
    async getDistribution() {
      let shopRes = await API_Trade.shippingMethodList({
        way: this.routerVal.way,
      });
      let shopList;
      if (shopRes.data.success) {
        shopList = shopRes.data.result;
        let way = [];
        console.log(shopList);
        this.shippingWay.forEach((item) => {
          shopList.forEach((child) => {
            if (item.value == child) {
              way.push(item);
            }
          });
        });
        this.shippingMethod = way;
      }
    },

    // 选择配送
    async confirmDistribution(val) {
      let res = await API_Trade.setShipMethod({
        shippingMethod: val[0].value,
        way: this.routerVal.way,
      });

      this.shippingText = val[0].value;
      if (res.data.success) {
        this.getOrderList();
      }
    },

    // 获取结算参数
    async getOrderList() {
      this.notSupportFreight = [];
      // 获取结算参数
      API_Trade.getCheckoutParams(this.routerVal.way).then((res) => {
        if (
          !res.data.result.checkedSkuList ||
          res.data.result.checkedSkuList.length === 0
        ) {
          uni.switchTab({
            url: "/pages/tabbar/cart/cartList",
          });
        }
        if (res.data.result.skuList.length <= 0) {
          uni.navigateTo({
            url: "/pages/order/myOrder?status=0",
          });
        }

        let repeatData;
        res.data.result.cartList.forEach((item, index) => {
          // 如果已经写过备注信息的话赋值
          repeatData = {
            remark: this.remarkFlag
              ? this.remark[index].storeId == item.storeId
                ? this.remark[index].remark
                : item.remark
              : item.remark,
            storeId: item.storeId,
          };

          this.$set(this.remarkVal, index, repeatData);
        });

        this.orderMessage = res.data.result;
        /**
         * 为了避免路径传值在h5中超出限制问题
         * 这块将可用的优惠券以及不可用的优惠券放入到vuex里面进行存储
         */
        this.$store.state.canUseCoupons = res.data.result.canUseCoupons;
        this.$store.state.cantUseCoupons = res.data.result.cantUseCoupons;

        if (!res.data.result.memberAddress) {
          // 获取会员默认地址
          this.getUserAddress();
        } else {
          this.address = res.data.result.memberAddress;
          res.data.result.memberAddress.consigneeAddressPath =
            res.data.result.memberAddress.consigneeAddressPath.split(",");
        }
        if (res.data.result.storeAddress) {
          this.storeAddress = res.data.result.storeAddress;
          console.log("storeAddress", this.storeAddress);
        }
        if (
          res.data.result.notSupportFreight &&
          res.data.result.notSupportFreight.length != 0
        ) {
          this.notSupportFreight = res.data.result.notSupportFreight;

          res.data.result.notSupportFreight.forEach((item) => {
            this.notSupportFreightGoodsList[0] += item.goodsSku.goodsName;
          });
        }
      });
    },

    //
  },
};
</script>
<style scoped>
page {
  background: #f7f7f7;
}
</style>
<style scoped lang="scss">
.flex-8 {
  flex: 8;
}

.main-color {
  color: $main-color;
  font-weight: bold;
}

.uinput {
  /deep/ input {
    text-align: right;
  }
}

.promotionNotice {
  font-size: 24rpx;
  margin: 20rpx 0;
  color: $aider-light-color;
}

.nums {
  flex: 2;
  color: $light-color;

  text-align: center;
}

.wait {
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #cccccc;
  text-align: center;
}

.line {
  margin-left: 14rpx;
  margin-right: 14rpx;
  margin-bottom: 50rpx;
  width: 143rpx;
  border-bottom: 2px dotted #999;
}

.tabbar-left {
  margin-left: 32rpx;
}

.btn-one,
.wait {
  margin-top: 14rpx;
}

.btn-one {
  width: 100rpx;
  height: 40rpx;
  background: $light-color;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  text-align: left;
  color: #ffffff;
  text-align: center;
  line-height: 40rpx;
}

.head-img {
  width: 81rpx;
  height: 81rpx;
  margin: 0 auto;
}

.group-title {
  text-align: center;
  font-size: 28rpx;
  font-weight: 400;
  color: $light-color;
}

.group-box {
  height: 242rpx;
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: #fff;
}

.group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tr {
  text-align: right;
}

.tl {
  text-align: left;
}

/deep/ .u-col-3 {
  text-align: right;
}

.bar {
  height: 4rpx;
  overflow: hidden;
  width: 100%;
  background: url("@/pages/order/imgs/line.png") no-repeat;
}

.box2 {
  margin-top: 20rpx;
}

.notSupportFreight {
  position: fixed;

  bottom: calc(100rpx + env(safe-area-inset-bottom));
  // #ifdef H5
  bottom: 100rpx;
  // #endif
  display: flex;
  align-items: center;
  left: 0;
  background: #fdf6ec;
  height: 100rpx;
  width: 100%;
  transition: 0.35s;

  > .tips {
    margin: 0 32rpx;
  }
}

/deep/ .u-notice-bar-wrap {
  width: 100% !important;
}

.box6 {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  overflow: hidden;
  line-height: 100rpx;
  margin-bottom: 0px !important;
  background: #fff;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.tabbar-right {
  margin-top: 10rpx;
  height: 80rpx;
  color: #fff;
  line-height: 80rpx;
  background: linear-gradient(91deg, $light-color 1%, $aider-light-color 99%);
  padding: 0 44rpx;
  text-align: center;
  border-radius: 400px;
  margin-right: 32rpx;
}

.sp_tag {
  display: inline;
  background: #f2f2f2;
  padding: 0 20rpx 0 10rpx;
  height: 20rpx;
  line-height: 20rpx;
  font-size: 24rpx;
  color: #262626;
  border-radius: 0.4em;
}

.goods-promotion {
  float: left;
  width: 75%;
  margin: 4rpx 0;
}

.sp_tag_plain {
  margin-left: 8rpx;
  padding: 0 6rpx 0 6rpx;
  background: #fff;
  border: 1px solid $main-color;
  font-size: 24rpx;
  color: $main-color;
  border-radius: 50px;
}

.sp_tag_plain:nth-of-type(1) {
  margin-left: 0;
}

.goods-name {
  flex: 8;
  font-size: 28rpx;
}

.sp_type {
  color: $u-tips-color;
  padding: 8rpx 0;
  font-size: 24rpx;
}

.number {
  color: $main-color;
  font-size: 26rpx;
  font-weight: bold;

  > span {
    font-size: 36rpx;
  }
}

.goods-prices {
  margin: 10rpx 0;
  color: $main-color;
  font-size: 28rpx;
  font-weight: bold;

  > .goods-price {
    font-size: 38rpx;
    padding: 0 2rpx;
  }
}

.box {
  border-radius: 40rpx;
  overflow: hidden;
  background: #fff;
  margin-bottom: 20rpx;
  color: #666;
  padding: 0 32rpx;
}

.wrapper {
  height: auto;
  background: #f7f7f7;
  padding-bottom: 200rpx;
  overflow: auto !important;
}

.store-name {
  margin-top: 32rpx;
  font-weight: 400;
  color: #333333;
}

/deep/ .u-col {
  padding: 36rpx 0 !important;
}

/deep/ .u-col-3,
.tipsColor {
  color: #333;
}

.goods-image {
  text-align: left;
  overflow: hidden;
}

.default {
  background: $main-color;
  font-size: 24rpx;
  border-radius: 8rpx;
  padding: 0rpx 12rpx;
  color: #fff;
  margin-right: 20rpx;
}

.address-box {
  border-radius: 40rpx;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  overflow: hidden;
  background: #fff;
  margin-bottom: 20rpx;
  color: #666;
}

.address-item {
  font-weight: normal;
  letter-spacing: 1rpx;
}

.user-box {
  padding: 32rpx;
}

.user-address-detail {
  color: #333;
  font-size: 38rpx;
  font-weight: bold;
  margin: 20rpx 0;
  letter-spacing: 1rpx;
}

.mobile {
  margin-left: 20rpx;
}

.price {
  font-size: 50rpx !important;
  margin: 0 2rpx;
}

.goods-detail {
  display: flex;
  flex-direction: column;

  justify-content: center;
  flex: 8;
  margin-left: 20rpx !important;

  > p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.goods-item {
  margin: 20rpx 0;
}
</style>
