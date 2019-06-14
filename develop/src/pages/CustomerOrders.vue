<template>

	<div>
		<main-menu top-button-type="MENU" header-text="买家商品管理" />
		<div class="pm_main">
			<div class="pm_menu tabmenu">
				<li class="lk" v-on:tap="tabOnTap('拍卖中')" v-bind:class="{cur: status=='拍卖中'}">拍卖中的商品</li>
				<li class="lk" v-on:tap="tabOnTap('待支付')" v-bind:class="{cur: status =='待支付' || status == '待发货' || status == '待签收' || status == '已流拍'}">已成交的商品</li>
				<li class="lk" v-on:tap="tabOnTap('已完成')" v-bind:class="{cur: status == '已完成'}">完成交易的商品</li>
			</div>
			<div class="tabwrap">
				<div class="module">
					<div class="pm_tags" v-show="status =='待支付' || status == '待发货' || status == '待签收'">
						<a href="#" v-on:tap="tabOnTap('待支付')" class="lk" v-bind:class="{cur: status == '待支付'}">待支付</a>
						<a href="#" v-on:tap="tabOnTap('待发货')" class="lk" v-bind:class="{cur: status == '待发货'}">待发货</a>
						<a href="#" v-on:tap="tabOnTap('待签收')" class="lk" v-bind:class="{cur: status == '待签收'}">待签收</a>
					</div>
					<ul class="pm_list">
						<li v-bind:key="order.id" v-on:tap="onOrderItemTap(order.id, order.goodId, order.status, order.type)" v-for="order in filterredOrders" class="item clearfix">
							<div v-bind:style="formatIconBackground(order.image)" class="img fl"/>
							<div class="info fr">
								<a href="#" class="title">{{order.title}}</a>
								<div class="bot clearfix">
									<span class="tag yellow_gradient">{{order.status}}</span>
									<a href="#" class="pink_gradient button fr">{{order.type}}</a>
								</div>
							</div>
						</li>
						
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
	import fetch from '../utils/fetch.js'
	import mainMenu from '../components/MainMenu.vue'
    import nav from '../utils/nav.js'
	import { formatFeaturedImage, formatImage, formatImageBackground, formatIconBackground } from '../utils/format.js'

    export default {
		components: {
			mainMenu
		},
		methods: {
			...mapActions({
				storeStatus: 'manage/storeCustomerStatus'
			}),
			formatImage: formatImage,
			formatImageBackground: formatImageBackground,
			formatIconBackground: formatIconBackground,
			onOrderItemTap: function(id, goodId, status, type){
				nav.go(`/customer/order/detail/${id}`);
			},
			tabOnTap: function(status){
				this.storeStatus(status);
			}
		},
        data(){
            return {
                orders: []
            }
        },
		computed: {
			...mapGetters({
				status: 'manage/customerStatus'
			}),
			filterredOrders: function(){
				return this.orders.filter(e => e.status == this.status);
			}
		},
        mounted() {

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
			
		}
    }
</script>

