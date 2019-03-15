<template>
	<div>
		<main-menu top-button-type="MENU" header-text="关注的商品" />
		<div class="pm_main">
			<div class="tabwrap">
				<div class="module">
					<ul class="pm_list">
						<li v-bind:key="good.id" v-for="good in goods" v-on:tap="goodOnTap(good.id, good.type)" class="item clearfix">
							<div v-bind:style="formatIconBackground(good.image)" class="img fl"/>
							<div class="info fr">
								<a href="#" class="title">{{good.title}}</a>
								<div class="bot clearfix">
									<span class="tag yellow_gradient">{{good.quote}}</span>
									<a href="#" class="pink_gradient button fr">{{good.type}}</a>
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

	import fetch from '../utils/fetch.js'
	import mainMenu from '../components/MainMenu.vue'
    import nav from '../utils/nav.js'
	import { formatFeaturedImage, formatImage, formatImageBackground, formatIconBackground } from '../utils/format.js'

    export default {
		components: {
			mainMenu
		},
		methods: {
			formatImage: formatImage,
			formatImageBackground: formatImageBackground,
			formatIconBackground: formatIconBackground,
			goodOnTap: function(id, type){
				if(type == '精品商城'){
					nav.go(`/shop/detail/${id}`);
				}else{
					nav.go(`/auction/detail/${id}`);
				}
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
        }
    }
</script>
