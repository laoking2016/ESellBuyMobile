<<template>
    <div class="reg_main">
        <div class="reg_top">
            <img src="images/logo.png" alt="" class="logo" />
        </div>
        <div class="reg_form">
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
        methods: {
            ...mapActions({
                storeToken: 'user/storeToken'
            }),
            sexOnTap: function(event){
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
                if(this.phone == null || this.phone == ""){
                    mui.alert('请输入电话');
                    return;
                }

                if(this.sex == '请选择'){
                    mui.alert('请选择性别');
                    return;
                }

                if(this.birth == '请选择'){
                    mui.alert('请选择出生日期');
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
                        nav.go(`/`);
                    }
                }.bind(this));
            }
        },
        mounted() {

            if(window.auths == null){
                return null;
            }

            var s = window.auths[0];
            if(s.authResult){
                s.getUserInfo(function(e){
                    this.openId = s.userInfo.openid;
                    this.nickName = s.userInfo.nickname;
                    this.sex = s.userInfo.sex == 1 ? '男' : '女'
                    this.avatar = s.userInfo.headimgurl;
                }.bind(this));
            }
        }
    }
</script>