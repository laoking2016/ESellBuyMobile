<template>
    <div>
        <router-view/>
        <div style="height:85px;" ></div>
        <nav class="mui-bar mui-bar-tab bottom-menu">
            <a class="mui-tab-item" href="#" v-on:tap="onHome">
                <span class="index">首页</span>
            </a>
            <a class="mui-tab-item" href="#">
                <img src='images/logo.jpg' style='width:.8rem'>
            </a>
            <a class="mui-tab-item" href="#" v-on:tap="onLogin">
                <span class="login" >{{loginFlag ? '我的' : '登陆'}}</span>
            </a>
        </nav>
    </div>
</template>

<script>
    import nav from './utils/nav.js'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        computed: {
            ...mapGetters({
                token: 'user/token'
            }),
            loginFlag: function(){
                return this.token != null;
            }
        },
        methods: {
            ...mapActions({
                storeUserId: 'user/storeUserId',
                storeToken: 'user/storeToken',
                storeOpenId: 'user/storeOpenId',
                storeScrollTop: 'home/storeScrollTop'
            }),
            onHome: function(){
                this.storeScrollTop(0);
                nav.go('/');
            },
            onLogin: function(){
                if(this.loginFlag){
                    nav.go('/my');
                }else{
                    this.storeUserId(null);
                    this.storeToken(null);
                    this.storeOpenId(null);
                    nav.go('/login');
                }
            }
        },
        mounted(){
            
        },
        created(){
            var userId = window.localStorage.getItem('userId');
            var token = window.localStorage.getItem('token');
            var openId = window.localStorage.getItem('openId');
            console.log(token);
            if(userId != "null"){
                this.storeUserId(userId);
            }

            if(token != "null"){
                this.storeToken(token);
            }

            if(openId != "null"){
                this.storeOpenId(openId);
            }
        }
    }
</script>

<style scoped>
    @import "./assets/master.css";
</style>



