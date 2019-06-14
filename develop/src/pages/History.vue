<template>
    <div>
		<main-menu top-button-type="BACK" v-bind:search="onSearch" readonly="false" />
		<div class="pm_main">
			<div class="tabwrap">
				<div id="good-list" class="module">
					<ul class="pm_list">
						<li v-bind:key="good.id" v-for="good in goods" v-on:tap="goodOnTap(good.id, good.type)" class="item clearfix">
							<div v-bind:style="formatIconBackground(good.image)" class="img fl"/>
							<div class="info fr">
								<a href="#" class="title">{{good.title}}</a>
								<div class="bot clearfix">
                                    <span style="color: red; font-size: .3rem;">&yen; {{good.quote}}</span> 
									<a href="#" class="pink_gradient button fr">{{good.type}}</a>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
            <div class="mui-pull-bottom-pocket mui-block mui-visibility" v-on:tap="loadMore">
                <div class="mui-pull">
                    <div class="mui-pull-loading mui-icon mui-spinner mui-hidden"></div>
                    <div class="mui-pull-caption mui-pull-caption-nomore">查看更多...</div>
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
        computed: {
            ...mapGetters('history', {
                page: 'page',
                q: 'q',
                goods: 'goods',
                scrollTop: 'scrollTop'
            })
        },
		methods: {
            ...mapActions({
                storePage: 'history/storePage',
                storeQ: 'history/storeQ',
                addGood: 'history/addGood',
                cleanGoods: 'history/cleanGoods',
                storeScrollTop: 'history/storeScrollTop'
            }),
			formatImage: formatImage,
			formatImageBackground: formatImageBackground,
			formatIconBackground: formatIconBackground,
			goodOnTap: function(id, type){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
				if(type == '精品商城'){
					nav.go(`/shop/detail/${id}`);
				}else{
					nav.go(`/auction/detail/${id}`);
				}
            },
            onSearch: function(q){
                if(q == null){
                    q = '';
                }
                this.storeQ(q);
                this.storePage(1);
                this.cleanGoods();
                this.loadGoods();
            },
            loadGoods: function(){
                fetch.get(`/user/v2/goods/history?q=${this.q}&page=${this.page}`, null, function(data){
                    if(data.data.length > 0){
                        this.storePage(this.page + 1);
                    }
                    data.data.map(function(item, index){
                        var image = formatFeaturedImage(item.images);
                        this.addGood({
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
            },
            loadMore: function(){
                this.loadGoods();
            }
		},
        data(){
            return {
            }
        },
        mounted() {

            console.log(this.q);

            /*if(this.page == 1){
               this.loadGoods();
            }*/

            this.$nextTick(function () {
                window.scrollTo(0, this.scrollTop);
            })

            //this.q = '';
            //this.loadGoods();
            
           /* var _this = this;
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
            });*/
        }
    }
</script>