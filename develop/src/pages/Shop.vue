<template>
    <div>
        <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
            <h1 class="mui-title">{{title}}</h1>
        </header>
        <div class="mui-content">
            <div id="slider" class="mui-slider">
                <div class="mui-slider-group">
                    <div v-bind:key="image" class="mui-slider-item" v-for="image in images">
                        <a href="#">
                            <img style="height:220px;" v-bind:src="formatImage(image)">
                        </a>
                    </div>
                </div>
                <div class="mui-slider-indicator">
                    <div v-bind:key="image" class="mui-indicator" v-bind:class="{'mui-active': index==0}" v-for="(image, index) in images"></div>
                </div>
            </div>
            <ul class="mui-table-view">
				<li class="mui-table-view-cell">
					{{title}}<div class="mui-pull-right"><span v-show='userId != null' v-bind:class="favoriteFlag ? 'mui-icon-extra-heart-filled' : 'mui-icon-extra-heart'" class="mui-icon-extra" v-on:tap="favoriteOnTap(id)"></span></div>
  				</li>
				<li class="mui-table-view-cell">
					{{description}}
                    <div class="mui-pull-right"></div>
				</li>
                <li class="mui-table-view-cell">
                    {{renderPrice}}元
                </li>
                <li class="mui-table-view-cell">
                    可供数量{{stockCount-orderCount}}
                </li>
                <li class="mui-table-view-cell" v-show="submitEnabledFlag">
					<div class="mui-numbox mui-pull-left" style="width: 220px;">
                        <button class="mui-btn mui-btn-numbox-minus" type="button" v-on:tap="buyCountOnDec">-</button>
                        <input class="mui-input-numbox" v-model="buyCount">
                        <button class="mui-btn mui-btn-numbox-plus" type="button" v-on:tap="buyCountOnInc">+</button>
                    </div>
                    <div class="mui-pull-right">
                        <button id="submit-btn" type="button" class="mui-btn mui-btn-danger"  style="width:100px;">购买</button>
                    </div>
				</li>
			</ul>
            <ul class="mui-table-view">
                <li v-bind:key="question.id" class="mui-table-view-cell" v-for="(question, index) in questions">
                    <p>提问{{index + 1}}&nbsp;&nbsp;{{question.question}}</p>
                    <p class="mui-ellipsis" style="color:black;"><b>{{question.answer}}</b></p>
                </li>
                <li class="mui-table-view-cell" style="text-align:center">
                    <div><textarea v-model="questionInput" rows="5" placeholder=""></textarea></div>
                    <div><button id="submit-question-btn" type="button" class="mui-btn mui-btn-danger"  style="width:100px;">提问</button></div>
                </li>
                
            </ul>
            
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import router from '../router.js'
    import fetch from '../utils/fetch.js'
    import { formatImage, formatDateDiff, formatDate2 } from '../utils/format.js'

    export default {
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
                router.push(`/auction/list/${id}`);
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
            }
        },
        updated(){
            mui('#slider').slider({interval: 0});
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
                return this.supplier != this.userId;
            },
            buyerFlag: function(){
                var orders = this.orders.filter(e => e.buyer == this.userId);
                return orders.length != 0;
            }
		},
        mounted() {

            var goodId = this.$route.params.goodId;

            $('#submit-question-btn').on('tap', function(event){

                if(this.questionInput == null){
                    mui.toast('请输入提问');
                    return;
                }

                var question = {
                    goodId: goodId,
                    question: this.questionInput
                };
                fetch.post(`/user/v2/good/${goodId}/question`, question, function(data){
                    this.loadQuestions(goodId);
                    this.questionInput = "";
                }.bind(this));
            }.bind(this));

            $('#submit-btn').on('tap', function(event){

                if(this.buyCount > (this.stockCount - this.orderCount)){
                    mui.toast('数量不能高于可供数量');
                    return;
                }

                fetch.post(`/user/v2/good/${goodId}/order?type=精品商城`, {
                    goodId: goodId,
                    buyPrice: this.priceInput,
                    goodName: this.title,
                    goodImages: JSON.stringify(this.images),
                    buyCount: this.buyCount
                }, function(data){
                    mui.toast('购买完成');
                    this.loadGood(goodId);
                }.bind(this));
            }.bind(this));

            this.loadGood(goodId)
            this.loadQuestions(goodId);
            this.loadFavorite(goodId);
        }
    }
</script>