<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />
        <div id="slider" class="mui-slider">
            <div class="mui-slider-group">
                <div v-bind:key="image" class="mui-slider-item" v-for="image in images">
                    <a href="#">
                        <div class="detail-img" v-bind:style="formatImageBackground(image)" />
                    </a>
                </div>
            </div>
            <div class="mui-slider-indicator">
                <div v-bind:key="image" class="mui-indicator" v-bind:class="{'mui-active': index==0}" v-for="(image, index) in images"></div>
            </div>
        </div>
        <div class="mui-content">
            <ul class="mui-table-view" style="margin-top:0px !important;">
                <li class="mui-table-view-cell">
                     <em class="icon icon_1 fl" style="font-size:.28rem;">卖家</em>
                     <h6 class="title aunction-title auction-supplier" v-bind:style='{backgroundImage: avatar == null ? `url(images/reg_02.png)` : `url(${avatar})`}'>{{supplierName}}</h6>
                     <div class="favorite">
                        <a href="#" class="gooddet_pricebox_button pink_gradient fl" v-on:tap="onSupplierGoods">在售商品</a>
                    </div>
                </li>
                <li class="mui-table-view-cell">
                    <span v-show='userId != null' v-bind:class="favoriteFlag ? 'mui-icon-extra-heart-filled' : 'mui-icon-extra-heart'" class="mui-icon-extra mui-pull-right" v-on:tap="favoriteOnTap(id)"></span>
                </li>
            </ul>
            <ul class="mui-table-view" style="border-top:.2rem solid #f1f6f9;">
                
            </ul>
        </div>

        <div class="gooddet_top">
            
            <div class="info">
                <div class="shop-info">
                    <h5 class="title shop-title">{{title}}</h5>
                </div>
                <h6 class="smtit">{{description}}</h6>
                <div class="bot clearfix">
                    <span class="price">
                        &yen; <i>{{renderPrice}}</i>
                    </span>
                    <span class="num fr">剩余数量：{{stockCount-orderCount}}</span>
                </div>
                <div class="bottom clearfix" v-show="submitEnabledFlag">
                    <div class="gooddet__num_box fl clearfix">
                        <a id="sub" href="javascript:void(0);" class="min fl" v-on:tap="buyCountOnDec"></a>
                        <input type="text" v-model="buyCount" class="fl text">
                        <a id="add" href="javascript:void(0);" class="add fl" v-on:tap="buyCountOnInc"></a>
                    </div>
                    <a href="#" class="gooddet_pricebox_button pink_gradient fl" v-on:tap="submitOnTap">购买</a>
                </div>
            </div>
        </div>
        <div v-show="role == 'buyer'" class="gooddet_eval border_top">
            <ul class="gooddet_eval_list">
                <li class="item" v-bind:key="question.id" v-for="(question, index) in filterredQuestions">
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
                                {{question.answer}}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="gooddet_eval_textarea">
                <textarea name="" class="ipt ipt_textarea" placeholder="这里是内容" v-model="questionInput"></textarea>
                <input type="button" value="提问" class="ipt ipt_button yellow_gradient" v-on:tap="submitQuestionOnTap" />
            </div>
        </div>
        <div v-show="role == 'supplier'" class="gooddet_eval border_top">
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
    import { mapGetters } from 'vuex'
    import nav from '../utils/nav.js'
    import fetch from '../utils/fetch.js'
    import mainMenu from '../components/MainMenu.vue'
    import { formatImage, formatDateDiff, formatDate2, formatImageBackground } from '../utils/format.js'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                id: null,
                images: [],
                title: null,
                description: null,
                basePrice: null,
                price: null,
                priceInput: null,
                questions: [],
                questionInput: null,
                ownerFlag: false,
                status: null,
                slider: null,
                deadline: null,
                orderCount: null,
                supplier: null,
                buyerName: null,
                orders: [],
                postage: null,
                favoriteFlag: false,
                stockCount: null,
                buyCount: 1,
                supplierName: null,
                supplierImage: null
            }
        },
        methods: {
            onReply: function(questionId){
                console.log(questionId);
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
            },
            onSupplierGoods: function(){
                nav.go(`/supplier/goods/${this.supplier}`);
            },
            loadSupplier: function(userId){
                fetch.get(`/user/v1/user/${userId}`, null, function(data){
                    this.supplierName = data.data.nickName;
                    this.supplierImage = data.data.avatar;
                }.bind(this));
            },
            favoriteOnTap: function(goodId){
                fetch.post(`/user/v2/good/${goodId}/favorite`, null, function(data){
                    this.favoriteFlag = data.data;    
                }.bind(this));
            },
            formatImage: formatImage,
            formatDate2: formatDate2,
            formatImageBackground: formatImageBackground,
            loadFavorite: function(goodId){
                fetch.get(`/user/v2/good/${goodId}/favorite`, null, function(data){
                    this.favoriteFlag = data.data;
                }.bind(this));
            },
            loadQuestions: function(goodId){
                fetch.get(`/user/v2/good/${goodId}/questions`, null, function(data){
                    this.questions = data.data.map(function(item, index){
                        return {
                            id: item.id,
                            question: item.question,
                            answer: item.answer == null ? '等待回答中' : item.answer,
                            nickName: item.nickName,
                            avatar: item.avatar,
                            questionUser: item.questionUser
                        }
                    });
                }.bind(this));
            },
            loadGood: function(goodId){
                fetch.get(`/user/v2/good/${goodId}`, null, function(data){
                    var orderCount = 0;
                    if(data.data.orders != null){
                        data.data.orders.map(function(order, index){
                            orderCount += order.buyCount;
                        });
                    }
                    
                    this.id = data.data.goodId;
                    this.images = JSON.parse(data.data.images);
                    this.title = data.data.goodName;
                    this.description = data.data.description;
                    this.price = data.data.topPrice;
                    this.priceInput = data.data.topPrice;
                    this.basePrice = data.data.topPrice;
                    this.status = data.data.status;
                    this.deadline = data.data.deadline;
                    this.orderCount = orderCount;
                    this.supplier = data.data.supplier;
                    this.orders = data.data.orders;
                    this.postage = data.data.postage;
                    if(data.data.order != null){
                        this.buyerName = data.data.order.buyerName;
                        this.ownerFlag = data.data.order.ownerFlag;
                    }
                    this.stockCount = data.data.stockCount;
                    
                    this.loadSupplier(data.data.supplier);
                }.bind(this));
            },
            orderCountOnTap: function(id){
                nav.go(`/auction/list/${id}`);
            },
            buyCountOnInc: function(){
                if(this.buyCount >= (this.stockCount-this.orderCount)){
                    return;
                }
                this.buyCount += 1;
            },
            buyCountOnDec: function(){
                if(this.buyCount <= 1){
                    return;
                }
                this.buyCount -= 1;
            },
            submitOnTap: function(){
                if(this.buyCount > (this.stockCount - this.orderCount)){
                    mui.alert('数量不能高于可供数量');
                    return;
                }

                fetch.post(`/user/v2/good/${this.id}/order?type=精品商城`, {
                    goodId: this.id,
                    buyPrice: this.priceInput,
                    goodName: this.title,
                    goodImages: JSON.stringify(this.images),
                    buyCount: this.buyCount
                }, function(data){
                    mui.toast('购买完成');
                    this.loadGood(this.id);
                }.bind(this));
            },
            submitQuestionOnTap: function(){
                if(this.questionInput == null){
                    mui.alert('请输入提问');
                    return;
                }

                var question = {
                    goodId: this.id,
                    question: this.questionInput
                };
                fetch.post(`/user/v2/good/${this.id}/question`, question, function(data){
                    this.loadQuestions(this.id);
                    this.questionInput = "";
                }.bind(this));
            }
        },
        updated(){
            mui('#slider').slider({interval: 0});
        },
        computed: {
            ...mapGetters({
                 token: 'user/token',
                 userId: 'user/userId'
             }),
             role: function(){
                 if(this.token == null){
                    return null;
                }

                var arr = this.token.split('_');

                if(arr.length == 3){
                    return arr[2];
                }

                return null;
            },
            filterredQuestions: function(){

                return this.questions.filter(e => e.questionUser == this.userId);
            },
			renderPrice: function(){
				return Math.round(this.price * 1.03);				
			},
            renderPriceInput: function(){
                return Math.round(this.priceInput * 1.03);
            },
            remainTitle: function(){
                return formatDateDiff(new Date(), new Date(this.deadline));
            },
            submitEnabledFlag: function(){
                return this.supplier != this.userId && this.stockCount - this.orderCount > 0;
            },
            buyerFlag: function(){
                var orders = this.orders.filter(e => e.buyer == this.userId);
                return orders.length != 0;
            }
		},
        mounted() {

            var goodId = this.$route.params.goodId;

            this.loadGood(goodId)
            this.loadQuestions(goodId);
            this.loadFavorite(goodId);
        }
    }
</script>