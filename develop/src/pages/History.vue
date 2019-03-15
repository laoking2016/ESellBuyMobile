<template>
    <div>
		<main-menu top-button-type="BACK" header-text="历史成交" />
		<div class="pm_main">
			<div class="tabwrap">
				<div id="good-list" class="module">
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
            },
            loadGoods: function(page){
                fetch.get(`/user/v2/goods/history?page=${page}`, null, function(data){
                    data.data.map(function(item, index){
                        var image = formatFeaturedImage(item.images);
                        this.goods.push({
                            id: item.goodId,
                            title: item.goodName,
                            image: image,
                            quote: item.type == '拍卖' ? Math.round(item.nextBid * 1.03) : item.topPrice,
                            status: item.status,
                            deadline: item.deadline,
                            type: item.type,
                            categorySecondId: item.categorySecondId,
                            categoryFirstId: item.categoryFirstId
                        });
                        
                    }.bind(this));
                }.bind(this));
            }
		},
        data(){
            return {
                page: 1,
				goods: []
            }
        },
        mounted() {
            this.loadGoods(this.page);
            
            var _this = this;
            mui("#good-list").pullToRefresh({
                up: {
                    callback: function(){
                        var self = this;
                        setTimeout(function(){
                            _this.page = _this.page + 1;
                            _this.loadGoods(_this.page);
                            self.endPullUpToRefresh();
                        }, 1000);
                    }
                }
            });
        }
    }
</script>