<template>
	<div id="tijiao">
		<div class="banner-box">
			<img src="./banner.jpg" alt="" />
		</div>
		<div class="input-wrapper">
			<div class="input-item">
				<div class="input-label"></div>
				<div class="input-input"><input type="text" placeholder="输入姓名，免费预约美女上门量体" v-model="form.name" /></div>
			</div>
			<div class="input-item">
				<div class="input-label"></div>
				<div class="input-input"><input type="text" placeholder="输入手机号码，享受专人服务" v-model="form.mobile" /></div>
			</div>
			<div class="input-item">
				<div class="input-label"></div>
				<div class="input-input"><input type="text" placeholder="请选择地区" v-model="city" readonly="readonly" @click="selectCity" /></div>
			</div>
			<div class="input-item">
				<div class="input-label"></div>
				<div class="input-input"><input type="text" placeholder="填写详细地址以及可服务时间等" v-model="form.address" /></div>
			</div>
		</div>
		<div class="default-address">
			
			<label><input type="checkbox" v-model="isCheckde"><span></span> 预约即同意《<router-link to="fuwu" tag="a">ARGE Bespoke 雅者定制用户协议</router-link>》</label>
		</div>
		<div class="btn" @click="submit">立即预约</div>
		<mt-popup v-model="popupVisible" position="bottom" class="city-popup">
			<div class="cancle-confrim">
				<div @click="cancle">取消</div>
				<div @click="confrim">确定</div>
			</div>
			<mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
		</mt-popup>
	</div>
	
</template>

<script>
	import { UserInfo, Edit, Insert } from 'components/api/user'
	import myaddress from 'components/json/pca.json'
	import { getQueryString, ShowToast, Loading } from 'components/api/common'
	export default {
		data() {
			return {
				isCheckde: false,
				popupVisible: false,
				city: '',
				value: '',
				myAddressSlots: [{
						flex: 1,
						defaultIndex: 1,
						values: Object.keys(myaddress), //省份数组
						className: 'slot1',
						textAlign: 'center'
					}, {
						divider: true,
						content: '-',
						className: 'slot2'
					}, {
						flex: 1,
						values: [],
						className: 'slot3',
						textAlign: 'center'
					},
					{
						divider: true,
						content: '-',
						className: 'slot4'
					},
					{
						flex: 1,
						values: [],
						className: 'slot5',
						textAlign: 'center'
					}
				],

				form: {
					name: '',
					mobile: '',
					address: '',
					province: '',
					city: '',
					area: '',
				}

			}
		},
		methods: {
			onMyAddressChange(picker, values) {
				if(myaddress[values[0]]) { //这个判断类似于v-if的效果（可以不加，但是vue会报错，很不爽）
					picker.setSlotValues(1, Object.keys(myaddress[values[0]])); // Object.keys()会返回一个数组，当前省的数组
					picker.setSlotValues(2, myaddress[values[0]][values[1]]); // 区/县数据就是一个数组
					this.form.province = values[0];
					this.form.city = values[1];
					this.form.area = values[2];
				}
			},
			selectCity() {
				this.popupVisible = true;
			},
			cancle() {
				this.popupVisible = false;
			},
			confrim() {
				this.popupVisible = false;
				this.city = this.form.province + ' ' + this.form.city + ' ' + this.form.area;
			},
			submit() {
				let data = this.form;
				if(data.name === '') {
					ShowToast('请填写姓名');
					return;
				}
				if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(data.mobile))) {
					ShowToast("请输入正确的手机号")
					return;
				}
				if(this.city === '') {
					ShowToast('请选择地区');
					return;
				}
				if(data.address === '') {
					ShowToast('请填写详细地址');
					return;
				}
				if(!this.isCheckde) {
					ShowToast('请查看勾选用户协议');
					return;
				}
				Loading();
				Insert(this.form).then(res => {
					Loading(true);
					if(res.data.code === 0) {
						ShowToast('预约成功,我们会尽快联系您');
						this.form = {
							name: '',
							mobile: '',
							address: '',
							province: '',
							city: '',
							area: '',
						}
						this.city = '';
						this.isCheckde = false;
					} else {
						ShowToast(res.data.msg);
					}
				}).catch(res => {
					Loading(true);
					ShowToast('网络错误,请稍候!');

				})
			}
		},
		created() {},
		mounted() {
			this.$nextTick(() => { //vue里面全部加载好了再执行的函数  （类似于setTimeout）
				this.myAddressSlots[0].defaultIndex = 0
				// 这里的值需要和 data里面 defaultIndex 的值不一样才能够初始化
				//因为我没有看过源码（我猜测是因为数据没有改变，不会触发更新）
			});
		}
	}
</script>

<style scoped>
	.banner-box {
		width: 100%;
		height: 209px;
	}
	
	.banner-box img {
		width: 100%;
		height: 100%;
	}
	
	.input-wrapper {
		padding: 30px 15px 0 15px;
	}
	
	.input-item {
		display: flex;
		height: 42px;
		border: 1px solid #999;
		margin-bottom: 11px;
	}
	
	.input-item input {
		border: none;
	}
	
	.input-item .input-label {
		flex: 0 0 45px;
		width: 45px;
		background: url(./person.png) no-repeat center center;
		background-size: 16px 18px;
	}
	
	.input-item:nth-of-type(2) .input-label {
		background: url(./phone.png) no-repeat center center;
		background-size: 16px 20px;
	}
	
	.input-item:nth-of-type(3) .input-label {
		background: url(./address.png) no-repeat center center;
		background-size: 18px 17px;
	}
	
	.input-item:nth-of-type(4) .input-label {
		background: url(./edit.png) no-repeat center center;
		background-size: 16px 20px;
	}
	
	.input-input {
		flex: 1;
		height: 100%;
	}
	
	.input-input input {
		width: 100%;
		height: 100%;
	}
	
	.city-popup {
		width: 100%;
	}
	
	.cancle-confrim {
		display: flex;
		text-align: right;
		padding: 10px;
	}
	
	.cancle-confrim>div {
		flex: 1;
	}
	
	.cancle-confrim>div:nth-of-type(1) {
		text-align: left;
	}
	
	.btn {
		height: 40px;
		line-height: 40px;
		color: #fff;
		text-align: center;
		border-radius: 2px;
		background: #4c3622;
		font-size: 15px;
		margin: 8px 28px;
		letter-spacing: 2px;
	}
	
	.default-address {
		text-align: left;
		font-size: 12px;
		padding-left: 15px;
		margin-bottom: 40px;
	}
	.default-address a{
		color:#ff9701;
		text-decoration: underline;
	}
	.default-address label {
		font-size: 13px !important;
	}
	
	.default-address label {
		font-size: 12px;
		cursor: pointer;
	}
	
	.default-address label > span {
		display: inline-block;
		background-color: #fff;
		border-radius: 50%;
		border: 1px solid #4c3622;
		position: relative;
		width: 17px;
		height: 17px;
		vertical-align: middle;
		overflow: hidden;
		box-sizing: border-box;
	}
	
	.default-address label > span:after {
		border: 2px solid transparent;
		border-left: 0;
		border-top: 0;
		content: " ";
		top: 0px;
		left: 4px;
		position: absolute;
		width: 4px;
		height: 8px;
		-webkit-transform: rotate(45deg) scale(0);
		transform: rotate(45deg) scale(0);
		-webkit-transition: -webkit-transform .2s;
		transition: -webkit-transform .2s;
		transition: transform .2s;
		transition: transform .2s, -webkit-transform .2s;
	}
	
	.default-address input[type="checkbox"] {
		display: none;
	}
	
	.default-address input[type="checkbox"]:checked+span {
		background-color: #4c3622;
	}
	
	.default-address input[type="checkbox"]:checked+span:after {
		border-color: #fff;
		-webkit-transform: rotate(45deg) scale(1);
		transform: rotate(45deg) scale(1);
	}
</style>