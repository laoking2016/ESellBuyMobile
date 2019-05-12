<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />
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
    import fetch from '../utils/fetch.js'
    import { mapGetters } from 'vuex'

    export default {
        components:{
            mainMenu
        },
        data(){
            return {
                id: null,
                title: null,
                questions: [],
                questionInput: null
            }
        },
        methods: {
            loadQuestions: function(){
                console.log(this.id);
                fetch.get(`/user/v2/good/${this.id}/questions`, null, function(data){
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
                    this.loadQuestions();
                    this.questionInput = "";
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
            }
        },
        mounted(){
            this.id = this.$route.params.id;
            this.title = this.$route.params.title;
            
            this.loadQuestions();
        }
    }
</script>