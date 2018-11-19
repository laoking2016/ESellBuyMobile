<<template>
    <div>
        <header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">微信用户注册</h1>
		</header>
        <div class="mui-content">
			<form class="mui-input-group">
				<div class="mui-input-row">
					<label>昵称</label>
                    <span class="label">{{nickName}}</span>
				</div>
                <div class="mui-input-row">
					<label>头像</label>
                    <img class="label" v-bind:src="avatar"/>
				</div>
                <div class="mui-input-row">
					<label>性别</label>
                    <span class="label">{{sex}}</span>
				</div>
                <div class="mui-input-row">
					<label>出生日期</label>
					<label id="birth-btn" style="padding-left:0px;">{{birth}}</label>
				</div>
                <div class="mui-input-row">
					<label>联系电话</label>
					<input v-model="phone" type="text" class="mui-input-clear mui-input" placeholder="请输入电话">
				</div>
				<div class="mui-input-row">
					<label>Email</label>
					<input v-model="email" type="email" class="mui-input-clear mui-input" placeholder="请输入Email">
				</div>
                <div class="mui-input-row" style="height:auto;">
					<label>联系地址</label>
					<textarea v-model="address" type="text" class="mui-input-clear mui-input" rows="4" placeholder="请输入联系地址">
                    </textarea>
				</div>
			</form>
			<div class="mui-content-padded">
				<button id='register-btn' class="mui-btn mui-btn-block mui-btn-primary">注册</button>
			</div>
			<div class="mui-content-padded">
				<p></p>
			</div>
		</div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import fetch from '../utils/fetch.js'
    import router from '../router.js'

    export default {
        data(){
            return {
                nickName: null,
                phone: null,
                sex: '请选择',
                birth: '请选择',
                avatar: null,
                email: null,
                address: null,
                openId: null
            }
        },
        methods: mapActions({
            storeToken: 'user/storeToken'
        }),
        mounted() {

            $('#sex-btn').on('tap', function(event){
                if(event.target.picker){
                    event.target.picker.show(function(items){
                        if(items.length > 0){
                            this.sex = items[0].value;
                        }
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }else{
                    event.target.picker = new mui.PopPicker();
                    event.target.picker.setData([
                        {
                            value: '男',
                            text: '男'
                        },{
                            value: '女',
                            text: '女'
                        }
                    ]);
                    event.target.picker.show(function(items){
                        if(items.length > 0){
                            this.sex = items[0].value;
                        }
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }
            }.bind(this));

            $('#birth-btn').on('tap', function(event){
                if(event.target.picker){
                    event.target.picker.show(function(rs){
                        this.birth = rs.text;
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }else{
                    event.target.picker = new mui.DtPicker({
                        type: "date",
                        beginYear: 1940,
                        endYear: 2015
                    });
                    event.target.picker.show(function(rs){
                        this.birth = rs.text;
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }
            }.bind(this));

            $('#register-btn').on('tap', function(event){
                
                if(this.phone == null || this.phone == ""){
                    mui.toast('请输入电话');
                    return;
                }

                if(this.sex == '请选择'){
                    mui.toast('请选择性别');
                    return;
                }

                if(this.birth == '请选择'){
                    mui.toast('请选择出生日期');
                    return;
                }

                if(this.email == null || this.email == ""){
                    mui.toast('请输入Email');
                    return;
                }

                if(this.address == null || this.address == ""){
                    mui.toast('请输入联系地址');
                    return;
                }

                fetch.post(`/user/v2/user`, {
                    nickName: this.nickName,
                    phone: this.phone,
                    avatar: this.avatar,
                    sex: this.sex,
                    birth: new Date(this.birth),
                    email: this.email,
                    address: this.address,
                    openId: this.openId,
                    role: 'buyer'
                }, function(data){
                    if(data.code == 100){
                        this.storeToken(`${data.data.userId}_${data.data.token}_${data.data.role}`);
                        router.push(`/`);
                    }
                }.bind(this));
            }.bind(this));


            if(window.auths == null){
                return null;
            }

            var s = window.auths[0];
            if(s.authResult){
                s.login(function(e){
                    s.getUserInfo(function(e){
                        this.openId = s.userInfo.openid;
                        this.nickName = s.userInfo.nickname;
                        this.sex = s.userInfo.sex == 1 ? '男' : '女'
                        this.avatar = s.userInfo.headimgurl;
                    }.bind(this));
                }.bind(this));
            }
        }
    }
</script>

<style scoped>
    .label{
        line-height: 40px;
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
    .mui-input-group label{
        width: 30%;
    }
    .mui-input-row label~input, .mui-input-row label~select, .mui-input-row label~textarea{
        width: 70%;
    }
</style>