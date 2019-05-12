<template>
    <div>
        <main-menu top-button-type="BACK" header-text="拍卖交易"/>
        <div class="deal_main">
            <div class="deal_tip">{{message == null ? '截止到' + formatDate(deadline) : message}}</div>
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
                    <span class="tit">{{status == '拍卖中' ? '当前' : '成交'}}价格</span>
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
                <li class="item clearfix">
                    <span class="tit">微信</span>
                    <div class="info">
                        <span class="fz">{{contact.name}}</span>
                    </div>
                </li>
                <li class="item clearfix">
                    <span class="tit">Email</span>
                    <div class="info">
                        <span class="fz">{{contact.email}}</span>
                    </div>
                </li>
                <div style="text-align:center;">
                    <a href="#" style="display:inline-block" class="more pink_gradient" v-on:tap="auctionListOnTap(id)">竞拍明细</a>
                    <a href="#" style="display:inline-block" class="more pink_gradient" v-show="status == '待发货'" v-on:tap="shippedOnTap">确认发货</a>
                </div>
                
            </div>
        </div>
        <div class="gooddet_eval border_top">
            <ul class="gooddet_eval_list">
                <li class="item" v-bind:key="question.id" v-for="(question, index) in questions">
                    <div class="item_t">
                        <img v-bind:src="question.avatar == null ? 'images/goods_04.jpg' : question.avatar" alt="" class="hdimg"/>
                        <span class="name">{{question.nickName}}</span>
                    </div>
                    <div class="item_b">
                        <div class="group clearfix">
                            <em class="fz fl">问</em>
                            <div class="txt fr">
                                提问{{index + 1}}&nbsp;&nbsp;{{question.question}}
                            </div>
                        </div>
                        <div class="group clearfix">
                            <em class="fz fl">答</em>
                            <div class="txt fr txt_apply">
                                <span>{{question.answer}}</span>
                                <a href="#" style="float:right" v-on:tap="onReply(question.id)">{{question.shownFlag ? '提交' : '回复'}}</a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { formatImage, formatFeaturedImage, formatDate, formatMessage, formatImageBackground } from '../utils/format.js'
    import mainMenu from '../components/MainMenu.vue'

    export default {
        components: {
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
                status: null,
                deadline: null,
                contact: {
                    address: null,
                    name: null,
                    phone: null,
                    email: null
                },
                questions: [],
                type: null
            }
        },
        methods: {
            formatImage: formatImage,
            formatDate: formatDate,
            formatImageBackground: formatImageBackground,
            auctionListOnTap: function(id){
                nav.go(`/auction/list/${id}`);
            },
            shippedOnTap: function(){
                 fetch.post(`/user/v2/order/${this.orderId}/status?value=待签收`, null, function(data){
                    nav.go(`/supplier/orders`);
                }.bind(this));
            },
            onReply: function(questionId){
                var question = this.questions.filter(c => c.id == questionId)[0];
                
                if(question == null){
                    return;
                }

                mui.prompt(question.question, question.answer, '挖掘机', ['取消', '回复'], function(e){
                    if(e.index != 1){
                        return;
                    }
                    var answer = e.value;
                    fetch.post(`/user/v2/good/${this.id}/question/${questionId}`, {
                        id: questionId,
                        answer: answer,
                    }, function(data){
                        question.answer = answer;
                    }.bind(this));
                }.bind(this));
            }
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
                    this.price = Math.round(good.data.nextBid * 1.03);
                    //this.price = Math.round(good.data.finalPrice * 1.03);
                    this.count = good.data.order.buyCount;
                    this.date = formatDate(good.data.order.buyDate);
                    this.orderId = good.data.order.orderId;
                    this.contact = {
                        address: good.data.order.address,
                        name: good.data.order.buyerName,
                        phone: good.data.order.phone,
                        email: good.data.order.email
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
                            phone: order.data.phone,
                            email: order.data.email
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
                            nickName: item.nickName,
                            avatar: item.avatar
                        }
                }.bind(this));
            }.bind(this));

            /*mui(".mui-table-view").on('tap', '.response-btn', function(e){
                
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
            }.bind(this));*/
        }
    }
</script>

<style scope>
    .mui-message{        
        padding: 15px 15px 10px
    }
</style>