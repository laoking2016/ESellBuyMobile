<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:search="onSearch" readonly="false"/>
        <div class="search_main">
            <div class="search_para" style="z-index:999;text-align:right;">
                <li class="lk" v-on:tap="timeOnTap">
                    按日期排序 <span class="arrow">
                        <em class="icon up" v-show="sort == 'good_id asc'"></em>
                        <em class="icon down" v-show="sort == 'good_id desc'"></em>
                    </span>
                </li>
                <li class="lk" v-on:tap="priceOnTap">
                    按价格排序 <span class="arrow">
                        <em class="icon up" v-show="sort == 'next_bid asc'"></em>
                        <em class="icon down" v-show="sort == 'next_bid desc'"></em>
                    </span>
                </li>
            </div>
            <div class="search_result">
                <ul class="idx_list clearfix">
                    <li class="item" v-bind:key="good.id" v-for="good in sortedGoods" v-on:tap="itemOnTap(good.id, good.type)">
                        <a href="#" class="imgbox">
                            <div v-bind:style="formatIconBackground(good.image)" class="img"/>
                            <span v-if="good.type == '拍卖'" class="time">还有{{formatDateDiff(new Date(), new Date(good.deadline))}}</span>
                        </a>
                        <a href="#" class="title ellipsis">{{good.title}}</a>
                        <p class="price">&yen;{{good.quote}}</p>
                        
                    </li>
                    
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import mainMenu from '../components/MainMenu.vue'
    import router from '../router.js'
    import nav from '../utils/nav.js'
    import fetch from '../utils/fetch.js'
    import { formatFeaturedImage, formatImage, formatDateDiff, formatImageBackground, formatIconBackground } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                goods:[]
            }
        },
        computed: {
            ...mapGetters('search', {
                sort: 'sort',
                scrollTop: 'scrollTop'
            }),
            sortedGoods: function(){
                if(this.sort == 'good_id desc'){
                    return this.goods.sort((a, b) => b.id - a.id);
                }else if(this.sort == 'good_id asc'){
                    return this.goods.sort((a, b) => a.id - b.id);
                }else if(this.sort == 'next_bid desc'){
                    return this.goods.sort((a, b) => b.quote - a.quote);
                }else if(this.sort == 'next_bid asc'){
                    return this.goods.sort((a, b) => a.quote - b.quote);
                }
            }
        },
        methods: {
            ...mapActions({
                storeSort: 'search/storeSort',
                storeScrollTop: 'search/storeScrollTop'
            }),
            formatImage: formatImage,
            formatDateDiff: formatDateDiff,
            formatImageBackground: formatImageBackground,
            formatIconBackground: formatIconBackground,
            onSearch: function(keyword){
                console.log(keyword);
                fetch.get(`/user/v2/goods/search/keyword/${keyword}`, null, function(data){
                    this.goods = data.data.map(function(item, index){
                        return {
                            id: item.goodId,
                            title: item.goodName,
                            image: formatFeaturedImage(item.images),
                            quote: item.type == '拍卖' ? Math.round(item.nextBid * 1.03) : item.topPrice,
                            status: item.status,
                            deadline: item.deadline,
                            type: item.type
                        }
                    }.bind(this));

                    this.$nextTick(function () {
                        window.scrollTo(0, this.scrollTop);
                        this.storeScrollTop(0);
                    })
                }.bind(this));
                
           },
           itemOnTap: function(id, type){
               var top = 
                    window.pageYOffset || document.documentElement.scrollTop
                this.storeScrollTop(top);
               var url = null;
               if('拍卖' == type){
                   url = `/auction/detail/${id}`;
               }else{
                   url = `/shop/detail/${id}`;
               }
               nav.go(url);
           },
           timeOnTap: function(){
               if('good_id desc' == this.sort){
                    this.storeSort('good_id asc');
                }else if('good_id asc' == this.sort){
                    this.storeSort('good_id desc');
                }else{
                    this.storeSort('good_id desc');
                }
            },
            priceOnTap: function(){
                if('next_bid desc' == this.sort){
                    this.storeSort('next_bid asc');
                }else if('next_bid asc' == this.sort){
                    this.storeSort('next_bid desc');
                }else{
                    this.storeSort('next_bid desc');
                }
            }
        },
        mounted() {

            
        }
    }
</script>