<template>
    <div>
        <main-menu top-button-type="MENU" readonly="true" />
        <div class="idx_top">
            <img src="images/idx_01.jpg" alt="" class="img"/>
        </div>
        <div class="idx_listwrap">
            <div class="idx_menu">
                <li class="lk" v-bind:class="{ cur: index == 0 }" v-on:tap="switchTo(0)">当前热拍</li>
                <li class="lk" v-bind:class="{ cur: index == 1 }" v-on:tap="switchTo(1)">精品商城</li>
                <!--li class="lk">最新消息</li-->
            </div>
            <div class="mui-content">
                <div v-show="index == 0" class="mui-row idx_list clearfix">
                    <div class="mui-col-sm-6 item" v-bind:key="good.id" v-on:tap="auctionItemOnTap(good.id)" v-for="good in filterredAuctionGoods">
                        <a href="#" class="imgbox">
                            <div class="img" v-bind:style="formatImageBackground(good.image)" />
                            <span class="time">还有{{formatDateDiff(new Date(), new Date(good.deadline))}}</span>
                        </a>
                        <a href="#" class="title ellipsis">{{good.title}}</a>
                        <p class="price">&yen;{{good.quote}}</p>
                    </div>
                </div>
                <div v-show="index == 1" class="mui-row idx_list clearfix">
                    <div class="mui-col-sm-6 item" v-bind:key="good.id" v-on:tap="shopItemOnTap(good.id)" v-for="good in filterredShopGoods">
                        <a href="#" class="imgbox">
                        <div class="img" v-bind:style="formatImageBackground(good.image)" />
                    </a>
                    <a href="#" class="title ellipsis">{{good.title}}</a>
                    <p class="price">&yen;{{good.quote}}</p>
                    </div>
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
    import { formatImage, formatFeaturedImage, formatImageBackground, formatDateDiff } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
        methods: {
            ...mapActions({
                storeIndex: 'home/storeIndex'
            }),
            formatImage: formatImage,
            formatDateDiff: formatDateDiff,
            formatImageBackground: formatImageBackground,
            shopItemOnTap: function(id){
                nav.go(`/shop/detail/${id}`);
            },
            auctionItemOnTap: function(id){
                nav.go(`/auction/detail/${id}`);
            },
            switchTo: function(index){
                this.storeIndex(index);
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
            }
        },
	  	mounted() {

            fetch.get(`/user/v2/goods`, null, function(data){
                this.goods = data.data.map(function(item, index){
                    var image = formatFeaturedImage(item.images);
                    
                    return {
                        id: item.goodId,
                        title: item.goodName,
                        image: image,
                        quote: item.type == '拍卖' ? Math.round(item.nextBid * 1.03) : item.topPrice,
                        status: item.status,
                        deadline: item.deadline,
                        type: item.type
                    };
                    
                });
            }.bind(this));
		},
        data(){
            return {
                goods: []
            }
        }
    }
</script>

<style scoped>
    @import "../assets/home.css";
</style>