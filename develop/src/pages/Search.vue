<template>
    <div>
        <div v-bind:style="{display: searchShown}">
            <!-- 主页面标题 -->
            <header class="mui-bar mui-bar-nav">
                <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left"></a>
                <div class="mui-search" style="float:right;width:90%;">
                    <input id="search-input" type="search" v-model="keyword" class="mui-input-clear" placeholder="请输入要搜索的关键字">
                </div>
            </header>
            <div class="mui-content">
                <form class="mui-input-group">
                    <div class="mui-input-group">
                        <div style="height:40px;width:100%;background-color:rgba(0,0,0,.1);"></div>
                        <div class="mui-input-row">
                            <label id="category-btn">按类别搜索</label>
                            <a class="mui-navigate-right"></a>
                        </div>
                        <div style="height:40px;width:100%;background-color:rgba(0,0,0,.1);line-height:40px;padding-left:11px;">过去保存的检索条件</div>
                    </div>
                </form>
            </div>
        </div>
        <div v-bind:style="{display: categoryShown}">
            <category v-bind:search="processCategorySearch" v-bind:close="processCategoryClose" />
        </div>
    </div>
</template>

<script>
    import category from '../components/Category.vue'
    import { mapGetters, mapActions } from 'vuex'
    import router from '../router.js'
    import { SEARCH_KBN_KEYWORD, SEARCH_KBN_CATEGORY } from '../utils/const.js'
    import fetch from '../utils/fetch.js'

    export default {
        components: {
            category
        },
        data(){
            return {
                categoryShown: 'none',
                searchShown: null,
                keyword: null
            }
        },
        computed: {
            ...mapGetters('search', {
                category: 'category'
            })
        },
        methods: {
            ...mapActions({
                setKeyword: 'search/setKeyword',
                setCategory: 'search/setCategory',
                setKbn: 'search/setKbn'
            }),
            processCategorySearch: function(id, title){
                this.setKbn(SEARCH_KBN_CATEGORY);
                this.setCategory(id);
                router.push(`/search/result`);
                this.categoryShown = 'none';
                this.searchShown = null;
            },
            processCategoryClose: function(){
                this.categoryShown = 'none';
                this.searchShown = null;
            }
        },
        mounted() {
            
            document.getElementById('category-btn').addEventListener('tap', function(event){
                this.categoryShown = null;
                this.searchShown = 'none';
                this.$forceUpdate();
			}.bind(this));

            document.getElementById('search-input').addEventListener('keyup', function(event){
                if(event.keyCode == 13){
                    this.setKeyword(this.keyword);
                    this.setKbn(SEARCH_KBN_KEYWORD);
                    router.push('/search/result');
                }
            }.bind(this));

            mui(".mui-row").on('tap', '.product-item', function(event){
                router.push('/auction');
            }.bind(this));
        }
    }
</script>