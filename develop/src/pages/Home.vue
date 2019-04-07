<template>
    <div>
        <main-menu top-button-type="MENU" readonly="true" />
        <div>
            <div class="mui-content" style="padding:.2rem .25rem .35rem;">
                <div id="slider" class="mui-slider">
                    <div class="mui-slider-group">
                        <div v-bind:key="image" class="mui-slider-item" v-for="image in images">
                            <a href="#">
                                <img v-bind:src="formatImage(image.image)" alt="" class="img"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class='mui-content'>
                <div class="mui-row">
                    <div class="mui-col-sm-3 mui-col-xs-3" style='text-align:center'>
                        <div><img style='width:1.3rem;height:1.3rem;' src='images/class.jpg' v-on:tap='onMoreCategory'></div>
                        <div style="font-size:.28rem;">分类</div>
                    </div>
                    <div class="mui-col-sm-3 mui-col-xs-3" style='text-align:center'>
                        <div><img style='width:1.3rem;height:1.3rem;' src='images/contact.jpg' v-on:tap='onContact'/></div>
                        <div style="font-size:.28rem;">联系我们</div>
                    </div>
                    <div class="mui-col-sm-3 mui-col-xs-3" style='text-align:center'>
                        <div><img style='width:1.3rem;height:1.3rem;' src='images/jingjia.jpg' v-on:tap='onInstruction'/></div>
                        <div style="font-size:.28rem;">竞价说明</div>
                    </div>
                    <div class="mui-col-sm-3 mui-col-xs-3" style='text-align:center;padding-bottom:.2rem;' v-on:tap='historyOnTap'>
                        <div><img style='width:1.3rem;height:1.3rem;' src='images/paimai.jpg'/></div>
                        <div style="font-size:.28rem;">历史成交</div>
                    </div>
                </div>
            </div>

            <div class="idx_listwrap">
                <div class="idx_menu">
                    <li style="font-size:.4rem;" class="lk" v-bind:class="{ cur: index == 0 }" v-on:tap="switchTo(0)">当前热拍</li>
                    <li style="font-size:.4rem;" class="lk" v-bind:class="{ cur: index == 1 }" v-on:tap="switchTo(1)">精品商城</li>
                    <!--li class="lk">最新消息</li-->
                </div>
                <div class="search_para home-price">
                    <li class="lk" v-on:tap="timeOnTap">
                        按日期排序 <span class="arrow">
                            <em class="icon up" v-show="sortType == 'TIME_ASC'"></em>
                            <em class="icon down" v-show="sortType == 'TIME_DESC'"></em>
                        </span>
                    </li>
                    <li class="lk" v-on:tap="priceOnTap">
                        按价格排序 <span class="arrow">
                            <em class="icon up" v-show="sortType == 'PRICE_ASC'"></em>
                            <em class="icon down" v-show="sortType == 'PRICE_DESC'"></em>
                        </span>
                    </li>
                </div>
                <div id="good-list">
                    <ul v-show="index == 0" class="idx_list clearfix">
                        <li class="item" v-bind:key="good.id" v-on:tap="auctionItemOnTap(good.id)" v-for="good in filterredAuctionGoods">
                            <a href="#" class="imgbox">
                                <div v-bind:style="formatIconBackground(good.image)" class="img"/>
                                <span class="time">还有{{formatDateDiff(new Date(), new Date(good.deadline))}}</span>
                            </a>
                            <a href="#" class="title ellipsis">{{good.title}}</a>
                            <p class="price">&yen;{{good.quote}}</p>
                        </li>
                    </ul>
                    <ul v-show="index == 1" class="idx_list clearfix">
                        <li class="item" v-bind:key="good.id" v-on:tap="shopItemOnTap(good.id)" v-for="good in filterredShopGoods">
                            <a href="#" class="imgbox">
                                <div v-bind:style="formatIconBackground(good.image)" class="img"/>
                            </a>
                            <a href="#" class="title ellipsis">{{good.title}}</a>
                            <p class="price">&yen;{{good.quote}}</p>
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
    import category from '../components/Category.vue'
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { formatImage, formatFeaturedImage, formatImageBackground, formatIconBackground, formatDateDiff } from '../utils/format.js'

    export default {
        components: {
            mainMenu,
            category
        },
        methods: {
            ...mapActions({
                storeIndex: 'home/storeIndex'
            }),
            formatImage: formatImage,
            formatDateDiff: formatDateDiff,
            formatImageBackground: formatImageBackground,
            formatIconBackground: formatIconBackground,
            timeOnTap: function(){
                if('TIME_DESC' == this.sortType){
                    this.sortType = 'TIME_ASC';
                }else if('TIME_ASC' == this.sortType){
                    this.sortType = 'TIME_DESC';
                }else{
                    this.sortType = 'TIME_DESC';
                }
                this.onSort();
            },
            onSort: function(){
                switch(this.sortType){
                    case 'PRICE_DESC':
                        this.goods.sort((a, b) => a.quote - b.quote);
                        break;
                    case 'PRICE_ASC':
                        this.goods.sort((a, b) => b.quote - a.quote);
                        break;
                    case 'TIME_DESC':
                        this.goods.sort((a, b) => a.deadline - b.deadline);
                        break;
                    case 'TIME_ASC':
                        this.goods.sort((a, b) => b.deadline - a.deadline);
                        break;
                    default:
                        this.goods.sort((a, b) => a.deadline - b.deadline);
                        break;
                }
            },
            priceOnTap: function(){
                if('PRICE_DESC' == this.sortType){
                    this.sortType = 'PRICE_ASC';
                }else if('PRICE_ASC' == this.sortType){
                    this.sortType = 'PRICE_DESC';
                }else{
                    this.sortType = 'PRICE_DESC';
                }
                this.onSort();
            },
            shopItemOnTap: function(id){
                nav.go(`/shop/detail/${id}`);
            },
            auctionItemOnTap: function(id){
                nav.go(`/auction/detail/${id}`);
            },
            switchTo: function(index){
                this.storeIndex(index);
            },
            onMoreCategory: function(){
                nav.go(`/goods/category`);
                //this.showIndex = 1;
            },
            onContact: function(){
                nav.go('/contact');
            },
            onInstruction: function(){
                nav.go('/instruction');
            },
            historyOnTap: function(){
                nav.go(`/history`);
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
                    this.onSort();
                }.bind(this));
            }
        },
        computed: {
             ...mapGetters('home', {
                index: 'index'
            }),
            filterredAuctionGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中' && e.type == '拍卖');
            },
            filterredShopGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中' && e.type == '精品商城');
            },
            filterredCategorySeconds: function(){
                return this.seconds.filter(e => e.parent == this.first);
            }
        },
	  	mounted() {

            fetch.get(`/user/v2/advs`, null, function(data){
                this.images = data.data.map(function(item, index){
                    return {
                        image: item.image
                    };
                });
            }.bind(this));

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
		},
        data(){
            return {
                page: 1,
                goods: [],
                firsts: [],
                seconds: [],
                sortType: "TIME_DESC",
                images: []
            }
        },
        updated(){
            mui('#slider').slider({interval: 0});
        }
    }
</script>

<style scoped>
    @import "../assets/home.css";
</style>