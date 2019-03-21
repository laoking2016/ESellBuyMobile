<template>
    <div class="head clearfix">
        <header style="height:1rem;border-bottom:1px solid #f1f6f9" class="mui-bar mui-bar-nav">
            <a class="mui-pull-left" style="margin-top:.1rem;">
                <a href="#" class="hd_back fl" v-show="topButtonType == 'BACK'" v-on:tap="backOnTap"></a>
            </a>
            <h1 v-show="headerText == null" class="mui-title hd_search" style="margin-top:.1rem;left:0.2rem;right:0.2rem;">
                <span type="text" style="text-align:left;" class="ipt ipt_txt" v-show="readonly == 'true'" v-on:tap="toSearchOnTap">搜索</span>
                <input type="text" v-model="keyword" v-show="readonly == 'false' && headerText != ''" class="ipt ipt_txt"  v-on:keypress="searchOnTap"/>
            </h1>
            <h1 style="z-index:-1;" v-show="headerText != null" class="mui-title title">{{headerText}}</h1>
            <a class="mui-pull-right" style="margin-top:.1rem;" v-show="false">
                <a class="gooddet_pricebox_button pink_gradient fl" style="width:1.5rem;" v-on:tap="historyOnTap">历史成交</a>
            </a>
        </header>
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
            backOnTap: function(){
                nav.go(-1);
            },
            historyOnTap: function(){
                nav.go(`/history`);
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