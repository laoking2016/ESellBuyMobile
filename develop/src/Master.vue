<template>
    <div>
        <router-view></router-view>
        <div style="height:50px;"></div>
        <nav class="mui-bar mui-bar-tab bottom-menu">
            <a class="mui-tab-item" href="#" v-on:tap="onHome">
                <span class="index">首页</span>
            </a>
            <a class="mui-tab-item" href="#">
                <span class="explan">联系我们</span>
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
                storeToken: 'user/storeToken'
            }),
            onHome: function(){
                nav.go('/');
            },
            onLogin: function(){
                if(this.loginFlag){
                    nav.go('/my');
                }else{
                    this.storeUserId(null);
                    this.storeToken(null);
                    nav.go('/login');
                }
            }
        },
        mounted(){
        }
    }
</script>

<style scoped>
    @import "./assets/master.css";
</style>



