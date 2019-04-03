<template>
    <div>
        <main-menu top-button-type="MENU" readonly="true" />
        <div v-show="showIndex == 0">
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
                        <img style='width:60%' src='images/class.jpg' v-on:tap='onMoreCategory'>
                    </div>
                    <div class="mui-col-sm-3 mui-col-xs-3" style='text-align:center'>
                        <img style='width:60%' src='images/contact.jpg' v-on:tap='onContact'/>
                    </div>
                    <div class="mui-col-sm-3 mui-col-xs-3" style='text-align:center'>
                        <img style='width:60%' src='images/jingjia.jpg' v-on:tap='onInstruction'/>
                    </div>
                    <div class="mui-col-sm-3 mui-col-xs-3" style='text-align:center' v-on:tap='historyOnTap'>
                        <img style='width:60%' src='images/paimai.jpg'/>
                    </div>
                </div>
            </div>

            <div class="idx_listwrap">
                <div v-show='false' class="home-category">
                    <a href="#" class="lk" v-bind:class="{'cur': first == -1 }" v-on:tap="onCategory(-1)">全部</a>
                    <a href="#" v-bind:key="item.id" class="lk" v-bind:class="{'cur': first == item.id}" v-for="item in firsts" v-on:tap="onCategory(item.id)">{{item.title}}</a>
                    <a href="#" class="lk" v-on:tap="onMoreCategory">更多分类</a>
                </div>
                <!--div class="home-category-second" v-show="first != -1">
                    <a href="#" class="lk" v-bind:class="{'cur': second == -1}" v-on:tap="onCategorySecond(-1)">全部</a>
                    <a href="#" class="lk" v-bind:key="item.id" v-bind:class="{'cur': second == item.id}" v-on:tap="onCategorySecond(item.id)" v-for="item in filterredCategorySeconds">{{item.title}}</a>
                </div-->
                <div class="idx_menu">
                    <li class="lk" v-bind:class="{ cur: index == 0 }" v-on:tap="switchTo(0)">当前热拍</li>
                    <li class="lk" v-bind:class="{ cur: index == 1 }" v-on:tap="switchTo(1)">精品商城</li>
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
        <div v-show="showIndex == 1">
            <category v-bind:search="handleCategoryCallback" />
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
                storeIndex: 'home/storeIndex',
                storeFirst: 'home/storeFirst',
                storeSecond: 'home/storeSecond'
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
            onCategory: function(id){
                this.storeSecond(-1);
                this.storeFirst(id);
            },
            onCategorySecond: function(id){
                this.storeSecond(id);
            },
            handleCategoryCallback: function(id, title, firstId){
                this.showIndex = 0;
                this.storeFirst(firstId);
                this.onCategorySecond(id)
            },
            onMoreCategory: function(){
                this.showIndex = 1;
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
                index: 'index',
                first: 'first',
                second: 'second'
            }),
            filterredAuctionGoods: function(){
                if(this.second != -1){
                    return this.goods.filter(e => e.status == '拍卖中' && e.type == '拍卖' && e.categorySecondId == this.second);
                }
                if(this.first != -1){
                    return this.goods.filter(e => e.status == '拍卖中' && e.type == '拍卖' && e.categoryFirstId == this.first);
                }
                return this.goods.filter(e => e.status == '拍卖中' && e.type == '拍卖');
            },
            filterredShopGoods: function(){
                if(this.second != -1){
                    return this.goods.filter(e => e.status == '拍卖中' && e.type == '精品商城' && e.categorySecondId == this.second);
                }
                if(this.first != -1){
                    return this.goods.filter(e => e.status == '拍卖中' && e.type == '精品商城' && e.categoryFirstId == this.first);
                }
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

            fetch.get(`/user/v2/category/first`, null, function(data){
                this.firsts = data.data.map(function(item, index){
                    return {
                        index: index,
                        title: item.categoryName,
                        id: item.categoryFirstId
                    }
                });
                
            }.bind(this));

            fetch.get(`/user/v1/category/second`, null, function(data){
                this.seconds = data.data.map(function(item, index){
                    return {
                        title: item.categoryName,
                        id: item.categorySecondId,
                        parent: item.categoryFirstId
                    }
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
                showIndex: 0,
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