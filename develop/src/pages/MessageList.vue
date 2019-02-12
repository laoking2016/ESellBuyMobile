<template>
    <div>
        <main-menu top-button-type="BACK" header-text="我的消息" />
        <div class="pm_main">
            <ul class="pm_list">
                <li v-bind:key="message.id" v-for="message in messages" 
                    class="item clearfix message-row" v-bind:class="{'message-unread': !message.readFlag && userId == message.receiver}"
                    v-on:tap="onReply(message.id)">
                    <div class="info fr message-message">
                        <a href="#" class="title">{{message.title}}</a>
                    </div>
                    <div class="info fr message-time">{{formatDate3(message.messageTime)}}</div>
                </li>
                
            </ul>
            <div class="pm_showinfo">
                <input type="button" value="创建新消息" class="ipt ipt_button pink_gradient" v-on:tap="onCreate" />
            </div>
        </div>
    </div>
</template>

<script>
    import mainMenu from '../components/MainMenu.vue'
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { formatDate3 } from '../utils/format.js'
    import { mapGetters } from 'vuex'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                messages: []
            }
        },
        mounted(){
            fetch.get(`/user/v2/user/messages`, null, function(data){
                this.messages = data.data.map(function(item, index){
                    return {
                        id: item.id,
                        title: item.title,
                        message: item.message,
                        messageTime: item.messageTime,
                        readFlag: item.readFlag,
                        receiver: item.receiver
                    }
                }.bind(this));
            }.bind(this));
        },
        computed: {
            ...mapGetters({
                userId: 'user/userId'
            })
        },
        methods: {
            formatDate3: formatDate3,
            onCreate: function(){
                nav.go('/message/send/-1');
            },
            onReply: function(id){
                nav.go(`/message/detail/${id}`);
            }
        }
    }
</script>