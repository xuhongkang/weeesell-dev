/**
 * 收货地址相关API
 */

import { http, Method } from "@/utils/request.js";

import api from "@/config/api.js";

/**
 * 获取收货地址列表
 * @returns {AxiosPromise}
 */
export function getMembersWallet() {
  return http.request({
    url: "/buyer/wallet/wallet",
    method: Method.GET,
    needToken: true
  });
}


// 查询余额列表
export function getDepositLog (params) {
  return http.request({
    url: '/buyer/wallet/log',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 查询充值记录
export function getRecharge (params) {
  return http.request({
    url: '/buyer/wallet/recharge',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 查询提现记录
export function getWithdrawApply (params) {
  return http.request({
    url: '/buyer/member/withdrawApply',
    method: Method.GET,
    needToken: true,
    params
  });
}

// 在线充值
export function recharge (params) {
  return http.request({
    url: '/buyer/trade/recharge',
    method: Method.POST,
    needToken: true,
    data: params
  });
}

// 提现
export function withdrawalApply (params) {
  return http.request({
    url: '/buyer/wallet/wallet/withdrawal',
    method: Method.POST,
    needToken: true,
    data: params
  });
}
