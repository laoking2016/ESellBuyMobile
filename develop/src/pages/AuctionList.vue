<template>
    <div class="mui-off-canvas-wrap mui-draggable">
        <div class="mui-inner-wrap">
            <!-- 主页面标题 -->
            <header class="mui-bar mui-bar-nav">
                <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
                <h1 class="mui-title">{{title}}</h1>
            </header>
            <div class="mui-content mui-scroll-wrapper">
                <ul class="mui-table-view mui-table-view-chevron">
                    <li class="mui-table-view-cell mui-media" v-for="order in orders">
                        <span  class="mui-navigate-right">
                            <span class="mui-media-object mui-pull-right order-item">{{order.price}}</span>
                            <div class="mui-media-body">
                                {{order.buyer}}({{order.phone}})
                                <p class="mui-ellipsis">{{order.date}}</p>
                            </div>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import fetch from '../utils/fetch.js'
    import router from '../router.js'
    import { formatDate } from '../utils/format.js'

    export default {
        data(){
            return {
                id: null,
                title: null,
                orders: []
            }
        },
        mounted() {
            
            this.id = this.$route.params.id;

            fetch.get(`/user/v2/good/${this.id}`, null, function(good){
                this.title = good.data.goodName;
                this.orders = good.data.orders.map(function(item, index){
                    return {
                        buyer: item.buyerName,
                        date: formatDate(item.buyDate),
                        price: item.buyPrice,
                        phone: item.phone
                    };
                }.bind(this));
            }.bind(this));

            
        }
    }
</script>

<style scope>
    .mui-message{        
        padding: 15px 15px 10px
    }
</style>