<template>
    <div class="mui-off-canvas-wrap mui-draggable">
		<main-menu />
		<div class="mui-inner-wrap">
			<!-- 主页面标题 -->
			<header class="mui-bar mui-bar-nav">
				<a href="#offCanvasSide" class="mui-icon mui-action-menu mui-icon-bars mui-pull-left"></a>
				<h1 class="mui-title"><span id="search-btn" class="mui-icon mui-icon-search"></span></h1>
			</header>
			<div id="scroll-home" class="mui-content mui-scroll-wrapper">
                <div class="mui-scroll">
                    <div id="segmentedControl" class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-positive">
                        <a class="mui-control-item mui-active" href="#item1">当前热拍</a>
                        <a class="mui-control-item" href="#item2">精品商城</a>
                        <!--a class="mui-control-item" href="#item3">最新消息</a-->
                    </div>
                    <div id="item1" class="mui-control-content mui-active">
                        <div class="mui-row">
                            <div v-bind:key="good.id" v-on:tap="auctionItemOnTap(good.id)" class="mui-col-sm-4 mui-col-xs-4" v-bind:data-id="good.id" style="padding-left:2px;padding-right:2px;" v-for="good in filterredAuctionGoods">
                                <div class="good-deadline">还有{{formatDateDiff(new Date(), new Date(good.deadline))}}</div>
                                <img style="width:100%;height:120px;" v-bind:data-id="good.id" v-bind:src="formatImage(good.image)">
                                <div class="good-price">￥{{good.quote}}</div>
                            </div>
                        </div>
                    </div>
                    <div id="item2" class="mui-control-content">
                        <div class="mui-row">
                            <div class="mui-row">
                                <div v-bind:key="good.id" v-on:tap="shopItemOnTap(good.id)" class="mui-col-sm-4 mui-col-xs-4" v-bind:data-id="good.id" style="padding-left:2px;padding-right:2px;" v-for="good in filterredShopGoods">
                                    <img style="width:100%;height:120px;" v-bind:data-id="good.id" v-bind:src="formatImage(good.image)">
                                    <div class="good-price">￥{{good.quote}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
			</div>  
		</div>
    </div>
</template>

<script>
    import mainMenu from '../components/MainMenu.vue'
    import fetch from '../utils/fetch.js'
    import router from '../router.js'
    import { formatImage, formatFeaturedImage, formatDateDiff } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
        methods: {
            formatImage: formatImage,
            formatDateDiff: formatDateDiff,
            shopItemOnTap: function(id){
                router.push(`/shop/detail/${id}`);
            },
            auctionItemOnTap: function(id){
                router.push(`/auction/detail/${id}`);
            }
        },
        computed: {
            filterredAuctionGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中' && e.type == '拍卖');
            },
            filterredShopGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中' && e.type == '精品商城');
            }
        },
	  	mounted() {

            document.getElementById('search-btn').addEventListener('tap', function(event){
                router.push('/search');
                mui('#offCanvasSide').offCanvas('close');
            });

            fetch.get(`/user/v2/goods`, null, function(data){
                this.goods = data.data.map(function(item, index){
                    var image = formatFeaturedImage(item.images);
                    return {
                        id: item.goodId,
                        title: item.goodName,
                        image: image,
                        quote: Math.round(item.topPrice * 1.03),
                        status: item.status,
                        deadline: item.deadline,
                        type: item.type
                    };
                });
            }.bind(this));
		},
        data(){
            return {
                goods: []
            }
        },
        updated(){
            mui("#scroll-home").scroll();
        }
    }
</script>

<style scoped>
    @import "../assets/home.css";
</style>