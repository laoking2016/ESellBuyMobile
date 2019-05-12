<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    import nav from './utils/nav.js'
    import { mapGetters, mapActions } from 'vuex'
    export default {
        computed: {
            ...mapGetters({
                token: 'user/token'
            }),
            loginFlag: function(){
                return this.token != null;
            }
        },
        methods: {
            ...mapActions({
                storeUserId: 'user/storeUserId',
                storeToken: 'user/storeToken'
            }),
            onHome: function(){
                nav.go('/');
            },
            onLogin: function(){
                if(this.loginFlag){
                    nav.go('/my');
                }else{
                    this.storeUserId(null);
                    this.storeToken(null);
                    nav.go('/login');
                }
            }
        },
        mounted(){
        }
    }
</script>

<style scoped>
    @import "./assets/master.css";
</style>



