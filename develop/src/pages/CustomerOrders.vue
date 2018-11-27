<template>
    <div class="mui-off-canvas-wrap mui-draggable">
		<main-menu />
		<div class="mui-inner-wrap">
			<!-- 主页面标题 -->
			<header class="mui-bar mui-bar-nav">
				<a href="#offCanvasSide" class="mui-icon mui-action-menu mui-icon-bars mui-pull-left"></a>
				<h1 class="mui-title">买家商品管理</h1>
			</header>
			<div id="scroll-customer-orders" class="mui-content mui-scroll-wrapper">
				<div class="mui-scroll">
					<div id="segmentedControl" class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-positive">
						<a class="mui-control-item tab-item mui-active" data-status="拍卖中" href="#">拍卖中的商品</a>
						<a class="mui-control-item tab-item" data-status="待支付" href="#">已成交的商品(交易中)</a>
						<a class="mui-control-item tab-item" data-status="已完成" href="#">完成交易的商品</a>
					</div>
					<div v-show="status =='待支付' || status == '待发货' || status == '待签收'">
						<span class="mui-badge" data-status="待支付" v-bind:class="{'mui-badge-warning': status == '待支付'}">待支付</span>
						<span class="mui-badge" data-status="待发货" v-bind:class="{'mui-badge-warning': status == '待发货'}">待发货</span>
						<span class="mui-badge" data-status="待签收" v-bind:class="{'mui-badge-warning': status == '待签收'}">待签收</span>
					</div>
					<ul class="mui-table-view mui-table-view-chevron">
						<li class="mui-table-view-cell mui-media" v-on:tap="onOrderItemTap(order.id, order.goodId, order.status)" v-for="order in filterredOrders">
							<a class="mui-navigate-right">
								<span class="mui-media-object mui-pull-right">{{order.type}}</span>
								<img class="mui-media-object mui-pull-left" v-bind:src="formatImage(order.image)">
								<div class="mui-media-body">
									{{order.title}}
									<p class="mui-ellipsis">{{order.status}}</p>
								</div>
							</a>
						</li>
					</ul>
				</div>
			</div>  
		</div>
    </div>
</template>

<script>

	import fetch from '../utils/fetch.js'
	import mainMenu from '../components/MainMenu.vue'
    import router from '../router.js'
	import { formatFeaturedImage, formatImage } from '../utils/format.js'

    export default {
		components: {
			mainMenu
		},
		methods: {
			formatImage: formatImage,
			onOrderItemTap: function(id, goodId, status){
				if(status=="拍卖中"){
					router.push(`/auction/detail/${goodId}`);
				}else{
					router.push(`/customer/order/detail/${id}`);
				}
			}
		},
        data(){
            return {
                orders: [],
				status: '拍卖中'
            }
        },
		computed: {
			filterredOrders: function(){
				return this.orders.filter(e => e.status == this.status);
			}
		},
        mounted() {

            mui('.mui-table-view').on('tap', '.order-item', function(e){
				var id = $(e.target).data("id");
				var goodId=$(e.target).data("goodid");

				var status=$(e.target).data("status");
				if(status=="拍卖中"){
					router.push(`/auction/detail/${goodId}`);
				}else{
					router.push(`/customer/order/detail/${id}`);
				}
			});

			$('.tab-item').on('tap', function(e){
				this.status = $(e.target).data('status');
			}.bind(this));

			$('.mui-badge').on('tap', function(e){
				this.status = $(e.target).data('status');
			}.bind(this));

			fetch.get(`/user/v2/buyer/orders`, null, function(data){
				this.orders = data.data.map(function(item, index){
					var image = formatFeaturedImage(item.images);
					return {
						id: item.orderId,
						goodId: item.goodId,
						image: image,
						title: item.goodName,
						status: item.status,
						type: item.type
					}
				}.bind(this));
			}.bind(this));
        },
		updated(){
			mui("#scroll-customer-orders").scroll();
		}
    }
</script>

<style scope>
	.mui-badge{
		margin: 10px;
	}
</style>