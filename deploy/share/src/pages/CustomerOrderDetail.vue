<template>
    <div>
        <main-menu top-button-type="BACK" header-text="拍品交易画面"/>
        <div class="deal_main">
            <div class="deal_tip">{{message}}</div>
            <div class="deal_menu clearfix">
                <li class="info cur"><a href="#">交易信息</a></li>
                <li class="process"><a href="#">交易流程</a></li>
            </div>
            <div class="deal_list">
                <li class="item clearfix">
                    <div v-bind:style="formatImageBackground(image)" class="pic"/>
                    <span class="pic_fz">{{title}}</span>
                </li>
                <li class="item clearfix">
                    <span class="tit">成交价格</span>
                    <div class="info">
                        <span class="fz">{{price}}元</span>
                    </div>
                </li>
                <li class="item clearfix">
                    <span class="tit">邮费</span>
                    <div class="info">
                        <span class="fz">{{postage}}元</span>
                    </div>
                </li>
                <li class="item clearfix">
                    <span class="tit">成交日期</span>
                    <div class="info">
                        <span class="fz">{{date}}</span>
                    </div>
                </li>
                <li class="item clearfix">
                    <span class="tit">数量</span>
                    <div class="info">
                        <span class="fz">{{count}}</span>
                    </div>
                </li>
                <li class="item clearfix">
                    <span class="tit">发货地址</span>
                    <div class="info">
                        <span class="fz">{{contact.address}}</span>
                    </div>
                </li>
                <li class="item clearfix">
                    <span class="tit">联系人</span>
                    <div class="info">
                        <span class="fz">{{contact.name}}</span>
                    </div>
                </li>
                <li class="item clearfix">
                    <span class="tit">电话</span>
                    <div class="info">
                        <span class="fz">{{contact.phone}}</span>
                    </div>
                </li>
                <div style="text-align:center;">
                    <a href="#" style="display:inline-block" v-show="status == '待支付'" class="more pink_gradient" v-on:tap="paidOnTap">确认付款</a>
                    <a href="#" style="display:inline-block" v-show="status == '待签收'" class="more pink_gradient" v-on:tap="receiveOnTap">确认签收</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import mainMenu from '../components/MainMenu.vue'
    import { formatImage, formatFeaturedImage, formatDate, formatMessage, formatImageBackground } from '../utils/format.js'

    export default {
        components:{
            mainMenu
        },
        data(){
            return {
                id: null,
                image: null,
                title: null,
                description: null,
                date: null,
                count: null,
                price: null,
                postage: null,
                orderId: null,
                contact: {
                    address: null,
                    name: null,
                    phone: null
                },
                status: null,
                questions: []
            }
        },
        methods: {
            formatImage: formatImage,
            formatImageBackground: formatImageBackground,
            paidOnTap: function(){
                fetch.post(`/user/v2/order/${this.id}/status?value=待发货`, null, function(data){
                    nav.go(`/customer/orders`);
                }.bind(this));
            },
            receiveOnTap: function(){
                fetch.post(`/user/v2/order/${this.id}/status?value=已完成`, null, function(data){
                    nav.go(`/customer/orders`);
                }.bind(this));
            }
        },
        computed: {
            message: function(){
                return formatMessage(this.status);
            }
        },
        mounted() {
            
            var id = this.$route.params.id;

            fetch.get(`/user/v2/order/${id}`, null, function(order){
                this.id = id;
                this.image = formatFeaturedImage(order.data.images);
                this.title = order.data.goodName;
                this.description = order.data.description;
                this.price = order.data.type == '拍卖' ?  Math.round(order.data.nextBid * 1.03) : order.data.buyPrice;
                this.count = order.data.buyCount;
                this.date = formatDate(order.data.buyDate)
                this.orderId = id;
                this.postage = order.data.postage;
                this.status = order.data.status;
                this.contact = {
                    address: order.data.address,
                    name: order.data.buyerName,
                    phone: order.data.phone
                };
                fetch
            }.bind(this));
        }
    }
</script>