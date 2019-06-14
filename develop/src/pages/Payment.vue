<template>
    <div>
        <main-menu top-button-type="BACK" header-text="确认支付提示"/>
        <div class="deal_main">
            <div style="padding-top:1rem;padding-left:.6rem;padding-right:.6rem;line-height:1.6;">
                <p>温馨提示：</p>
                <p>由于目前在线自动支付系统尚未投入使用，因此请买家与我们客服直接联系安排付款事宜。买家可以加微信客服号18588456200，或Whatsapp +852 94973997或Email：info@hkunitedauction.com</p>
                <p></p>
                <p>如果您已经联系客户完成支付，请按[确认完成付款]，如果尚未完成支付请按[返回]</p>
            </div>
            <div class="deal_list" style="border-top:none;">
                <div style="text-align:center;">
                    <a href="#" style="display:inline-block" class="more pink_gradient" v-on:tap="paidOnTap">确认完成付款</a>
                    <a href="#" style="display:inline-block" class="more pink_gradient" v-on:tap="returnOnTap">返回</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import mainMenu from '../components/MainMenu.vue'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                id: null
            }
        },
        methods: {
            paidOnTap(){
                fetch.post(`/user/v2/order/${this.id}/status?value=待发货`, null, function(data){
                    nav.go(`/customer/orders`);
                }.bind(this));
            },
            returnOnTap(){
                nav.go(`/customer/order/detail/${this.id}`);
            }
        },
        mounted(){
            
            var id = this.$route.params.id;
            this.id = id;

            fetch.get(`/user/v2/order/${id}`, null, function(order){
                this.id = id;
                this.status = order.data.status;
            }.bind(this));
        }
    }
</script>