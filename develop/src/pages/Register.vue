<<template>
    <div class="reg_main">
        <div class="reg_top">
            <img src="images/logo.png" alt="" class="logo" />
        </div>
        <div class="reg_form">
            <li class="username">
                <input type="text" v-model="userName" class="ipt ipt_txt" placeholder="请输入您的账号"/>
            </li>
            <li class="password">
                <input type="text" v-model="passWord" class="ipt ipt_txt" placeholder="请输入您的密码"/>
            </li>
            <li class="password">
                <input type="text" v-model="confirmPassword" class="ipt ipt_txt" placeholder="请确认您的密码"/>
            </li>
            <li class="nickname">
                <input type="text" class="ipt ipt_txt" placeholder="请输入您的昵称"/>
            </li>
            <li class="sex" v-on:tap="sexOnTap">
                <input type="text" readonly v-bind:value="sex" class="ipt ipt_txt"/>
            </li>
            <li class="birth" v-on:tap="birthOnTap">
                <input type="text" readonly v-bind:value="birth" class="ipt ipt_txt"/>
            </li>
            <li class="tel">
                <input type="text" v-model="phone" class="ipt ipt_txt" placeholder="请输入您的电话"/>
            </li>
            <li class="email">
                <input type="text" v-model="email" class="ipt ipt_txt" placeholder="请输入您的Email"/>
            </li>
            <li class="address">
                <input type="text" v-model="address" class="ipt ipt_txt" placeholder="请输入联系地址"/>
            </li>
            <input type="button" value="注册" class="ipt ipt_button pink_gradient" v-on:tap="registerOnTap" />
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'   
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'

    export default {
        data(){
            return {
                userName: null,
                passWord: null,
                confirmPassword: null,
                phone: null,
                sex: '请选择性别',
                birth: '请选择生日',
                email: null,
                address: null
            }
        },
        methods: {
            ...mapActions({
                storeToken: 'user/storeToken'
            }),
            sexOnTap: function(event){
                console.log(event);
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
            },
            birthOnTap: function(event){
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
            },
            registerOnTap: function(){
                
                if(this.userName == null || this.userName == ""){
                    mui.alert('请输入用户名');
                    return;
                }

                if(this.passWord == null || this.passWord == ""){
                    mui.alert('请输入密码');
                    return;
                }

                if(this.confirmPassword == null || this.confirmPassword == ""){
                    mui.alert('请输入确认密码');
                    return;
                }

                if(this.passWord != this.confirmPassword){
                    mui.alert('密码和确认密码必须相同');
                    return;
                }

                if(this.nickName == null || this.nickName == ""){
                    mui.alert('请输入昵称');
                    return;
                }

                if(this.sex == '请选择性别'){
                    mui.alert('请选择性别');
                    return;
                }

                if(this.birth == '请选择'){
                    mui.alert('请选择出生日期');
                    return;
                }
                
                if(this.phone == null || this.phone == ""){
                    mui.alert('请输入电话');
                    return;
                }

                if(this.email == null || this.email == ""){
                    mui.alert('请输入Email');
                    return;
                }

                if(this.address == null || this.address == ""){
                    mui.alert('请输入联系地址');
                    return;
                }

                fetch.post(`/user/v2/user`, {
                    userName: this.userName,
                    passWord: this.passWord,
                    confirmPassword: this.confirmPassword,
                    phone: this.phone,
                    sex: this.sex,
                    nickName: this.nickName,
                    birth: new Date(this.birth),
                    email: this.email,
                    address: this.address
                }, function(data){
                    if(data.code == 100){
                        this.storeToken(`${data.data.userId}_${data.data.token}_${data.data.role}`);
                        nav.go(`/`);
                    }else if(data.code = -1005){
                        mui.alert('用户名已存在');
                    }
                }.bind(this));
            }
        },
        mounted() {
        }
    }
</script>