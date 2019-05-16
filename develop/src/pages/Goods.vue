<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />
        <div class="pm_main" id="good-list">
            <div class="tabwrap">
                <div class="module">
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
    import mainMenu from '../components/MainMenu.vue'

    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { formatImage, formatFeaturedImage, formatImageBackground, formatIconBackground, formatDateDiff } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                title: ''
            }
        },
        computed: {
            ...mapGetters('goods', {
                page: 'page',
                first: 'first',
                second: 'second',
                goods: 'goods'
            })
        },
        methods: {
            ...mapActions({
                storePage: 'goods/storePage',
                addGood: 'goods/addGood',
                cleanGoods: 'goods/cleanGoods'
            }),
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
            loadMore: function(){
                this.loadGoods();
            },
            loadGoods: function(){
                fetch.get(`/user/v2/category/goods?page=${this.page}&first=${this.first}&second=${this.second}`, null, function(data){
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
            }
        },
        mounted(){
            
            if(this.page == 1){
                this.loadGoods();
            }
        }
    }
</script>