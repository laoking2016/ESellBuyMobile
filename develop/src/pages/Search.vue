<template>
    <div>
        <main-menu top-button-type="MENU" v-bind:search="onSearch" readonly="false"/>
        <div class="search_main">
            <div class="search_para" style="z-index:-1">
                <li class="lk active">
                     <span class="arrow">
                        <em class="icon down" v-show="false"></em>
                    </span>
                </li>
                <li class="lk">
                     <span class="arrow">
                        <em class="icon up" v-show="false"></em>
                        <em class="icon down" v-show="false"></em>
                    </span>
                </li>
                <li class="lk" v-on:tap="priceOnTap">
                    按价格排序 <span class="arrow">
                        <em class="icon up"></em>
                        <em class="icon down"></em>
                    </span>
                </li>
            </div>
            <div class="search_result">
                <ul class="idx_list clearfix">
                    <li class="item" v-bind:key="good.id" v-for="good in sortedGoods" v-on:tap="itemOnTap(good.id, good.type)">
                        <a href="#" class="imgbox">
                            <div v-bind:style="formatImageBackground(good.image)" class="img"/>
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
    import mainMenu from '../components/MainMenu.vue'
    import router from '../router.js'
    import nav from '../utils/nav.js'
    import fetch from '../utils/fetch.js'
    import { formatFeaturedImage, formatImage, formatDateDiff, formatImageBackground } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                goods:[],
                sortType: "PRICE_DESC"
            }
        },
        computed: {
            sortedGoods: function(){
                var sortedList = [];
                switch(this.sortType){
                    case 'PRICE_DESC':
                        sortedList = _.sortBy(this.goods, [function(e){ return e.price }]);
                        break;
                    case 'PRICE_ASC':
                        sortedList = _.sortBy(this.goods, [function(e){ return e.price }]).reverse();
                        break;
                    default:
                        sortedList = [];
                        break;
                }
                return sortedList;
            }
        },
        methods: {
            formatImage: formatImage,
            formatDateDiff: formatDateDiff,
            formatImageBackground: formatImageBackground,
            onSearch: function(keyword){
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
                }.bind(this));
           },
           itemOnTap: function(id, type){
               var url = null;
               if('拍卖' == type){
                   url = `/auction/detail/${id}`;
               }else{
                   url = `/shop/detail/${id}`;
               }
               //router.push(url);
               nav.go(url);
           },
           timeOnTap: function(){
               if('TIME_DESC' == this.sortType){
                   this.sortType == 'TIME_ASC';
               }else if('TIME_ASC' == this.sortType){
                   this.sortType = 'TIME_DESC';
               }else{
                   this.sortType = 'TIME_DESC';
               }
               //this.$forceUpdate();
           },
           priceOnTap: function(){
               if('PRICE_DESC' == this.sortType){
                   this.sortType = 'PRICE_ASC';
               }else{
                   this.sortType = 'PRICE_DESC';
               }
               //this.$forceUpdate();
           }
        },
        mounted() {
            
        }
    }
</script>