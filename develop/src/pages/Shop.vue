<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />

        <div class="gooddet_top">
            <div class="img_slide">
                <div class="swiper-container">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-bind:key="image" v-for="image in images">
                            <div class="detail-img" v-bind:style="formatImageBackground(image)" />
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
            <div class="info">
                <h5 class="title">{{title}}</h5>
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
        <div class="gooddet_eval border_top">
            <ul class="gooddet_eval_list">
                <li class="item" v-bind:key="question.id" v-for="(question, index) in questions">
                    <div class="item_t">
                        <img src="images/goods_04.jpg" alt="" class="hdimg"/>
                        <span class="name">挖掘机</span>
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
                buyCount: 1
            }
        },
        methods: {
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
                            question: item.question,
                            answer: item.answer == null ? '等待回答中' : item.answer
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
            var swiper = new Swiper('.img_slide .swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 0,
                centeredSlides: true,
                autoplay: 0,
                autoplayDisableOnInteraction: false
            });
        },
        computed: {
             ...mapGetters('user', {
                userId: 'userId'
            }),
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