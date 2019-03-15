<template>

	<div>
		<div v-show="!customerShownFlag">
			<main-menu top-button-type="MENU" v-bind:header-text="customer.id == -1 ? '卖家商品管理' : customer.name + '的拍品'" />
			<div class="pm_main">
				<div class="pm_menu tabmenu">
					<li class="lk" v-on:tap="tabOnTap('拍卖中')" v-bind:class="{cur: status=='拍卖中'}">拍卖中的商品</li>
					<li class="lk" v-on:tap="tabOnTap('待支付')" v-bind:class="{cur: status =='待支付' || status == '待发货' || status == '待签收' || status == '已流拍'}">已成交的商品</li>
					<li class="lk" v-on:tap="tabOnTap('已完成')" v-bind:class="{cur: status == '已完成'}">完成交易的商品</li>
				</div>
				<div class="tabwrap">
					<div class="module">
						<div class="pm_tags" v-show="status =='待支付' || status == '待发货' || status == '待签收' || status == '已流拍'">
							<a href="#" v-on:tap="tabOnTap('待支付')" class="lk" v-bind:class="{cur: status == '待支付'}">待支付</a>
							<a href="#" v-on:tap="tabOnTap('待发货')" class="lk" v-bind:class="{cur: status == '待发货'}">待发货</a>
							<a href="#" v-on:tap="tabOnTap('待签收')" class="lk" v-bind:class="{cur: status == '待签收'}">待签收</a>
							<a href="#" class="lk" v-on:tap="openCustomerModal">按客户ID显示</a>
							<a href="#" v-on:tap="tabOnTap('已流拍')" class="lk" v-bind:class="{cur: status == '已流拍'}">已流拍</a>
						</div>
						<ul class="pm_list">
							<li v-bind:key="order.id" v-for="order in filterredOrders" class="item clearfix">
								<div class="img fl" v-bind:style="formatIconBackground(order.image)"></div>
								<div class="info fr">
									<a href="#" class="title">{{order.title}}</a>
									<div class="bot clearfix">
										<span class="tag yellow_gradient">{{order.source == '精品商城' && order.status == '拍卖中' ? '出售中' : order.status}}</span>
										<span v-on:tap="onCancel(order.goodId, $event)" v-show="order.status == '拍卖中'" class="tag red_gradient">取消</span>
										<a href="#" class="pink_gradient button fr" v-on:tap="onOrderItemTap(order.goodId, order.orderId, order.status, order.source)">{{order.source}}</a>
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div v-show="customerShownFlag">
			<div class="head clearfix">
				<a href="javascript:;" class="hd_back fl" v-on:tap="closeCustomerModal"></a>
				<span class="title" style="z-index:-1">卖家商品管理(按客户显示)</span>
			</div>
			<div class="goodscata_main">
				<ul class="goodscata_list">
					<li v-on:tap="onCustomerTap(-1, null)">
						<a href="#">全部</a>
					</li>
					<li v-bind:key="customer.id" v-on:tap="onCustomerTap(customer.id, customer.name)" v-for="customer in customers">
						<a href="#">{{customer.name}}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import mainMenu from '../components/MainMenu.vue'
    import nav from '../utils/nav.js'
	import fetch from '../utils/fetch.js'
	import { formatFeaturedImage, formatImage, formatImageBackground, formatIconBackground } from '../utils/format.js'

    export default {
		components: {
			mainMenu
		},
		methods: {
			...mapActions({
				storeStatus: 'manage/storeSupplierStatus',
				storeCustomer: 'manage/storeCustomer'
			}),
			formatImage: formatImage,
			formatImageBackground: formatImageBackground,
			formatIconBackground: formatIconBackground,
			onCancel: function(id, e){
				mui.confirm('确定要取消该商品？', "拍品取消", ['确定取消', '不取消'], function(btn){
					
					if(btn.index == 0){
						fetch.patch(`/user/v2/good/${id}?cancelFlag=true`, null, function(data){
							this.loadGoods();
						}.bind(this));
					}
				}.bind(this));
			},
			onOrderItemTap: function(goodId, orderId, status, source){
				if(status == '拍卖中'){
					if(source == '精品商城'){
						nav.go(`/shop/detail/${goodId}`);
					}else{
						nav.go(`/auction/detail/${goodId}`);
					}
					
				}else{
					nav.go(`/supplier/order/detail/${goodId}/${orderId}`);
				}
			},
			loadGoods: function(){
				fetch.get(`/user/v2/supplier/goods`, null, function(data){

					this.orders = data.data.map(function(item, index){
						return {
							title: item.goodName,
							goodId: item.goodId,
							orderId: item.orderId,
							image: formatFeaturedImage(item.images),
							source: item.type,
							status: item.status2,
							buyer: item.buyer
						};
					});
					
				}.bind(this));
			},
			loadCustomers: function(){
				fetch.get(`/user/v2/users/supplier`, null, function(data){
					this.customers = data.data.map(function(item, index){
						return {
							name: item.nickName,
							id: item.userId
						};
					}.bind(this));
				}.bind(this));
			},
			openCustomerModal: function(){
				this.customerShownFlag = true;
			},
			closeCustomerModal: function(){
				this.customerShownFlag = false;
			},
			onCustomerTap: function(id, name){
				this.storeCustomer({
					id: id,
					name: name
				});
				this.customerShownFlag = false;
			},
			tabOnTap: function(status){
				this.storeStatus(status);
			}
		},
        data(){
            return {
				orders: [],
				customerShownFlag: false,
				customers: []
            }
        },
		computed: {
			...mapGetters({
				status: 'manage/supplierStatus',
				customer: 'manage/customer'
			}),
			filterredOrders: function(){
				if(this.customer.id == -1){
					return this.orders.filter(e => e.status == this.status);
				}else{
					return this.orders.filter(e => e.status == this.status && e.buyer == this.customer.id);
				}
			}
		},
        mounted() {
			
			this.loadGoods();
			this.loadCustomers();
        },
		updated(){
			
		}
    }
</script>

<style scope>
	.mui-badge{
		margin: 10px;
		background-color: none;
	}
	.tab-item{
		font-size: smaller;
	}
</style>