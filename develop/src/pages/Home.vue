<template>
    <div>
        <main-menu top-button-type="MENU" readonly="true" />
        <div class="mui-content">
            <div  id="home-page" class="mui-scroll-wrapper">
                <div class="mui-scroll">
                    <div style="padding:.2rem .25rem .35rem;">
                        <div id="slider" class="mui-slider">
                            <div class="mui-slider-group mui-slider-loop">
                                <div class="mui-slider-item mui-slider-item-duplicate">
                                    <a href="#">
                                        <img v-bind:src="images.length == 0 ? null : formatImage(images[images.length-1].image)" alt="" class="img"/>
                                    </a>
                                </div>
                                <div v-bind:key="image" class="mui-slider-item" v-for="image in images">
                                    <a href="#">
                                        <img v-bind:src="formatImage(image.image)" alt="" class="img"/>
                                    </a>
                                </div>
                                <div class="mui-slider-item mui-slider-item-duplicate">
                                    <a href="#">
                                        <img v-bind:src="images.length == 0 ? null : formatImage(images[0].image)" alt="" class="img"/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

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
                        <ul v-show="index == 1" class="idx_list clearfix ">
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
            },
            loadAuction: function(target){
                fetch.get(`/user/v2/goods?page=${this.page0}&type=拍卖`, null, function(data){
                    if(data.data.length > 0){
                        this.page0 = this.page0 + 1;
                    }
                    if(target != null){
                        target.endPullupToRefresh(false);
                    }
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
            },
            loadShop: function(target){
                fetch.get(`/user/v2/goods?page=${this.page1}&type=精品商城`, null, function(data){
                    if(data.data.length > 0){
                        this.page1 = this.page1 + 1;
                    }
                    if(target != null){
                        target.endPullupToRefresh(false);
                    }
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
        created(){
            for(var i = mui.hooks.inits.length-1,item;i>=0;i--){  
                item=mui.hooks.inits[i];  
                if(item.name=="pullrefresh"){  
                    item.repeat=true;  
                }  
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

            //this.loadGoods(this.page);
            this.loadAuction(null);
            this.loadShop(null);    
            var _this = this;

            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });

            mui.init({
                pullRefresh: {
                    container: "#home-page",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
                    up : {
                        height: 50,//可选.默认50.触发上拉加载拖动距离
                        auto: false,//可选,默认false.自动上拉加载一次
                        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                        callback: function(){
                            if(_this.index == 0){
                                _this.loadAuction(this);
                            }else{
                                _this.loadShop(this);
                            }
                        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    }
                }
            });
		},
        data(){
            return {
                page0: 1,
                page1: 1,
                goods: [],
                firsts: [],
                seconds: [],
                sortType: "TIME_ASC",
                images: []
            }
        },
        updated(){
            mui('#slider').slider({interval: 10000});
        }
    }
</script>

<style scoped>
    @import "../assets/home.css";
    .mui-scroll-wrapper{
        top: 1rem;
        height: 11rem;
    }
    
</style>