<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title"/>
        <div class="deadline_main">
            <ul class="deadline_list">
                <li class="item clearfix" 
                    v-bind:key="order.id" 
                    v-bind:class="{ first: index == 0, second: index == 1, third: index == 2 }" 
                    v-for="(order, index) in orders">
                    <span class="rank fl"></span>
                    <div class="info fl">
                        <h6 class="name">{{order.buyer}}</h6>
                        <p class="date">{{order.date}}</p>
                    </div>
                    <span class="num">{{order.price}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import fetch from '../utils/fetch.js'
    import mainMenu from '../components/MainMenu.vue'
    import { formateTime } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
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
                var nextBid = good.data.nextBid;
                this.orders = good.data.orders.map(function(item, index)
                {
                    var price = item.buyPrice;
                    if(good.data.type == '拍卖'){
                        price = item.buyPrice > nextBid ? Math.round(nextBid * 1.03) : item.buyPrice;
                    }
                    return {
                        buyer: item.buyerName,
                        date: formateTime(item.buyDate),
                        price: price,
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