<template>
    <div>
        <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
            <h1 class="mui-title">{{title}}</span></h1>
        </header>
        <div class="mui-content">
            <div id="slider" class="mui-slider">
                <div class="mui-slider-group">
                    <div class="mui-slider-item" v-for="image in images">
                        <a href="#">
                            <img style="height:220px;" v-bind:src="formatImage(image)">
                        </a>
                    </div>
                </div>
                <div class="mui-slider-indicator">
                    <div class="mui-indicator" v-bind:class="{'mui-active': index==0}" v-for="(image, index) in images">
                    
                    </div>
                </div>
            </div>
            <div class="title" style="margin-top:15px;">
                截止时间 {{formatDate2(new Date(this.deadline))}}<br/>
                剩余{{remainTitle}}   <span v-on:tap="orderCountOnTap(id)">出价次数{{orderCount}}次</span>{{buyerName == null ? '' : '(' + buyerName + ')'}}
            </div>
            <ul class="mui-table-view">
				<li class="mui-table-view-cell">
					{{title}}
  				</li>
				<li class="mui-table-view-cell">
					{{description}}
                    <div class="mui-pull-right"></div>
				</li>
				<li class="mui-table-view-cell" style="text-align:center;padding:20px;">
					当前价格{{renderPrice}}元(含3%手续费不含邮费, 邮费{{postage}}元)</br>
                    <b v-show="ownerFlag" style="color:red">您已是最高出价者</b>
                    <b v-show="!ownerFlag && buyerFlag" style="color:red">您的出价未超过最高出价者</b>
				</li>
                <li class="mui-table-view-cell" v-show="submitEnabledFlag">
					<div class="mui-numbox mui-pull-left" style="width: 220px;">
                        <button class="mui-btn mui-btn-numbox-minus" type="button" v-on:tap="priceOnDec">-</button>
                        <input class="mui-input-numbox" v-model="priceInput">
                        <button class="mui-btn mui-btn-numbox-plus" type="button" v-on:tap="priceOnInc">+</button>
                    </div>
                    <div class="mui-pull-right">
                        <button id="submit-btn" type="button" class="mui-btn mui-btn-danger"  style="width:100px;">竞价</button>
                    </div>
				</li>
			</ul>
            <ul class="mui-table-view">
                <li class="mui-table-view-cell" v-for="(question, index) in questions">
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
                postage: null
            }
        },
        methods: {
            formatImage: formatImage,
            formatDate2: formatDate2,
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
                    
                    this.id = data.data.goodId;
                    this.images = JSON.parse(data.data.images);
                    this.title = data.data.goodName;
                    this.description = data.data.description;
                    this.price = data.data.nextBid;
                    this.priceInput = data.data.nextBid;
                    this.basePrice = data.data.nextBid;
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

                }.bind(this));
            },
            orderCountOnTap: function(id){
                router.push(`/auction/list/${id}`);
            },
            priceOnInc: function(){
                var inc = Math.round(this.priceInput * 0.05);
                if(inc <= 0){
                    inc = 1;
                }
                this.priceInput += inc;
            },
            priceOnDec: function(){
                var inc = Math.round(this.priceInput * 0.05);
                if(inc <= 0){
                    inc = 1;
                }
                this.priceInput -= inc;
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

                if(this.priceInput < this.basePrice){
                    mui.toast('必须高于目前出价');
                    return;
                }

                fetch.post(`/user/v2/good/${goodId}/order?type=拍卖`, {
                    goodId: goodId,
                    buyPrice: this.priceInput,
                    goodName: this.title,
                    goodImages: JSON.stringify(this.images)
                }, function(data){
                    mui.toast('竞价完成');
                    this.loadGood(goodId);
                }.bind(this));
            }.bind(this));

            this.loadGood(goodId)
            this.loadQuestions(goodId);
        }
    }
</script>