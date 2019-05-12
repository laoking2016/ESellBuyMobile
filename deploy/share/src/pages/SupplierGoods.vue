<template>
	<div>
		<main-menu top-button-type="BACK" v-bind:header-text="`${supplierName}的拍品`" />
		<div class="pm_main">
			<div class="tabwrap">
				<div class="module">
					<ul class="pm_list">
						<li v-bind:key="good.id" v-for="good in goods" v-on:tap="goodOnTap(good.id, good.type)" class="item clearfix">
							<div v-bind:style="formatIconBackground(good.image)" class="img fl"/>
							<div class="info fr">
								<a href="#" class="title">{{good.title}}</a>
								<div class="bot clearfix">
									<span style="color: red; font-size: .3rem;">&yen; {{good.quote}}</span> 
									<a href="#" class="pink_gradient button fr">{{good.type}}</a>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	import fetch from '../utils/fetch.js'
	import mainMenu from '../components/MainMenu.vue'
    import nav from '../utils/nav.js'
	import { formatFeaturedImage, formatImage, formatImageBackground, formatIconBackground } from '../utils/format.js'

    export default {
		components: {
			mainMenu
		},
		methods: {
			formatImage: formatImage,
			formatImageBackground: formatImageBackground,
			formatIconBackground: formatIconBackground,
			goodOnTap: function(id, type){
				if(type == '精品商城'){
					nav.go(`/shop/detail/${id}`);
				}else{
					nav.go(`/auction/detail/${id}`);
				}
			},
			loadSupplier: function(userId){
                fetch.get(`/user/v1/user/${userId}`, null, function(data){
                    this.supplierName = data.data.nickName;
                    this.supplierImage = data.data.avatar;
                }.bind(this));
            }
		},
        data(){
            return {
				id: null,
                supplierName: null,
				goods: []
            }
        },
        mounted() {
			this.id = this.$route.params.id;
			this.loadSupplier(this.id);

			fetch.get(`/user/v2/supplier/goods/${this.id}`, null, function(data){
				this.goods = data.data.map(function(item, index){
					var image = formatFeaturedImage(item.images);
					return {
						id: item.goodId,
                        title: item.goodName,
                        image: image,
						type: item.type,
                        quote: Math.round(item.finalPrice * 1.03)
					};
				}.bind(this));
			}.bind(this));
        },
		updated(){
			mui("#scroll-favorite-goods").scroll();
		}
    }
</script>
