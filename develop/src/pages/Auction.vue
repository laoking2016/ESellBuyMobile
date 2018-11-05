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
            <div class="title" style="margin-top:15px;">剩余 1天3小时12分   出家次数 15次</div>
            <ul class="mui-table-view">
				<li class="mui-table-view-cell">
					{{title}}
  				</li>
				<li class="mui-table-view-cell">
					{{description}}
                    <div class="mui-pull-right"></div>
				</li>
				<li class="mui-table-view-cell" style="text-align:center;padding:20px;">
					当前价格 {{renderPrice}} 元（含3%手续费）</br>
                    <span v-show="ownerFlag">您已是最高出价者</span>
				</li>
                <li class="mui-table-view-cell">
					<div class="mui-numbox mui-pull-left" style="width: 220px;">
                        <button id="price-dec-btn" class="mui-btn mui-btn-numbox-minus" type="button">-</button>
                        <input class="mui-input-numbox" v-model="priceInput">
                        <button id="price-inc-btn" class="mui-btn mui-btn-numbox-plus" type="button">+</button>
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
    import router from '../router.js'
    import fetch from '../utils/fetch.js'
    import { formatImage } from '../utils/format.js'

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
                slider: null
            }
        },
        methods: {
            formatImage: formatImage,
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
                    
                    this.id = data.data.id;
                    this.images = JSON.parse(data.data.images);
                    this.title = data.data.goodName;
                    this.description = data.data.description;
                    this.price = data.data.nextBid;
                    this.priceInput = data.data.nextBid;
                    this.basePrice = data.data.nextBid;
                    this.status = data.data.status;
                    
                    if(data.data.order != null){
                        this.ownerFlag = data.data.order.ownerFlag;
                    }    

                }.bind(this));
            }
        },
        updated(){
            mui('#slider').slider({interval: 0});
        },
        computed: {
			renderPrice: function(){
				return Math.round(this.price * 1.03);				
			},
            renderPriceInput: function(){
                return Math.round(this.priceInput * 1.03);
            }
		},
        mounted() {

            var goodId = this.$route.params.goodId;
            
            $('#price-dec-btn').on('tap', function(event){
                this.priceInput -= Math.round(this.priceInput * 0.05); 
            }.bind(this));

            $('#price-inc-btn').on('tap', function(event){
                this.priceInput += Math.round(this.priceInput * 0.05);
            }.bind(this));
            
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