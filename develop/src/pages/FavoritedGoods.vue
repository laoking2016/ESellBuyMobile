<template>
    <div class="mui-off-canvas-wrap mui-draggable">
		<main-menu />
		<div class="mui-inner-wrap">
			<!-- 主页面标题 -->
			<header class="mui-bar mui-bar-nav">
				<a href="#offCanvasSide" class="mui-icon mui-action-menu mui-icon-bars mui-pull-left"></a>
				<h1 class="mui-title">关注的商品</h1>
			</header>
			<div id="scroll-favorite-goods" class="mui-content mui-scroll-wrapper">
				<div class="mui-scroll">
					<ul class="mui-table-view mui-table-view-chevron">
						<li class="mui-table-view-cell mui-media" v-for="good in goods" v-on:tap="goodOnTap(good.id)">
							<a class="mui-navigate-right">
								<span class="mui-media-object mui-pull-right">{{good.type}}</span>
								<img class="mui-media-object mui-pull-left" v-bind:src="formatImage(good.image)">
								<div class="mui-media-body">
									{{good.title}}
									<p class="mui-ellipsis">￥{{good.quote}}</p>
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
			goodOnTap: function(id){
				router.push(`/auction/detail/${id}`);
			}
		},
        data(){
            return {
				goods: []
            }
        },
        mounted() {

			fetch.get(`/user/v2/user/favorited/goods`, null, function(data){
				this.goods = data.data.map(function(item, index){
					var image = formatFeaturedImage(item.images);
					return {
						id: item.goodId,
                        title: item.goodName,
                        image: image,
						type: item.type,
                        quote: Math.round(item.finalPrice * 1.03)
					};
				}.bind(this));
			}.bind(this));
        },
		updated(){
			mui("#scroll-favorite-goods").scroll();
		}
    }
</script>
