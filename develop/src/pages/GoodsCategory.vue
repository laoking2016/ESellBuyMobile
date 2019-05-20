<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />
        <category v-bind:search="handleCategoryCallback" />
        
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import mainMenu from '../components/MainMenu.vue'
    import category from '../components/Category.vue'

    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { formatImage, formatFeaturedImage, formatImageBackground, formatIconBackground, formatDateDiff } from '../utils/format.js'

    export default {
        components: {
            mainMenu,
            category
        },
        data(){
            return {
                title: '选择类别'
            }
        },
        methods: {
            ...mapActions({
                storeFirst: 'goods/storeFirst',
                storeSecond: 'goods/storeSecond',
                storeTitle: 'goods/storeTitle',
                cleanGoods: 'goods/cleanGoods',
                storePage: 'goods/storePage',
                storeScrollTop: 'goods/storeScrollTop'
            }),
            handleCategoryCallback: function(id, title, firstId){
                this.storeFirst(firstId);
                this.storeSecond(id);
                this.storeTitle(title);
                this.storeScrollTop(0);
                nav.go(`/goods`);
            }
        },
        mounted(){
            this.storePage(1);
            this.cleanGoods();
        }
    }
</script>