<<template>
    <div>
        <header class="mui-bar mui-bar-nav">
			<a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
			<h1 class="mui-title">注册</h1>
		</header>
        <div class="mui-content">
			<form class="mui-input-group">
				<div class="mui-input-row">
					<label>用户名</label>
					<input v-model="userName" type="text" class="mui-input-clear mui-input" placeholder="请输入账号">
				</div>
				<div class="mui-input-row">
					<label>登录密码</label>
					<input v-model="passWord" type="password" class="mui-input-clear mui-input" placeholder="请输入密码">
				</div>
				<div class="mui-input-row">
					<label>确认密码</label>
					<input v-model="confirmPassword" type="password" class="mui-input-clear mui-input" placeholder="请确认密码">
				</div>
                <div class="mui-input-row">
					<label>姓名</label>
					<input v-model="nickName" type="text" class="mui-input-clear mui-input" placeholder="请输入账号">
				</div>
                <div class="mui-input-row">
					<label>性别</label>
					<label id="sex-btn" style="padding-left:0px;">{{sex}}</label>
				</div>
                <div class="mui-input-row">
					<label>出生日期</label>
					<label id="birth-btn" style="padding-left:0px;">{{birth}}</label>
				</div>
                <div class="mui-input-row">
					<label>联系电话</label>
					<input v-model="phone" type="text" class="mui-input-clear mui-input" placeholder="请输入账号">
				</div>
				<div class="mui-input-row">
					<label>Email</label>
					<input v-model="email" type="email" class="mui-input-clear mui-input" placeholder="请输入邮箱">
				</div>
                <div class="mui-input-row">
					<label>联系地址</label>
					<input v-model="address" type="text" class="mui-input-clear mui-input" placeholder="请输入账号">
				</div>
                <div class="mui-input-row">
					<label>推荐人ID</label>
					<input v-model="referee" type="text" class="mui-input-clear mui-input" placeholder="请输入账号">
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
    import fetch from '../utils/fetch.js'

    export default {
        data(){
            return {
                userName: null,
                passWord: null,
                confirmPassword: null,
                phone: null,
                sex: '请选择',
                birth: '请选择',
                email: null,
                address: null,
                referee: null
            }
        },
        mounted() {
            document.getElementById('sex-btn').addEventListener('tap', function(event){
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

            document.getElementById('birth-btn').addEventListener('tap', function(event){
                if(event.target.picker){
                    event.target.picker.show(function(rs){
                        this.birth = rs.text;
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }else{
                    event.target.picker = new mui.DtPicker({
                        type: "date",
                        beginYear: 1930,
                        endYear: 2015
                    });
                    event.target.picker.show(function(rs){
                        this.birth = rs.text;
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }
            }.bind(this));

            document.getElementById('register-btn').addEventListener('tap', function(event){
                
                fetch.post(`/user/v1/user`, {
                    userName: this.userName,
                    passWord: this.passWord,
                    confirmPassword: this.confirmPassword,
                    phone: this.phone,
                    avatar: null,
                    sex: this.sex,
                    nickName: this.nickName,
                    birth: new Date(this.birth),
                    email: this.email,
                    address: this.address,
                    referee: this.referee
                }, function(data){
                    if(data.code == 100){
                        router.push(`/login`);
                    }else{

                    }
                }.bind(this));
            }.bind(this));
        }
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