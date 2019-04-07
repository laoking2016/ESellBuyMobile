<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="商品列表" />
        <div v-show="showIndex == 0">

        </div>
        <div v-show="showIndex == 1">
            <category v-bind:search="handleCategoryCallback" />
        </div>
    </div>
</template>

<script>
    import mainMenu from '../components/MainMenu.vue'
    import category from '../components/Category.vue'

    export default {
        components: {
            mainMenu,
            category
        },
        data(){
            return {
                showIndex: 1
            }
        },
        method: {
            handleCategoryCallback: function(){

            }
        }
    }
</script>