<template>
    <div class="cata_main">
        <div class="cata_menu tabmenu">
            <li v-bind:class="{ cur: id == first.id }" class="lk" v-bind:key="first.id" v-for="first in firsts" v-on:tap="firstOnTap(first.id)">{{first.title}}</li>
        </div>
        <div class="cata_conta tabwrap">
            <div class="module">
                <div class="cata_pic">
                    <img src="images/cata_01.jpg" alt="" class="img"/>
                </div>
                <ul class="cata_list clearfix">
                    <li class="item" v-bind:key="second.id" v-for="second in seconds" v-on:tap="secondOnTap(second.id, second.title)">
                        <a href="#">
                            <img v-bind:src="formatCategoryImage(second.image)" alt="" class="img"/>
                            <h6 class="title">{{second.title}}</h6>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    
    import fetch from '../utils/fetch.js'
    import router from '../router.js'
    import { formatCategoryImage } from '../utils/format.js'

    export default {
        props: ['search'],
        data(){
            return {
                id: null,
                firsts: [],
                seconds: []
            }
        },
        methods: {
            formatCategoryImage: formatCategoryImage,
            firstOnTap: function(id){
                this.id = id;
                this.fetchSeconds(id);
            },
            secondOnTap: function(id, title){
                this.$props.search(id, title);
            },
            fetchSeconds: function(id){
                fetch.get(`/user/v1/category/first/child/${id}`, null, function(data){
                    this.seconds = data.data.map(function(item, index){
                        return {
                            title: item.categoryName,
                            id: item.categorySecondId,
                            image: item.image
                        }
                    });
                }.bind(this));
            }
        },
        mounted() {
            fetch.get(`/user/v1/category/first`, null, function(data){
                this.firsts = data.data.map(function(item, index){
                    return {
                        title: item.categoryName,
                        id: item.categoryFirstId
                    }
                });
                if(this.firsts.length > 0){
                    this.id = this.firsts[0].id;
                    this.fetchSeconds(this.firsts[0].id);
                }
            }.bind(this));
        },
        name: 'category'
    }
</script>
