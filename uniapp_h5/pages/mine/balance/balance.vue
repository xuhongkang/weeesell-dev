<template>
  <view class="address">
	  <span class="subTips">账户余额：</span>
	  <span class="global_color mr_10" style="font-size:26px">Kz{{ memberDeposit }}</span>
	  <span class="subTips">冻结金额：</span>
	  <span class="">Kz{{ frozenDeposit  }}</span>
   </view>
</template>

<script>
import * as trade from "@/api/trade";
import * as balance from "@/api/balance.js";
export default {
  data() {
    return {
      showAction: false, //是否显示下栏框
	  frozenDeposit: 0, // 冻结余额
	  memberDeposit: 0, // 余额
      params: {
        pageNumber: 1,
        pageSize: 1000,
      },
    };
  },
  onPullDownRefresh() {
    //下拉刷新
    this.addressList = [];
    this.getAddressList();
  },
  onLoad: function (val) {
    this.routerVal = val;
  },
  onShow() {
    this.addressList = [];
    this.getAddressList();
  },
  onHide() {},
  methods: {
    //获取地址列表
    getMembersWallet() {
      uni.showLoading();
      trade.getMembersWallet(
      ).then((res) => {
		this.frozenDeposit = res.result.memberFrozenWallet;
		this.memberDeposit = res.result.memberWallet;
      });
    },
  //   getDepositLog(this.walletForm).then((res) => {
	 // if (res.message === 'success') {
	 //   this.logColumnsData = res.result;
	 // }
  //   });
  },
};
</script>

<style lang="scss" scoped>
@import "./address.scss";
</style>
