<template>
    <div class="reg_main">
        <main-menu top-button-type="MENU" header-text="我的" />
        <div class="my-avatar-panel">
            <li class="my-avatar" v-bind:style="{backgroundImage: `url(${avatar})`}">我的管理</li>
        </div>
        <div class="reg_form">
            <li class="username" v-on:tap="onProfile">编辑我的信息</li>
            <li class="seller" v-on:tap="onSeller">我发布的商品</li>
            <li class="buyer" v-on:tap="onBuyer">我出价的商品</li>
            <li class="focus" v-on:tap="onFavorite">我关注的商品</li>
            <li class="explan" v-on:tap="onMessageList">我的消息<b v-show="unReadCount > 0">({{unReadCount}})</b></li>
            <li class="login" v-on:tap="onLogout">登出</li>
        </div>
    </div>
</template>
<script>
    import mainMenu from '../components/MainMenu.vue'
    import { mapGetters, mapActions } from 'vuex'
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'

    export default {
        components: {
            mainMenu
        },
        data(){
            return {
                avatar: null,
                messages: []
            }
        },
        computed: {
            ...mapGetters({
                userId: 'user/userId'
            }),
            unReadCount: function(){
                return this.messages.filter(e => e.readFlag == false && e.receiver == this.userId).length;
            }
        },
        methods: {
            ...mapActions({
                storeUserId: 'user/storeUserId',
                storeToken: 'user/storeToken'
            }),
            onProfile: function(){
                nav.go('/profile');
            },
            onMessageList: function(){
                nav.go('/message/list');
            },
            onSeller: function(){
                nav.go('/supplier/orders');
            },
            onBuyer: function(){
                nav.go('/customer/orders');
            },
            onFavorite: function(){
                nav.go('/favorited/goods')
            },
            onLogout: function(){
                for ( var i in window.auths ) {
                    var s = window.auths[i];
                    if ( s.authResult ) {
                        s.logout(function(e){
                            mui.alert('您已登出');
                        }.bind(this));
                    }
                }
                this.storeUserId(null);
                this.storeToken(null);
                nav.go('/login');
            }
        },
        mounted() {
            fetch.get(`/user/v1/user/${this.userId}`, null, function(data){
                this.avatar = data.data.avatar;
            }.bind(this));

            fetch.get(`/user/v2/user/messages`, null, function(data){
                data.data.map(function(item, index){
                    this.messages.push({
                        d: item.id,
                        title: item.title,
                        message: item.message,
                        messageTime: item.messageTime,
                        readFlag: item.readFlag,
                        receiver: item.receiver
                    });
                }.bind(this));
            }.bind(this));
        }
    }
</script>