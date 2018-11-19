<template>
    <aside id="offCanvasSide" class="mui-off-canvas-left" style="z-index:999;">
        <div class="mui-scroll-wrapper">
            <div class="mui-scroll">
                <div class="title"> </div>
                <ul class="mui-table-view mui-table-view-chevron mui-table-view-inverted">
                    <li id="login-menu" class="mui-table-view-cell menu-item">{{loginFlag ? '登出' : '登陆'}}</li>
                    <li id="home-menu" class="mui-table-view-cell menu-item">首页</li>
                    <li class="mui-table-view-cell menu-item">竞价说明</li>
                    <li v-show="role == 'buyer' || role == 'supplier'" id="customer-menu" class="mui-table-view-cell menu-item">买家商品管理</li>
                    <li v-show="role == 'supplier'" id="supplier-menu" class="mui-table-view-cell menu-item">卖家商品管理</li>
                    <li v-show="role == 'supplier'" id="auction-publish-menu" class="mui-table-view-cell menu-item">出品(上拍)</li>
                    <li v-show="false" id="shop-menu" class="mui-table-view-cell menu-item">出品(上架)</li>
                    <li class="mui-table-view-cell menu-item">系统设定</li>
                </ul>
            </div>
        </div>
    </aside>
</template>

<script>
    
    import router from '../router.js'
    import { mapGetters, mapActions } from 'vuex'
    
    export default {
        computed: {
            ...mapGetters('user', {
                token: 'token'
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
            }
        },
        methods:{
            ...mapActions({
                storeUserId: 'user/storeUserId',
                storeToken: 'user/storeToken'
            })
        },
        mounted() {
            $('#login-menu').on('tap', function(e){
                e.preventDefault();
                if(this.loginFlag){
                    for ( var i in window.auths ) {
                        var s = window.auths[i];
                        if ( s.authResult ) {
                            s.logout(function(e){
                                mui.toast('您已登出');
                            }.bind(this));
                        }
                    }
                    this.storeUserId(null);
                    this.storeToken(null);
                    router.push('/login');
                }else{
                    this.storeUserId(null);
                    this.storeToken(null);
                    router.push('/login');
                }
                
                mui('#offCanvasSide').offCanvas('close');
            }.bind(this));

            document.getElementById('home-menu').addEventListener('tap', function(e){
                e.preventDefault();
				router.push('/');
				mui('#offCanvasSide').offCanvas('close');
			});

            document.getElementById('customer-menu').addEventListener('tap', function(e){
                e.preventDefault();
                router.push('/customer/orders');
                mui('#offCanvasSide').offCanvas('close');
            });

            document.getElementById('supplier-menu').addEventListener('tap', function(e){
                e.preventDefault();
                router.push('/supplier/orders');
                mui('#offCanvasSide').offCanvas('close');
            });

            document.getElementById('auction-publish-menu').addEventListener('tap', function(e){
                e.preventDefault();
                router.push('/auction/publish');
                mui('#offCanvasSide').offCanvas('close');
            });

            document.getElementById('shop-menu').addEventListener('tap', function(e){
                e.preventDefault();
                router.push('/shop');
                mui('#offCanvasSide').offCanvas('close');
            });
        },
        name: 'main-menu'
    }
</script>

<style scoped>

</style>