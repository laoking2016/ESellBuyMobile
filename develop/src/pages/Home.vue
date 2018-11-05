<template>
    <div class="mui-off-canvas-wrap mui-draggable">
		<main-menu />
		<div class="mui-inner-wrap">
			<!-- 主页面标题 -->
			<header class="mui-bar mui-bar-nav">
				<a href="#offCanvasSide" class="mui-icon mui-action-menu mui-icon-bars mui-pull-left"></a>
				<h1 class="mui-title"><span id="search-btn" class="mui-icon mui-icon-search"></span></h1>
			</header>
			<div class="mui-content mui-scroll-wrapper">
                <div class="mui-scroll">
                    <div id="segmentedControl" class="mui-segmented-control mui-segmented-control-inverted mui-segmented-control-positive">
                        <a class="mui-control-item" href="#item1">精品商城</a>
                        <a class="mui-control-item mui-active" href="#item2">当前热拍</a>
                        <a class="mui-control-item" href="#item3">最新消息</a>
                    </div>
                    <div class="mui-row">
                        <div class="mui-col-sm-4 mui-col-xs-4 product-item" v-bind:data-id="good.id" style="padding-left:2px;padding-right:2px;" v-for="good in filterredGoods">
                            <div class="good-deadline">还有1日3时23分</div>
                            <img style="width:100%;height:120px;" v-bind:data-id="good.id" v-bind:src="formatImage(good.image)">
                            <div class="good-price">￥{{good.quote}}</div>
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
    import { formatImage, formatFeaturedImage } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
        methods: {
            formatImage: formatImage
        },
        computed: {
            filterredGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中');
            }
        },
	  	mounted() {

            document.getElementById('search-btn').addEventListener('tap', function(event){
                router.push('/search');
                mui('#offCanvasSide').offCanvas('close');
            });

            mui(".mui-row").on('tap', '.product-item', function(event){
                var id = $(event.target).data("id");
                router.push(`/auction/detail/${id}`);
            });

            fetch.get(`/user/v2/goods?type=拍卖`, null, function(data){
                this.goods = data.data.map(function(item, index){
                    var image = formatFeaturedImage(item.images);

                    return {
                        id: item.goodId,
                        title: item.goodName,
                        image: image,
                        quote: item.finalPrice,
                        status: item.status
                    };
                });
            }.bind(this));

		},
        data(){
            return {
                goods:[]
            }
        }
    }
</script>

<style scoped>
    @import "../assets/home.css";
</style>