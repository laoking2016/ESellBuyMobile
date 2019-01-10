<template>

    <div>
         <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="###" id="close-btn" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
			<h1 class="mui-title">卖家商品管理(按客户显示)</h1>
        </header>
        <div class="mui-content">
            <ul class="mui-table-view mui-table-view-chevron">
                <li class="mui-table-view-cell mui-media" v-on:tap="onCustomerTap(-1, null)">
                    <a class="mui-navigate-right">
                        <span class="mui-media-object mui-pull-left">全部</span>
                    </a>
                </li>
                <li v-bind:key="customer.id" class="mui-table-view-cell mui-media" v-on:tap="onCustomerTap(customer.id, customer.name)" v-for="customer in customers">
                    <a class="mui-navigate-right">
                        <span class="mui-media-object mui-pull-left">{{customer.name}}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    
    import fetch from '../utils/fetch.js'

    export default {
        props: ['ok', 'cancel'],
        data(){
            return {
                customers: []
            }
        },
        methods: {
            onCustomerTap: function(id, name){
                this.$props.ok(id, name);
            }
        },
        mounted() {

            fetch.get(`/user/v2/users/supplier`, null, function(data){
                this.customers = data.data.map(function(item, index){
                    return {
                        name: item.nickName,
                        id: item.userId
                    };
                }.bind(this));
            }.bind(this));

            $("#close-btn").on('tap', function(e){
                this.$props.cancel()
            }.bind(this));
        },
        name: 'customer'
    }
</script>

<style scoped>
    @import "../assets/customer.css";
</style>