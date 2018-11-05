<template>
    <div>
         <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
        </header>
        <div class="mui-content">
            <ul class="mui-table-view">
                <li class="mui-table-view-cell category-item" 
                    v-bind:data-id="category.id" 
                    v-bind:data-title="category.title" 
                    v-for="category in categories">
                    <span class="mui-navigate-right" 
                        v-bind:data-id="category.id" 
                        v-bind:data-title="category.title">{{category.title}}</span>
                </li>
            </ul>
            
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import { SEARCH_FLAG, RETENTION_FLAG } from '../utils/const.js'
    import router from '../router.js'
    import fetch from '../utils/fetch.js'

    export default {
        data(){
            return {
                categories: []
            }
        },
        methods: mapActions({
            setSearchCategory: 'search/setCategory',
            setRetentionCategory: 'retention/setCategory'
        }),
        mounted() {

            const _this = this;

            var flag = this.$route.params.flag;
            var id = this.$route.params.id;
            
            fetch.get(`/user/v1/category/first/child/${id}`, null, function(data){
                if(data.data.length == 0){
                    this.categories = [];
                }else{
                    this.categories = data.data.map(function(item, index){
                        return {
                            title: item.categoryName,
                            id: item.categorySecondId
                        };
                    });
                }
                
            }.bind(this));

            mui(".mui-table-view").on('tap', '.category-item', function(event){
                var id = $(event.target).data('id');
                var title = $(event.target).data('title');

                var category = {
                    id: id,
                    title: title
                };

                switch(flag){
                    case SEARCH_FLAG:
                        this.setSearchCategory(category);
                        break;
                    case RETENTION_FLAG:
                        this.setRetentionCategory(category);
                        break;
                }

                switch(flag){
                    case SEARCH_FLAG:
                        router.push(`/search`);
                        break;
                    case RETENTION_FLAG:
                        router.push(`/retention`);
                        break;
                }
            }.bind(this));
        }
    }
</script>

<style scoped>
    @import "../assets/category.css";
</style>