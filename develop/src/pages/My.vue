<template>
    <div class="reg_main">
        <main-menu top-button-type="MENU" header-text=" " />
        <div class="my-avatar-panel">
            <li class="my-avatar" v-bind:style="{backgroundImage: avatar == null ? `url(images/reg_02.png)` : `url(${avatar})`}">我的管理</li>
        </div>
        <div id="my-form" class="reg_form">
            <li class="username my-item" v-on:tap="onProfile">编辑我的信息</li>
            <li v-show="role == 'supplier'" class="seller my-item" v-on:tap="onSeller">我发布的商品</li>
            <li class="buyer my-item" v-on:tap="onBuyer">我出价的商品</li>
            <li class="focus my-item" v-on:tap="onFavorite">我关注的商品</li>
            <li class="explan my-item" v-on:tap="onMessageList">我的消息<b v-show="unReadCount > 0">({{unReadCount}})</b></li>
            <li v-show="role == 'supplier'" class="auction my-item" v-on:tap="onAuction">拍卖出品</li>
            <li v-show="role == 'supplier'" class="shop my-item" v-on:tap="onShop">商城上架</li>
            <li class="login my-item" v-on:tap="onLogout">登出</li>
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
                userId: 'user/userId',
                token: 'user/token'
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
                nav.go('/favorited/goods');
            },
            onAuction: function(){
                nav.go('/auction/publish');
            },
            onShop: function(){
                nav.go('/shop/publish');
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