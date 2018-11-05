<template>
    <div>
        <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
            <h1 class="mui-title">拍品交易画面</h1>
        </header>   
        <div class="mui-content">
            <div class="mui-message mui-badge-yellow" v-show="status != null"><span class="mui-icon mui-icon-info"></span>{{message}}</div>
            <h5 style="padding:14px 15px">
                <span class="mui-media-object mui-pull-left">交易信息</span>
                <span class="mui-icon mui-icon-arrowright mui-pull-right" style="font-size:14px;"></span>
                <span class="mui-media-object mui-pull-right">交易流程</span>
            </h5>

            <form class="mui-input-group" >
                <div class="mui-input-row" style="padding:11px 15px;height:auto;">
                    <div class="mui-pull-left" style="width:35%;">
                        <img style="line-height:42px;max-width:42px;height:42px;" v-bind:src="formatImage(image)">
                    </div>
                    
                    <div class="mui-pull-left" style="padding-left: 0px;height:42px;line-height:42px;">{{title}}</div>
                </div>
                <div class="mui-input-row">
                    <label>成交价格</label>
                    <span class=""><label style="padding-left:0px;">{{price}}元</label></span>
                </div>
                <div class="mui-input-row">
                    <label>邮费</label>
                    <span class=""><label style="padding-left:0px;">{{postage}}元</label></span>
                </div>
                <div class="mui-input-row">
                    <label>成交日期</label>
                    <span class=""><label style="padding-left:0px;">{{date}}</label></span>
                </div>
                <div class="mui-input-row">
                    <label>数量</label>
                    <span class=""><label style="padding-left:0px;">{{count}}</label></span>
                </div>
                <!--div class="mui-input-row">
                    <label>商品ID</label>
                    <span class=""><label style="padding-left:0px;">{{id}}</label></span>
                </div-->
                <div class="mui-input-row" style="height:auto;">
                    <label>发货地址</label>
                    <span class=""><label style="width:65%;padding-left:0px;">{{contact.address}}</label></span>
                </div>
                <div class="mui-input-row">
                    <label>联系人</label>
                    <span class=""><label style="width:65%;padding-left:0px;">{{contact.name}}</label></span>
                </div>
                <div class="mui-input-row">
                    <label>电话</label>
                    <span class=""><label style="width:65%;padding-left:0px;">{{contact.phone}}</label></span>
                </div>
                <div class="mui-button-row">
                    <button type="button" v-show="status == '待支付'" id="paid-btn" v-bind:data-id="orderId" class="mui-btn mui-btn-danger"  style="width:100px;">确认付款</button>
                    <button type="button" v-show="status == '待签收'" id="received-btn" class="mui-btn mui-btn-danger"  style="width:100px;">确认签收</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import fetch from '../utils/fetch.js'
    import router from '../router.js'
    import { formatImage, formatFeaturedImage, formatDate, formatMessage } from '../utils/format.js'

    export default {
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
            formatImage: formatImage
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
                this.price = order.data.buyPrice;
                this.count = order.data.buyCount;
                this.date = formatDate(order.data.buyDate)
                this.orderId = id;
                this.status = order.data.status;
                this.contact = {
                    address: order.data.address,
                    name: order.data.buyerName,
                    phone: order.data.phone
                };
                fetch
            }.bind(this));

            $('#paid-btn').on('tap', function(e){
                
                fetch.post(`/user/v2/order/${this.id}/status?value=待发货`, null, function(data){
                    router.push(`/customer/orders`);
                }.bind(this));
            }.bind(this));

            $('#received-btn').on('tap', function(e){

                fetch.post(`/user/v2/order/${this.id}/status?value=已完成`, null, function(data){
                    router.push(`/customer/orders`);
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