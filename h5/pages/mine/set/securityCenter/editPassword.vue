<template>
	<view class="box">
		<view class="box-tips">
			<h2 class='h2'>
				{{verificationTitle[validateFlage==false ? 0 : 1].title}}
			</h2>
			<view class="verification">{{verificationTitle[step].desc}}</view>
		</view>
		<view class="form">
			<u-form :model="codeForm" ref="validateCodeForm">
				<view v-if="!validateFlage">
					<u-form-item label-width="120" label="Numero de telefone" prop="mobile">
						<!-- <view>{{this.$t('sjh')}} </view> -->
						<u-input maxlength="9" v-model="codeForm.mobile" placeholder="Introduza uma nova senha" />
					</u-form-item>

					<u-form-item class="sendCode" label-width="120" prop="code" label="Verificação código">
						<!-- <view>{{this.$t('yzm')}} </view> -->
						<u-input v-model="codeForm.code" placeholder="Introduza o código de verificação" />
<!-- 						<u-verification-code unique-key="page-edit" :seconds="seconds" @end="end" @start="start"
							ref="uCode" @change="codeChange"></u-verification-code> -->
						<view @tap="getCode" class="text-tips">{{ tips }}</view>
					</u-form-item>

					<view class="submit" @click="validatePhone">{{this.$t('yz')}}</view>
					<myVerification keep-running @send="verification" class="verification" ref="verification"
						business="FIND_USER" />
				</view>
				<view v-if="validateFlage">
					<u-form-item label-width="120" label="Old password ">
						<u-input type="password" v-model="password" placeholder="Please enter your old password" />
					</u-form-item>

					<u-form-item label-width="120" label="Password">

						<u-input type="password" v-model="newPassword" placeholder="Please enter your new password" />

					</u-form-item>

					<view class="submit" @click="updatePassword">{{this.$t('xgma')}}</view>
				</view>
			</u-form>
		</view>
	</view>
</template>

<script>
	import {
		sendMobile,
		resetByMobile,
		modifyPass
	} from "@/api/login";

	import {
		md5
	} from "@/utils/md5.js"; // md5
	import myVerification from "@/components/verification/verification.vue"; //验证
	import uuid from "@/utils/uuid.modified.js";
	export default {
		components: {
			myVerification,
		},
		data() {
			return {
				uuid,
				validateFlage: false, //是否进行了手机号验证
				verificationTitle: [{
						title: this.$t('aqyz'),
						desc: this.$t('qingshurushoujihao'),
					},
					{
						title: this.$t('xgma'),
						desc: this.$t('qingshuruxinmima'),
					},
				],
				step: 0, //当前验证步骤
				flage: false, //是否验证码验证

				codeForm: {
					mobile: "", //手机号
					code: "", //验证码
				},
				newPassword: "", //新密码
				password: "", //密码
				tips: "Obter código de verificação", //提示
				seconds: 69, // 60s等待时间

				// 验证码登录校验
				codeRules: {
					// mobile: [{
					// 	validator: (rule, value, callback) => {
					// 		return this.$u.test.mobile(value);
					// 	},
					// 	message: "手机号码不正确",
					// 	trigger: ["blur"],
					// }, ],
					code: [{
						min: 4,
						max: 6,
						required: true,
						message: "Insira o verificação código",
						trigger: ["blur"],
					}, ],
				},
			};
		},
		onReady() {
			// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
			this.$refs.validateCodeForm.setRules(this.codeRules);
		},
		watch: {
			flage(val) {
				if (val) {

					if (this.$refs.uCode.canGetCode) {
						uni.showLoading({
							title: this.$t('zhengzaihuoquyanzhengma'),
						});
						sendMobile(this.codeForm.mobile, "FIND_USER").then((res) => {
							 if (this.$store.state.isShowToast){ uni.hideLoading() };
							// 这里此提示会被this.start()方法中的提示覆盖
							if (res.data.success) {
								this.$refs.uCode.start();
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
								this.flage = false;
								this.$refs.verification.getCode();
							}
						})
					} else {
						this.$u.toast(this.$t('qingdaojishijieshuzaifasong'));
					}
				}
			},
		},

		methods: {
			// 修改密码
			updatePassword() {
				modifyPass({
					newPassword: md5(this.newPassword),
					password: md5(this.password),
				}).then((res) => {
					if (res.data.success) {
						uni.showToast({
							title: "Change success!",
							duration: 2000,
							icon: "none",
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							});
						}, 1000);
					}
				});
			},

			// 验证码验证
			verification(val) {
				this.flage = val == this.$store.state.verificationKey ? true : false;
			},

			// 验证手机号
			validatePhone() {
				debugger
				this.$refs.validateCodeForm.validate((valid) => {
					if (valid) {
						resetByMobile(this.codeForm).then((res) => {
							// if (res.data.success) {
							if (1==1) {
								this.validateFlage = !this.validateFlage;
								// 登录成功
								uni.showToast({
									title: "Verification successful!",
									icon: "none",
								});
							}
						});
					}
				});
			},
			codeChange(text) {
				this.tips = text;
			},
			end() {
				this.flage = false;
					this.$refs.verification.getCode()
			},

			/**判断是否是当前用户的手机号 */
			isUserPhone() {
				let flage = false;
				let user = this.$options.filters.isLogin();
				debugger
				console.log(user)
				console.log(user.mobile)
				if (user.mobile != this.codeForm.mobile) {
					uni.showToast({
						title: "Indique por favor o número de telefone actual",
						icon: "none",
					});
					flage = false;
				} else {
					flage = true;
				}
				return flage;
			},
			
			/**获取验证码 */
			getCode() {
				debugger
				console.log(this.tips)
				console.log(this.codeForm.mobile)
				// if (this.isUserPhone()) {
					if (this.tips == "重新获取") {
						this.$refs.verification.error(); //发送
					}
					// if (!this.$u.test.mobile(this.codeForm.mobile)) {
					// 	uni.showToast({
					// 		title: "请输入正确手机号",
					// 		icon: "none",
					// 	});
					// 	return false;
					// }
					if (!this.flage) {
						this.$refs.verification.error(); //发送
						return false;
					}
				// }
			},
			start() {
				this.$u.toast("Foi enviado o código de verificação");
				this.flage = true;

				this.$refs.verification.hide();
			},
		},
	};
</script>
<style lang="scss" scoped>
	@import url("@/pages/passport/login.scss");

	/deep/ .u-form-item {
		margin: 40rpx 0;
	}

	.sendCode {
		/deep/ .u-form-item--right__content__slot {
			display: flex;
		}
	}

	.h2 {
		font-size: 40rpx;
		font-weight: bold;
	}

	page {
		background: #fff;
	}

	.box {
		padding: 80rpx 0;
		border-radius: 20rpx;
	}

	.submit {
		background: $light-color;
	}

	.box-tips {
		margin: 0 72rpx;
	}

	.verification {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}
</style>
