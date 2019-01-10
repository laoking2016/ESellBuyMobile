<template>
    <div>
        <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
            <div class="mui-search" style="float:right;width:90%;line-height:44px;">
                <input id="search-input" type="search" v-model="keyword" class="mui-input-clear" disabled v-bind:placeholder="keyword">
            </div>
        </header>

        <div class="mui-content mui-scroll-wrapper">
            <div class="mui-scroll">
                <div style="width:100%;">
                    <div class="link-area" style="float:right;padding:5px;">
                        <a id='register-btn'>按时间顺序</a> <span class="spliter">|</span> <a id='forgetPassword-btn'>按价格顺序</a>
                    </div>
                </div>
                <div class="mui-row" style="clear:both;">
                    <div v-bind:key="good.id" class="mui-col-sm-4 mui-col-xs-4 good-item" v-bind:data-id="good.id" style="padding-left:2px;padding-right:2px;" v-for="good in filterredGoods">
                        <div class="good-deadline">还有1日3时23分</div>
                        <img style="width:100%;height:120px;" v-bind:data-id="good.id" v-bind:src="formatImage(good.image)">
                        <div class="good-price">￥{{good.quote}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import fetch from '../utils/fetch.js'
    import router from '../router.js'
    import { mapGetters } from 'vuex'
    import { SEARCH_KBN_KEYWORD, SEARCH_KBN_CATEGORY } from '../utils/const.js'
    import { formatFeaturedImage, formatImage } from '../utils/format.js'

    export default {
        data(){
            return {
                goods:[]
            }
        },
        methods: {
            formatImage: formatImage
        },
        computed: {
            ...mapGetters('search', {
                keyword: 'keyword',
                searchKbn: 'searchKbn',
                category: 'category'
            }),
            filterredGoods: function(){
                return this.goods.filter(e => e.status == '拍卖中');
            }
        },
        mounted() {
            switch(this.searchKbn){
                case SEARCH_KBN_KEYWORD:
                    fetch.get(`/user/v2/goods/search/keyword/${this.keyword}`, null, function(data){
                        this.goods = data.data.map(function(item, index){
                                return {
                                    id: item.goodId,
                                    title: item.goodName,
                                    image: formatFeaturedImage(item.images),
                                    quote: item.price,
                                    status: item.status
                                }
                            }.bind(this));
                        }.bind(this));
                    break;
                case SEARCH_KBN_CATEGORY:
                    fetch.get(`/user/v2/goods/search/category/${this.category}`, null, function(data){
                        this.goods = data.data.map(function(item, index){
                                return {
                                    id: item.goodId,
                                    title: item.goodName,
                                    image: formatFeaturedImage(item.images),
                                    quote: item.price,
                                    status: item.status
                                }
                            }.bind(this));
                        }.bind(this));
                    break;
            }

            mui(".mui-row").on('tap', '.good-item', function(e){
                var id = $(e.target).data("id");
                router.push(`/auction/detail/${id}`);
            });
        }
    }
</script>

<style scoped>
    @import "../assets/searchresult.css";
</style>