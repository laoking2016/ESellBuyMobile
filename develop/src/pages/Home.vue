<template>
    <div>
        <main-menu top-button-type="MENU" readonly="true" />
        <div class="mui-content">
            <div  id="home-page">
                <div>
                    <div style="padding:.2rem .25rem .35rem;">
                        <div id="slider" class="mui-slider">
                            <div class="mui-slider-group mui-slider-loop">
                                <div class="mui-slider-item mui-slider-item-duplicate">
                                    <a href="#">
                                        <img  style="width:100%" v-bind:src="images.length == 0 ? null : formatImage(images[images.length-1].image)" alt="" class="img"/>
                                    </a>
                                </div>
                                <div v-bind:key="image" class="mui-slider-item" v-for="image in images">
                                    <a href="#">
                                        <img style="width:100%" v-bind:src="formatImage(image.image)" alt="" class="img"/>
                                    </a>
                                </div>
                                <div class="mui-slider-item mui-slider-item-duplicate">
                                    <a href="#">
                                        <img  style="width:100%" v-bind:src="images.length == 0 ? null : formatImage(images[0].image)" alt="" class="img"/>
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

                    <div class="idx_listwrap" style="padding-bottom:0px;">
                        <div class="idx_menu">
                            <li style="font-size:.4rem;" class="lk" v-bind:class="{ cur: index == 0 }" v-on:tap="switchTo(0)">当前热拍</li>
                            <li style="font-size:.4rem;" class="lk" v-bind:class="{ cur: index == 1 }" v-on:tap="switchTo(1)">精品商城</li>
                            <!--li class="lk">最新消息</li-->
                        </div>
                        <div class="search_para home-price">
                            <li class="lk" v-on:tap="timeOnTap">
                                按日期排序 <span class="arrow">
                                    <em class="icon up" v-show="sort == 'deadline asc, good_id asc'"></em>
                                    <em class="icon down" v-show="sort == 'deadline desc, good_id desc'"></em>
                                </span>
                            </li>
                            <li class="lk" v-on:tap="priceOnTap">
                                按价格排序 <span class="arrow">
                                    <em class="icon up" v-show="sort == 'next_bid asc'"></em>
                                    <em class="icon down" v-show="sort == 'next_bid desc'"></em>
                                </span>
                            </li>
                        </div>
                        
                        <ul v-show="index == 0" class="idx_list clearfix">
                            <li class="item" v-bind:key="good.id" v-on:tap="auctionItemOnTap(good.id)" v-for="good in filterredAuctionGoods">
                                <a href="#" class="imgbox">
                                    <div v-bind:style="formatIconBackground(good.image)" class="img"/>
                                    <span class="time">{{now > new Date(good.deadline) ? '已过期' : '还有' + formatDateDiff(now, new Date(good.deadline))}}</span>
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
                    <div class="mui-pull-bottom-pocket mui-block mui-visibility" v-on:tap="loadMore">
                        <div class="mui-pull">
                            <div class="mui-pull-loading mui-icon mui-spinner mui-hidden"></div>
                            <div class="mui-pull-caption mui-pull-caption-nomore">查看更多...</div>
                        </div>
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
                storeIndex: 'home/storeIndex',
                storePage0: 'home/storePage0',
                storePage1: 'home/storePage1',
                storeSort: 'home/storeSort',
                cleanGoods: 'home/cleanGoods',
                addGood: 'home/addGood',
                storeScrollTop: 'home/storeScrollTop'
            }),
            formatImage: formatImage,
            formatDateDiff: formatDateDiff,
            formatImageBackground: formatImageBackground,
            formatIconBackground: formatIconBackground,
            timeOnTap: function(){
                    
                this.cleanGoods();
                if('deadline desc, good_id desc' == this.sort){
                    this.storeSort('deadline asc, good_id asc');
                }else if('deadline asc, good_id asc' == this.sort){
                    this.storeSort('deadline desc, good_id desc');
                }else{
                    this.storeSort('deadline desc, good_id desc');
                }
                if(this.index == 0){
                    this.storePage0(1);
                    this.loadAuction(null);
                }else{
                    this.storePage1(1);
                    this.loadShop(null);
                }
                
            },
            priceOnTap: function(){
                this.cleanGoods();
                if('next_bid desc' == this.sort){
                    this.storeSort('next_bid asc');
                }else if('next_bid asc' == this.sort){
                    this.storeSort('next_bid desc');
                }else{
                    this.storeSort('next_bid desc');
                }
                if(this.index == 0){
                    this.storePage0(1);
                    this.loadAuction(null);
                }else{
                    this.storePage1(1);
                    this.loadShop(null);
                }
            },
            shopItemOnTap: function(id){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
                nav.go(`/shop/detail/${id}`);
            },
            auctionItemOnTap: function(id){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
                console.log(top);
                nav.go(`/auction/detail/${id}`);
            },
            switchTo: function(index){
                
                if(index != this.index){
                    this.cleanGoods();
                    if(index == 0){
                        this.storeSort("deadline asc, good_id asc");
                        this.storePage0(1);
                        this.loadAuction(null);
                    }else{
                        this.storeSort("deadline desc, good_id desc");
                        this.storePage1(1);
                        this.loadShop(null);
                    }
                }
                this.storeIndex(index);
                
            },
            onMoreCategory: function(){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
                nav.go(`/goods/category`);
            },
            onContact: function(){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
                nav.go('/contact');
            },
            onInstruction: function(){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
                nav.go('/instruction');
            },
            historyOnTap: function(){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
                nav.go(`/history`);
            },
            loadMore: function(){
                var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                if(this.index == 0){
                    
                    this.loadAuction(top);
                }else{
                    this.loadShop(top);
                }
            },
            loadAuction: function(top){
                fetch.get(`/user/v2/goods?page=${this.page0}&type=拍卖&sort=${this.sort}`, null, function(data){
                    if(data.data.length > 0){
                        this.storePage0(this.page0 + 1);
                    }
                    data.data.map(function(item, index){
                        
                        if(this.goods.filter(e => e.id == item.goodId).length == 0){
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
                        }
                        
                    }.bind(this));
                    this.$nextTick(function(){
                        //window.scrollTo(0, top);
                    });
                }.bind(this));
            },
            loadShop: function(top){
                fetch.get(`/user/v2/goods?page=${this.page1}&type=精品商城&sort=${this.sort}`, null, function(data){
                    if(data.data.length > 0){
                        this.storePage1(this.page1 + 1);
                    }
                    data.data.map(function(item, index){
                        
                        if(this.goods.filter(e => e.id == item.goodId).length == 0){
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
                        }
                        
                    }.bind(this));
                    this.$nextTick(function(){
                        //window.scrollTo(0, top);
                    });
                }.bind(this));
            }
        },
        computed: {
             ...mapGetters('home', {
                index: 'index',
                goods: 'goods',
                page0: 'page0',
                page1: 'page1',
                sort: 'sort',
                scrollTop: 'scrollTop'
            }),
            filterredAuctionGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中' && e.type == '拍卖');
            },
            filterredShopGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中' && e.type == '精品商城');
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

            if(this.index == 0){
                if(this.page0 == 1){
                    this.loadAuction(null);
                }
            }else{
                if(this.page1 == 1){
                    this.loadShop(null);  
                }
            }

            this.$nextTick(function () {
                window.scrollTo(0, this.scrollTop);
                this.storeScrollTop(0);
            })

            setTimeout(function(){
                mui('#slider').slider({interval: 10000});
            }.bind(this), 2000)

            setInterval(function(){
                this.now = new Date();
            }.bind(this), 1000);

            
        },
        data(){
            return {
                images: [],
                now: new Date()
            }
        },
        updated(){
            
        }
    }
</script>

<style scoped>
    @import "../assets/home.css";
    .mui-scroll-wrapper{
        top: 1rem;
    }
    
</style>