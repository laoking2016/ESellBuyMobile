<template>
    <div>
        <header class="mui-bar mui-bar-nav">
            <h1 class="mui-title">登录</h1>
        </header>
        <div class="mui-content">
            <div class="mui-message mui-badge-yellow" v-show="error != null"><span class="mui-icon mui-icon-info"></span>{{error}}</div>
            <form id='login-form' class="mui-input-group">
                <div class="mui-input-row">
                    <label>账号</label>
                    <input id='account-input' v-model="username" type="text" class="mui-input-clear mui-input" placeholder="请输入账号" value="test@163.com">
                </div>
                <div class="mui-input-row">
                    <label>密码</label>
                    <input id='password-input' v-model="password" type="password" class="mui-input-clear mui-input" placeholder="请输入密码" value="111111">
                </div>
            </form>
            <div class="mui-content-padded">
                <button id='login-btn' type="button" class="mui-btn mui-btn-block mui-btn-primary">登录</button>
                <div class="link-area"><a id='register-btn'>注册账号</a> <!--span class="spliter">|</span> <a id='forgetPassword-btn'>忘记密码</a-->
                </div>
            </div>
            <div class="mui-content-padded oauth-area">
                
            </div>
        </div>
    </div>
    
</template>

<script>
    import { mapActions } from 'vuex'
    import router from '../router.js'
    import fetch from '../utils/fetch.js'

    export default {
        mounted() {
            $('#login-btn').on('tap', function(e){

                if(this.username == null || this.username == ""){
                    mui.toast('请输入用户名');
                    return;
                }

                if(this.password == null || this.password == ""){
                    mui.toast('请输入密码');
                    return;
                }

                fetch.post(`/user/v1/tokens?userName=${this.username}&passWord=${this.password}`, null, function(data){
                    if(data.code == 100){
                        this.storeToken(`${data.data.userId}_${data.data.token}_${data.data.role}`);
                        this.error = null;
                        router.push(`/`);
                    }
                }.bind(this), function(data){
                    console.log(data);
                    this.error = data.message;
                }.bind(this));
            }.bind(this));

            $('#register-btn').on('tap', function(e){
                router.push("/register");
            }.bind(this));
        },
        data(){
            return {
                username: null,
                password: null,
                error: null
            }
        },
        methods: mapActions({
            storeToken: 'user/storeToken'
        })
    }
</script>

<style scoped>
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
        /*-webkit-filter: grayscale(100%); */
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