<<template>
    <div class="reg_main">
        <div class="reg_top">
            <img src="images/logo.png" alt="" class="logo" />
        </div>
        <div class="reg_form">
            <li class="nickname">
                <input type="text" v-model="nickName" class="ipt ipt_txt" placeholder="请输入您的昵称"/>
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
            <input type="button" value="保存" class="ipt ipt_button pink_gradient" v-on:tap="registerOnTap" />
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { formatDate } from '../utils/format.js';

    export default {
        data(){
            return {
                userName: null,
                phone: null,
                sex: '请选择性别',
                birth: '请选择生日',
                email: null,
                address: null,
                nickName: null
            }
        },
        computed: {
            ...mapGetters({
                userId: 'user/userId'
            })
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
                

                if(this.nickName == null || this.nickName == ""){
                    mui.alert('请输入昵称');
                    return;
                }

                if(this.sex == '请选择性别'){
                    mui.alert('请选择性别');
                    return;
                }

                console.log(this.birth);

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

                fetch.put(`/user/v2/user`, {
                    userId: this.userId,
                    userName: this.userName,
                    phone: this.phone,
                    sex: this.sex,
                    nickName: this.nickName,
                    birth: new Date(this.birth),
                    email: this.email,
                    address: this.address
                }, function(data){
                    if(data.code == 100){
                        nav.go(`/`);
                    }else if(data.code = -1005){
                        mui.alert('用户名已存在');
                    }
                }.bind(this));
            }
        },
        mounted() {
            fetch.get(`/user/v1/user/${this.userId}`, null, function(data){
                this.userName = data.data.userName;
                this.nickName = data.data.nickName;
                this.sex = data.data.sex;
                this.birth = formatDate(data.data.birth);
                this.phone = data.data.phone;
                this.email = data.data.email;
                this.address = data.data.address;
            }.bind(this));
        }
    }
</script>