<template>
    <div class="head clearfix">
        <a href="#" class="hd_more fl" v-on:tap="openMenu" v-show="topButtonType == 'MENU'"></a>
        <div class="hd_menu" v-bind:class="{ active: menuOpenFlag == true }" >
            <div class="pop_bg" v-bind:style="{ display: displayStyle }" v-on:tap="closeMenu"></div>
            <div class="menulist">
                <li class="login" v-on:tap="loginOnTap">{{loginFlag ? '登出' : '登陆'}}</li>
                <li class="index" v-on:tap="homeOnTap">首页</li>
                <li class="explan" v-on:tap="instructionOnTap">竞价说明</li>
                <li v-show="role == 'buyer' || role == 'supplier'" class="buyer" v-on:tap="customerOnTap">买家商品管理</li>
                <li v-show="role == 'supplier'" class="seller" v-on:tap="supplierOnTap">卖家商品管理</li>
                <li v-show="role == 'supplier'" class="auction" v-on:tap="auctionPublishOnTap">拍卖出品</li>
                <li v-show="role == 'supplier'" class="shop" v-on:tap="shopPublishOnTap">商城上架</li>
                <li v-show="role == 'buyer' || role == 'supplier'" class="focus" v-on:tap="favoriteOnTap">关注的商品</li>
                <li v-show='false' class="explan">系统设定</li>
            </div>
        </div>
        <div class="hd_search fr" v-show="headerText == null">
            <span type="text" class="ipt ipt_txt" v-show="readonly == 'true'" v-on:tap="toSearchOnTap">搜索</span>
            <input type="text" v-model="keyword" v-show="readonly == 'false' || readonly == null" class="ipt ipt_txt"  v-on:keypress="searchOnTap"/>
        </div>
        <span class="title" style='z-index:-1' v-show="headerText != null">{{headerText}}</span>
        <a href="#" class="hd_back fl" v-show="topButtonType == 'BACK'" v-on:tap="backOnTap"></a>
    </div>
</template>

<script>
    
    import nav from '../utils/nav.js'
    import TopButtonType from '../utils/enum.js'
    import { mapGetters, mapActions } from 'vuex'
    
    export default {
        name: 'main-menu',
        props: ['topButtonType', 'headerText', 'search', 'readonly'],
        data(){
            return {
               menuOpenFlag: false,
               displayStyle: 'none'
            }
        },
        computed: {
            ...mapGetters({
                token: 'user/token'
            }),
            role: function(){

                if(this.token == null){
                    return null;
                }

                var arr = this.token.split('_');

                if(arr.length == 3){
                    return arr[2];
                }

                return null;
            },
            loginFlag: function(){
                return this.token != null;
            },
            keyword: {
                get(){
                    return this.$store.state.search.keyword;
                },
                set(value){
                    this.$store.commit('search/setKeyword', value);
                }
            }
        },
        methods:{
            ...mapActions({
                storeUserId: 'user/storeUserId',
                storeToken: 'user/storeToken'
            }),
            openMenu: function(){
                
                this.menuOpenFlag = true;
                this.displayStyle = 'block';
            },
            closeMenu: function(){
                this.menuOpenFlag = false;
                this.displayStyle = 'none';
            },
            toSearchOnTap: function(){
                nav.go('/search');
            },
            searchOnTap: function(event){
                if(event.keyCode != 13){
                    return;
                }
                if(this.$props.search != null){
                    this.$props.search(this.keyword);
                }
            },
            loginOnTap: function(){
                 
                if(this.loginFlag){
                    for ( var i in window.auths ) {
                        var s = window.auths[i];
                        if ( s.authResult ) {
                            s.logout(function(e){
                                mui.alert('您已登出');
                            }.bind(this));
                        }
                    }
                    this.storeUserId(null);
                    this.storeToken(null);
                    nav.go('/login');
                }else{
                    this.storeUserId(null);
                    this.storeToken(null);
                    nav.go('/login');
                }
            },
            favoriteOnTap: function(){
                this.closeMenu();
                nav.go('/favorited/goods');
            },
            homeOnTap: function(){
                this.closeMenu();
				nav.go('/');
            },
            customerOnTap: function(){
                this.closeMenu();
                nav.go('/customer/orders');
            },
            supplierOnTap: function(){
                this.closeMenu();
                nav.go('/supplier/orders');
            },
            auctionPublishOnTap: function(){
                this.closeMenu();
                nav.go('/auction/publish');
            },
            shopPublishOnTap: function(){
                this.closeMenu();
                nav.go('/shop/publish');
            },
            instructionOnTap: function(){
                this.closeMenu();
                nav.go('/instruction');
            },
            backOnTap: function(){
                nav.go(-1);
            }
        },
        mounted() {
            if(this.$props.search != null){
                this.$props.search(this.keyword);
            }
        },
        updated(){
            
        }
        
    }
</script>

<style scoped>

</style>