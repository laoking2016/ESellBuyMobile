<template>
    <div>
        <main-menu top-button-type="BACK" header-text="我的消息" />
        <div class="pm_main">
            <div class="pm_showinfo border_top">
                <li class="item clearfix">
                    <span class="tit">发信人</span>
                    <div class="info message-info">{{senderName}}</div>
                </li>
                <li class="item clearfix">
                    <span class="tit">标题</span>
                    <div class="info message-info">{{title}}</div>
                </li>
                <li class="item clearfix" style="border-bottom:none;">
                    <span class="tit"></span>
                    <div class="info message-info">{{message}}</div>
                </li>
                <input v-show="this.receiver == this.userId && !this.replyFlag" type="button" value="回复" class="ipt ipt_button pink_gradient" v-on:tap="onReply"/>
            </div>
            
        </div>
    </div>
</template>

<script>
    import mainMenu from '../components/MainMenu.vue'
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { mapGetters } from 'vuex'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                id: -1,
                sender: null,
                senderName: null,
                title: null,
                message: null
            }
        },
        methods: {
            onReply: function(){
                nav.go(`/message/send/${this.id}`);
            }
        },
        computed: {
            ...mapGetters({
                userId: 'user/userId'
            })
        },
        mounted(){
            this.id = this.$route.params.id;
            fetch.get(`/user/v2/message/${this.id}`, null, function(data){
                this.replyFlag = data.data.replyFlag;
                this.receiver = data.data.receiver;
                this.sender = data.data.sender;
                this.senderName = data.data.senderName;
                this.title = data.data.title;
                this.message = data.data.message;
            }.bind(this));
        }
    }
</script>