<template>
    <div>
        <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
            <h1 class="mui-title">拍品交易画面</h1>
        </header>   
        <div class="mui-content">
            <div class="mui-message mui-badge-yellow"><span class="mui-icon mui-icon-info"></span>{{message == null ? '截止到' + formatDate(deadline) : message}}</div>
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
                    <label>{{status == '拍卖中' ? '当前' : '成交'}}价格</label>
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
                    <button v-show="type == '拍卖'" type="button" id="auction-list-btn" v-bind:data-id="id" class="mui-btn mui-btn-danger"  style="width:100px;">竞拍明细</button>
                    <button type="button" v-show="status == '待发货'" id="shipped-btn" class="mui-btn mui-btn-danger"  style="width:100px;">确认发货</button>
                </div>
            </form>
            <ul class="mui-table-view">
                <li v-bind:key="question.id" class="mui-table-view-cell" v-for="(question, index) in questions">
                    <p>提问{{index + 1}}&nbsp;&nbsp;{{question.question}}</p>
                    <div v-if="question.shownFlag"><textarea v-bind:id="'response-input-' + question.id" rows="3" placeholder="">{{question.answer}}</textarea></div>
                    <p v-if="question.answer" class="mui-ellipsis" style="color:black;"><b>{{question.answer}}</b></p>
                    <div><button type="button" class="response-btn mui-btn mui-btn-danger" v-bind:data-id="question.id" style="width:100px;float:right;">{{question.shownFlag ? '提交' : '回复'}}</button></div>
                </li>
            </ul>
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
                status: null,
                deadline: null,
                contact: {
                    address: null,
                    name: null,
                    phone: null
                },
                questions: [],
                type: null
            }
        },
        methods: {
            formatImage: formatImage,
            formatDate: formatDate
        },
        computed: {
            message: function(){
                return formatMessage(this.status);
            }
        },
        mounted() {
            
            var goodId = this.$route.params.goodId;
            var orderId = this.$route.params.orderId;

            fetch.get(`/user/v2/good/${goodId}`, null, function(good){
                this.id = goodId;
                this.type = good.data.type;
                this.image = formatFeaturedImage(good.data.images);
                this.title = good.data.goodName;
                this.description = good.data.description;
                this.status = good.data.status;
                this.deadline = good.data.deadline;
                if(good.data.order == null){
                    this.price = good.data.price;
                }else{
                    this.price = Math.round(good.data.finalPrice * 1.03);
                    this.count = good.data.order.buyCount;
                    this.date = formatDate(good.data.order.buyDate);
                    this.orderId = good.data.order.orderId;
                    this.contact = {
                        address: good.data.order.address,
                        name: good.data.order.buyerName,
                        phone: good.data.order.phone
                    }
                }
                
                this.postage = good.data.postage;

                if(good.data.type == '精品商城'){
                    fetch.get(`/user/v2/order/${orderId}`, null, function(order){
                        this.price = Math.round(order.data.buyPrice * 1.03);
                        this.count = order.data.buyCount;
                        this.date = formatDate(order.data.buyDate);
                        this.orderId = order.data.orderId;
                        this.status = order.data.status;
                        this.contact = {
                            address: order.data.address,
                            name: order.data.buyerName,
                            phone: order.data.phone
                        }
                    }.bind(this));
                }

            }.bind(this));

            fetch.get(`/user/v2/good/${goodId}/questions`, null, function(questions){
                this.questions = questions.data.map(function(item, index){
                    return {
                            id: item.id,
                            question: item.question,
                            answer: item.answer == null ? '等待回答中' : item.answer,
                            shownFlag: false
                        }
                }.bind(this));
            }.bind(this));

            mui(".mui-table-view").on('tap', '.response-btn', function(e){
                
                var id = $(e.target).data("id");
                var question = this.questions.filter(c => c.id == id)[0];
                
                if(question == null){
                    return;
                }

                if(question.shownFlag){
                     var answer = $(`#response-input-${id}`).val();
                    fetch.post(`/user/v2/good/${goodId}/question/${id}`, {
                        id: id,
                        answer: answer,
                    }, function(data){
                        question.answer = answer;
                        question.shownFlag = !question.shownFlag;
                    }.bind(this));
                }else{
                    question.shownFlag = !question.shownFlag;
                }
            }.bind(this));

            $('#auction-list-btn').on('tap', function(e){
                var id = $(e.target).data("id");
                router.push(`/auction/list/${id}`);
            }.bind(this));

            $('#shipped-btn').on('tap', function(e){

                fetch.post(`/user/v2/order/${this.orderId}/status?value=待签收`, null, function(data){
                    router.push(`/supplier/orders`);
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