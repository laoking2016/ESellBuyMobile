<template>
    <div>
        <div class="reg_main">
            <div class="reg_top">
                <img src="images/logo.png" alt="" class="logo">
            </div>
            <div class="reg_form login_form">
                <li class="username">
                    <input type="text" v-model="username" class="ipt ipt_txt" placeholder="请输入您的账号">
                </li>
                <li class="password">
                    <input type="password" v-model="password" class="ipt ipt_txt" placeholder="请输入您的密码">
                </li>
                <input type="button" value="登录" class="ipt ipt_button pink_gradient" v-on:tap="handleLogin">
                <div class="tips">
                    <a href="#" class="lk" v-on:tap="handleWechatLogin">微信登陆</a>|
                    <a href="#" class="lk" v-on:tap="handleRegister">注册账号</a>
                </div>
                <a href="#" class="vx_icon" v-show="false" v-on:tap="handleWechatLogin"></a>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import nav from '../utils/nav.js'
    import fetch from '../utils/fetch.js'

    export default {
        mounted() {
        },
        data(){
            return {
                username: null,
                password: null,
                error: null
            }
        },
        methods: {
            ...mapActions({
                storeToken: 'user/storeToken',
                storeUserId: 'user/storeUserId'
            }),
            handleLogin: function(){
                if(this.username == null || this.username == ""){
                    mui.alert('请输入用户名');
                    return;
                }

                if(this.password == null || this.password == ""){
                    mui.alert('请输入密码');
                    return;
                }

                fetch.post(`/user/v1/tokens?userName=${this.username}&passWord=${this.password}`, null, function(data){
                    if(data.code == 100){
                        this.storeUserId(data.data.userId);
                        this.storeToken(`${data.data.userId}_${data.data.token}_${data.data.role}`);
                        this.error = null;
                        nav.go(`/`);
                    }
                }.bind(this), function(data){
                    this.error = data.message;
                }.bind(this));
            },
            handleRegister: function(){
                nav.go("/register");
            },
            handleWechatLogin: function(){
                if(window.auths == null){
                    return;
                }
                var s = window.auths[0];
                s.login(function(e){
                    var result = e.target.authResult;
                    fetch.get(`/user/v2/user/wechat/login?openId=${result.openid}&accessToken=${result.access_token}`, null, function(data){
                        if(data.code == 100){
                            this.storeUserId(data.data.userId);
                            this.storeToken(`${data.data.userId}_${data.data.token}_${data.data.role}`);
                            this.error = null;
                            nav.go(`/`);
                        }
                    }.bind(this), function(error){
                        if(error.code == -1002){
                            nav.go('/wechat/register')
                        }else if(error.code == -1001){
                            this.error = data.message;
                        }
                    }.bind(this));
                }.bind(this), function(e){
                    mui.alert('微信认证失败' + JSON.stringify(e));
                }.bind(this), {
                    scope: 'snsapi_userinfo'
                });
            }
        } 
    }
</script>

<style scoped>
    .mui-icon-weixin{
        font-size: 40px;
        color: gray;
    }
    .ui-page-login,
    body {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
    }
    .mui-content{height: 100%;}

    .area {
        margin: 20px auto 0px auto;
    }
    
    .mui-input-group {
        margin-top: 10px;
    }
    
    .mui-input-group:first-child {
        margin-top: 20px;
    }
    
    .mui-input-group label {
        width: 22%;
    }
    
    .mui-input-row label~input,
    .mui-input-row label~select,
    .mui-input-row label~textarea {
        width: 78%;
    }
    
    .mui-checkbox input[type=checkbox],
    .mui-radio input[type=radio] {
        top: 6px;
    }
    
    .mui-content-padded {
        margin-top: 25px;
    }
    
    .mui-btn {
        padding: 10px;
    }
    
    .link-area {
        display: block;
        margin-top: 25px;
        text-align: center;
    }
    
    .spliter {
        color: #bbb;
        padding: 0px 8px;
    }
    
    .oauth-area {
        position: absolute;
        bottom: 20px;
        left: 0px;
        text-align: center;
        width: 100%;
        padding: 0px;
        margin: 0px;
    }
    
    .oauth-area .oauth-btn {
        display: inline-block;
        width: 50px;
        height: 50px;
        background-size: 30px 30px;
        background-position: center center;
        background-repeat: no-repeat;
        margin: 0px 20px;
        border: solid 1px #ddd;
        border-radius: 25px;
    }
    
    .oauth-area .oauth-btn:active {
        border: solid 1px #aaa;
    }
    
    .oauth-area .oauth-btn.disabled {
        background-color: #ddd;
    }
</style>