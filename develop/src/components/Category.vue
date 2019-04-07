<template>
    <div class="cata_main">
        <div class="cata_menu tabmenu">
            <li class="lk" v-bind:class="{ cur: id == -1}" v-on:tap="firstOnTap(-1, '全部')">全部</li>
            <li v-bind:class="{ cur: id == first.id }" class="lk" v-bind:key="first.id" v-for="first in firsts" v-on:tap="firstOnTap(first.id, first.title)">{{first.title}}</li>
        </div>
        <div class="cata_conta tabwrap">
            <div class="module">
                <div style="line-height:40px;margin-left:.5rem;" v-on:tap="secondOnTap(-1, title, id)">{{title}} ></div>
                <ul class="cata_list clearfix" style="marign-top:.2rem">
                    <li class="item" v-bind:key="second.id" v-for="second in seconds" v-on:tap="secondOnTap(second.id, second.title, second.firstId)">
                        <a href="#">
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
                title: null,
                firsts: [],
                seconds: []
            }
        },
        methods: {
            formatCategoryImage: formatCategoryImage,
            firstOnTap: function(id, title){
                this.id = id;
                this.title = title;
                this.fetchSeconds(id);
            },
            secondOnTap: function(id, title, firstId){
                this.$props.search(id, title, firstId);
            },
            fetchSeconds: function(id){
                fetch.get(`/user/v1/category/first/child/${id}`, null, function(data){
                    this.seconds = data.data.map(function(item, index){
                        return {
                            firstId: id,
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
                    this.title = this.firsts[0].title;
                    this.fetchSeconds(this.firsts[0].id);
                }
            }.bind(this));
        },
        name: 'category'
    }
</script>
