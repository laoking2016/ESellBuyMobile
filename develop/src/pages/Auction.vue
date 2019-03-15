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
                <li class="mui-table-view-cell gooddet_para">
                    <div class="row clearfix">
                        <span class="tit fl">商品名称</span>
                        <div class="info fr">
                            {{title}}
                        </div>
                    </div>
                </li>
                <li class="mui-table-view-cell gooddet_para">
                    <div class="row clearfix">
                        <span class="tit fl">描述</span>
                        <div class="info fr">
                            {{description}}
                        </div>
                    </div>
                </li>
                <li class="mui-table-view-cell ">
                    <div class="mui-navigate-right" v-on:tap="orderCountOnTap(id)">
                        <div class="gooddet_para clearfix">
                            <em class="icon icon_1 fl">截至</em>
                            <div class="txt fl">
                                截至时间 {{formatDate2(new Date(this.deadline))}}
                            </div>
                        </div>
                        <div class="gooddet_para ">
                            <em class="icon icon_2 fl">剩余</em>
                            <div class="txt fl">
                                剩余{{remainTitle}} <span >出价次数{{orderCount}}次</span>{{buyerName == null ? '' : '(' + buyerName + '领先)'}}
                            </div>
                        </div>
                    </div>
                    
                </li>
                <li class="mui-table-view-cell gooddet_para">
                    
                </li>
            </ul>
        </div>

        <div class="gooddet_pricebox border_top">
            <p class="font">当前价格<span style="font-size:x-large;">{{renderPrice}}</span>元(含3%手续费不含邮费, 邮费{{postage}}元)</p>
             <b v-show="ownerFlag" style="color:red">您已是最高出价者</b>
            <b v-show="!ownerFlag && buyerFlag" style="color:red">您的出价未超过最高出价者</b>
            
            <div class="box clearfix"  v-show="submitEnabledFlag">
                <div class="gooddet__num_box fl clearfix">
                    <a id="sub" href="javascript:void(0);" class="min fl" v-on:tap="priceOnDec"></a>
                    <input type="text" class="fl text" v-model="priceInput">
                    <a id="add" href="javascript:void(0);" class="add fl" v-on:tap="priceOnInc"></a>
                </div>
                <a href="#" class="gooddet_pricebox_button pink_gradient fl" v-on:tap="submitOnTap">竞价</a>
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
                <textarea name="" class="ipt ipt_textarea" v-model="questionInput" placeholder="这里是内容"></textarea>
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
    import mainMenu from '../components/MainMenu.vue'
    import { mapGetters } from 'vuex'
    import router from '../router.js'
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
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
            favoriteOnTap: function(goodId){
                fetch.post(`/user/v2/good/${goodId}/favorite`, null, function(data){
                    this.favoriteFlag = data.data;    
                }.bind(this));
            },
            onSupplierGoods: function(){
                nav.go(`/supplier/goods/${this.supplier}`);
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
                    var price = data.data.nextBid;

                    this.id = data.data.goodId;
                    this.images = JSON.parse(data.data.images);
                    this.title = data.data.goodName;
                    this.description = data.data.description;
                    
                    this.status = data.data.status;
                    this.deadline = data.data.deadline;
                    this.orderCount = data.data.orders.length;
                    this.supplier = data.data.supplier;
                    this.orders = data.data.orders;
                    this.postage = data.data.postage;
                    if(data.data.order != null){
                        this.buyerName = data.data.order.buyerName;
                        this.ownerFlag = data.data.order.ownerFlag;
                    }    

                    this.price = price;
                    this.priceInput = price;
                    this.basePrice = price;

                    if(data.data.order != null && this.ownerFlag){
                        this.priceInput = data.data.order.buyPrice;
                        this.basePrice = data.data.order.buyPrice;
                    }

                    this.loadSupplier(data.data.supplier);

                }.bind(this));
            },
            loadSupplier: function(userId){
                fetch.get(`/user/v1/user/${userId}`, null, function(data){
                    this.supplierName = data.data.nickName;
                    this.supplierImage = data.data.avatar;
                }.bind(this));
            },
            orderCountOnTap: function(id){
                nav.go(`/auction/list/${id}`);
            },
            priceOnInc: function(){
                console.log("ddid");
                var inc = this.getInc(this.priceInput);
                this.priceInput += inc;
            },
            getInc: function(price){
                var inc = 0;
                if(price < 100){
                    inc = 5;
                }else if(price >= 100 && price < 1000){
                    inc = 10;
                }else{
                    inc = 20;
                }
                return inc;
            },
            priceOnDec: function(){
                var inc = this.getInc(this.priceInput);
                this.priceInput -= inc;
            },
            submitOnTap: function(){
                if(this.priceInput <= this.basePrice){
                    mui.alert('必须高于目前出价');
                    return;
                }

                fetch.post(`/user/v2/good/${this.id}/order?type=拍卖`, {
                    goodId: this.id,
                    buyPrice: this.priceInput,
                    goodName: this.title,
                    goodImages: JSON.stringify(this.images)
                }, function(data){
                    mui.toast('竞价完成');
                    this.loadGood(this.id);
                }.bind(this), function(data){
                    mui.alert(data.message);
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
                return this.supplier != this.userId;
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