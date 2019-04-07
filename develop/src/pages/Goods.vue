<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />
        <div class="pm_main" id="good-list">
            <div class="tabwrap">
                <div class="module">
                    <ul class="pm_list">
                        <li v-bind:key="good.id" v-for="good in filterredGoods" v-on:tap="goodOnTap(good.id, good.type)" class="item clearfix">
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
                page: 1,
                id: null,
                firstId: null,
                showIndex: 1,
                title: '选择类别',
                goods: []
            }
        },
        computed: {
            ...mapGetters('home', {
                first: 'first',
                second: 'second'
            }),
            filterredGoods: function(){
                if(this.second != -1){
                    return this.goods.filter(e => e.status == '拍卖中' && e.categorySecondId == this.second)
                }
                if(this.first != -1){
                    return this.goods.filter(e => e.status == '拍卖中' && e.categoryFirstId == this.first);
                }
                return this.goods.filter(e => e.status == '拍卖中');
            }
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
                fetch.get(`/user/v2/goods?page=${page}`, null, function(data){
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
                    //this.onSort();
                }.bind(this));
            }
        },
        mounted(){

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
                        }, 5000);
                    }
                }
            });
        }
    }
</script>