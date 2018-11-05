<template>
    <div>
         <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
        </header>
        <div class="mui-content">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell category-item" v-bind:data-id="category.id" v-for="category in categories">
                    <span class="mui-navigate-right" v-bind:data-id="category.id">{{category.title}}</span>
                </li>
            </ul>
            
        </div>
    </div>
</template>

<script>
    
    import fetch from '../utils/fetch.js'
    import router from '../router.js'

    export default {
        data(){
            return {
                categories: []
            }
        },
        mounted() {

            var flag = this.$route.params.flag;

            fetch.get(`/user/v1/category/first`, null, function(data){
                this.categories = data.data.map(function(item, index){
                    return {
                        title: item.categoryName,
                        id: item.categoryFirstId
                    };
                });
            }.bind(this));

            mui(".mui-table-view").on('tap', '.category-item', function(event){
                var id = $(event.target).data('id');
                router.push(`/category/second/${flag}/${id}`);
            }.bind(this));
        }
    }
</script>

<style scoped>
    @import "../assets/category.css";
</style>