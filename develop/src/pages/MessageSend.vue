<template>
    <div>
        <main-menu top-button-type="BACK" header-text="我的消息" />
        <div class="pm_main">

            <div v-show="showIndex == 0" class="pm_showinfo border_top">
                <li class="item clearfix" v-on:tap="onReceiver">
                    <span class="tit">收信人</span>
                    <div class="info message-info">{{receiverName}}</div>
                </li>
                <li class="item clearfix">
                    <span class="tit">标题</span>
                    <div class="info message-info">
                        <input type="text" v-model="title" class="ipt ipt_txt message-title" />
                    </div>
                </li>
                <li class="item clearfix" style="border-bottom:none;">
                    <span class="tit">内容</span>
                    <div class="info message-info">
                        <textarea rows="10" style="border:none;" v-model="message"></textarea>
                    </div>
                </li>
                <input type="button" value="发送" class="ipt ipt_button pink_gradient" v-on:tap="onSend" />
            </div>
            <div v-show="showIndex == 1" class="goodscata_main">
				<ul class="goodscata_list">
					<li v-bind:key="receiver.id" v-for="receiver in receivers" v-on:tap="onReceiverItem(receiver.id, receiver.name)">
						<a href="#">{{receiver.name}}</a>
					</li>
				</ul>
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
                replyId: -1,
                receiverId: -1,
                receiver: '',
                title: '',
                message: '',
                receivers: [],
                showIndex: 0
            }
        },
        computed: {
            ...mapGetters({
                userId: 'user/userId'
            })
        },
        methods: {
            onReceiver: function(){
                if(this.replyId != -1){
                    return;
                }
                this.showIndex = 1;
            },
            onReceiverItem: function(id, name){
                this.showIndex = 0;
                this.receiverId = id;
                this.receiverName = name;
            },
            onSend: function(){

                if(this.receiverName == null || this.receiverName == ""){
                    mui.alert('请选择收信人');
                    return;
                }

                if(this.title == null || this.title == ""){
                    mui.alert('请输入标题');
                    return;
                }

                if(this.message == null || this.message == ""){
                    mui.alert('请输入内容');
                    return;
                }

                fetch.post(`/user/v2/message`, {
                    id: -1,
                    receiver: this.receiverId,
                    title: this.title,
                    message: this.message,
                    replyId: this.replyId
                }, function(data){
                    nav.go('/message/list');
                }.bind(this));
            }
        },
        mounted(){
            this.replyId = this.$route.params.id;
            if(this.replyId == -1){
                this.title = '';
                
            }else{
                fetch.get(`/user/v2/message/${this.replyId}`, null, function(data){
                    this.title = `Re:${data.data.title}`;
                    this.receiverId = data.data.sender;
                    this.receiverName = data.data.senderName;
                }.bind(this));
            }

            fetch.get(`/user/v2/users`, null, function(data){
                this.receivers = data.data.filter(e => e.userId != this.userId).map(function(item, index){
                    return {
                        id: item.userId,
                        name: item.nickName
                    }
                }.bind(this));
            }.bind(this));
        }
    }
</script>