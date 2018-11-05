<template>
    <div>
         <!-- 主页面标题 -->
        <header class="mui-bar mui-bar-nav">
            <a href="###" id="close-btn" class="mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
        </header>
        <div class="mui-content">
            <ul class="mui-table-view" v-show="categoriesShown" style="margin-top:0px;">
                <li class="mui-table-view-cell category-item" v-bind:data-id="category.id" v-for="category in categories">
                    <span class="mui-navigate-right" v-bind:data-id="category.id">{{category.title}}</span>
                </li>
            </ul>
            <ul class="mui-table-view" v-show="categories2Shown">
                <li class="mui-table-view-cell category2-item" 
                    v-bind:data-id="category.id" 
                    v-bind:data-title="category.title" 
                    v-for="category in categories2">
                    <span class="mui-navigate-right" 
                        v-bind:data-id="category.id" 
                        v-bind:data-title="category.title">{{category.title}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    
    import fetch from '../utils/fetch.js'
    import router from '../router.js'

    export default {
        props: ['search', 'close'],
        data(){
            return {
                categories: [],
                categories2: [],
                categoriesShown: true,
                categories2Shown: false
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

            document.getElementById('close-btn').addEventListener('tap', function(event){
                this.$props.close();
			}.bind(this));

            mui(".mui-table-view").on('tap', '.category2-item', function(event){
                var id = $(event.target).data('id');
                var title = $(event.target).data('title');
                this.$props.search(id, title);
                this.categoriesShown = true;
                this.categories2Shown = false;
            }.bind(this));

            mui(".mui-table-view").on('tap', '.category-item', function(event){
                var id = $(event.target).data('id');
                fetch.get(`/user/v1/category/first/child/${id}`, null, function(data){
                    if(data.data.length == 0){
                        this.categories = [];
                    }else{
                        this.categories2 = data.data.map(function(item, index){
                            return {
                                title: item.categoryName,
                                id: item.categorySecondId
                            };
                        });
                    }
                    this.categoriesShown = false;
                    this.categories2Shown = true;
                    
                }.bind(this));
            }.bind(this));
        },
        name: 'category'
    }
</script>

<style scoped>
    @import "../assets/category.css";
</style>