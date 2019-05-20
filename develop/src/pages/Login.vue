<template>
    <div>
        <div class="reg_main">
            <div class="reg_top">
                <img src="images/logo.png" alt="" class="logo">
                <span class="logo login-title">让你的收藏买卖更容易</span>
            </div>
            <div class="reg_form login_form">
                <li class="username">
                    <input type="text" v-model="username" class="ipt ipt_txt" placeholder="请输入您的账号">
                </li>
                <li class="password">
                    <input type="password" v-model="password" class="ipt ipt_txt" placeholder="请输入您的密码">
                </li>
                <input type="button" value="登录" class="ipt ipt_button pink_gradient" v-on:tap="handleLogin">
                <a href="#" class="ipt ipt_button pink_gradient login-register-btn" v-on:tap="handleRegister">注册账号</a>
                <img style="width:1.5rem;" src="images/weixin.png" class="ipt ipt_button pink_gradient" v-on:tap="handleWechatLogin">
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
                    mui.alert(data.message);
                }.bind(this));
            },
            handleRegister: function(){
                nav.go("/register");
            },
            handleWechatLoginResult: function(){

                var s = window.auths[0];
                if(s.authResult){
                    s.getUserInfo(function(e){
                        var openId = s.userInfo.openid;
                        var nickName = s.userInfo.nickname;
                        var sex = s.userInfo.sex == 1 ? '男' : '女'
                        var avatar = s.userInfo.headimgurl;
                        var phone = s.userInfo.phonenumber;
                        var email = s.userInfo.email;
                        console.log(s.userInfo);

                        fetch.post(`/user/v2/wechat/user`, {
                            nickName: nickName,
                            phone: phone,
                            avatar: avatar,
                            sex: sex,
                            birth: null,
                            email: email,
                            address: null,
                            openId: openId,
                            role: 'buyer'
                        }, function(data){
                            if(data.code == 100){
                                this.storeUserId(data.data.userId);
                                this.storeToken(`${data.data.userId}_${data.data.token}_${data.data.role}`);
                                nav.go(`/`);
                            }
                        }.bind(this));

                    }.bind(this));
                }

                /*fetch.get(`/user/v2/user/wechat/login?openId=${openId}&accessToken=${accessToken}`, null, function(data){
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
                }.bind(this));*/
            },
            handleWechatLogin: function(){
                if(window.auths == null){
                    return;
                }
                var s = window.auths[0];
                if(!s.authResult){
                    s.login(function(e){
                        var result = e.target.authResult;
                        this.handleWechatLoginResult();
                    }.bind(this), function(e){
                        mui.alert('微信认证失败' + JSON.stringify(e));
                    }.bind(this), {
                        scope: 'snsapi_userinfo'
                    });
                }else{
                    this.handleWechatLoginResult();
                }
            }
        } 
    }
</script>