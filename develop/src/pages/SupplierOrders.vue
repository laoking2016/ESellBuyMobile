<template>
	<div class="mui-off-canvas-wrap mui-draggable">
		<main-menu />
		<div class="mui-inner-wrap">
			<!-- 主页面标题 -->
			<header class="mui-bar mui-bar-nav">
				<a href="#offCanvasSide" class="mui-icon mui-action-menu mui-icon-bars mui-pull-left"></a>
				<h1 class="mui-title">{{customerId == -1 ? '卖家商品管理' : customerName + '的拍品'}}</h1>
			</header>
			<div id="scroll-supplier-orders" class="mui-content mui-scroll-wrapper tab-panel">
				<div class="mui-scroll">
					<div id="segmentedControl" class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-positive">
						<a class="mui-control-item tab-item mui-active" data-status="拍卖中" href="#">拍卖中的商品</a>
						<a class="mui-control-item tab-item" data-status="待支付" href="#">已成交的商品(交易中)</a>
						<a class="mui-control-item tab-item" data-status="已完成" href="#">完成交易的商品</a>
					</div>
					<div v-show="status =='待支付' || status == '待发货' || status == '待签收'">
						<span class="mui-badge sub-item" data-status="待支付" v-bind:class="{'mui-badge-warning': status == '待支付'}">待支付</span>
						<span class="mui-badge sub-item" data-status="待发货" v-bind:class="{'mui-badge-warning': status == '待发货'}">待发货</span>
						<span class="mui-badge sub-item" data-status="待签收" v-bind:class="{'mui-badge-warning': status == '待签收'}">待签收</span>
						<span class="mui-badge" v-on:tap="openCustomerModal">按客户ID显示</span>
					</div>
					<ul class="mui-table-view mui-table-view-chevron">
						<li class="mui-table-view-cell mui-media" v-on:tap="onOrderItemTap(order.id)" v-for="order in filterredOrders">
							<span  class="mui-navigate-right">
								<span class="mui-media-object mui-pull-right">{{order.source}}</span>
								<img class="mui-media-object mui-pull-left" v-bind:src="formatImage(order.image)">
								<div class="mui-media-body">
									{{order.title}}
									<p class="mui-ellipsis">{{order.status}}</p>
								</div>
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="mui-modal" v-bind:class="customerShownFlag ? 'mui-active' : ''">
			<header class="mui-bar mui-bar-nav">
				<span v-on:tap="closeCustomerModal" class="mui-icon mui-action-menu mui-icon-back mui-pull-left"></span>
				<h1 class="mui-title">卖家商品管理(按客户显示)</h1>
			</header>
			<div id="scroll-supplier-customers" class="mui-content mui-scroll-wrapper">
				<div class="mui-scroll">
					<ul class="mui-table-view mui-table-view-chevron">
						<li class="mui-table-view-cell mui-media" v-on:tap="onCustomerTap(-1, null)">
							<span class="mui-navigate-right">
								<span class="mui-media-object mui-pull-left">全部</span>
							</span>
						</li>
						<li class="mui-table-view-cell mui-media" v-on:tap="onCustomerTap(customer.id, customer.name)" v-for="customer in customers">
							<span class="mui-navigate-right">
								<span class="mui-media-object mui-pull-left">{{customer.name}}</span>
							</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	import mainMenu from '../components/MainMenu.vue'
    import router from '../router.js'
	import fetch from '../utils/fetch.js'
	import { formatFeaturedImage, formatImage } from '../utils/format.js'
	import customer from '../components/Customer.vue'

    export default {
		components: {
			mainMenu
		},
		methods: {
			formatImage: formatImage,
			onOrderItemTap: function(id){
				router.push(`/supplier/order/detail/${id}`);
			},
			loadGoodsInAuction: function(){
				fetch.get(`/user/v2/supplier/goods?status=拍卖中`, null, function(data){

					this.orders = data.data.map(function(item, index){
						return {
							title: item.goodName,
							id: item.goodId,
							image: formatFeaturedImage(item.images),
							source: item.type,
							status: item.status,
							buyer: item.order == null ? null : item.order.buyer
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
				this.customerId = id;
				this.customerName = name;
				this.customerShownFlag = false;
			}
		},
        data(){
            return {
				orders: [],
				status: '拍卖中',
				customerShownFlag: false,
				customerId: -1,
				customerName: null,
				customers: []
            }
        },
		computed: {
			filterredOrders: function(){
				if(this.customerId == -1){
					return this.orders.filter(e => e.status == this.status);
				}else{
					return this.orders.filter(e => e.status == this.status && e.buyer == this.customerId);
				}
			}
		},
        mounted() {

			$('.tab-item').on('tap', function(e){
				this.status = $(e.target).data('status');
			}.bind(this));

			$('.sub-item').on('tap', function(e){
				this.status = $(e.target).data('status');
			}.bind(this));
			
			this.loadGoodsInAuction();
			this.loadCustomers();
        },
		updated(){
			mui("#scroll-supplier-orders").scroll();
			mui("#scroll-supplier-customers").scroll();
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