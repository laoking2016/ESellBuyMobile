<template>
    <div>
        <div id="slider" class="mui-slider">
            <div class="mui-slider-group">
                <div v-bind:key="image" class="mui-slider-item" v-for="image in images">
                    <a href="#" style="background-color:black;">
                        <div class="detail-img" style="text-align:center">
                            <img v-bind:src="formatImage(image.icon == null ? image.image : image.icon)" data-preview-src="" data-preview-group="1" style="width:auto;height:100%;">
                        </div>
                    </a>
                </div>
            </div>
            <div class="mui-slider-indicator">
                <div v-bind:key="image" class="mui-indicator" v-bind:class="{'mui-active': index==0}" v-for="(image, index) in images"></div>
            </div>
        </div>
        <div style="display:flex;flex-direction:row;justify-content:space-between;padding:.3rem;">
            <div>
                <h1 style='font-size:large;width:4.3rem;'>{{title}}</h1>
                <div style="display:flex;flex-direction:row;justify-content:space-between;padding-top:.3rem;padding-right:.2rem;">
                    <p class="font" style='color:red;'><span >&yen;</span>&nbsp;<span style="font-size:x-large;font-weight:bold;">{{renderPrice}}</span>元</p>
                    <p style="color:red;">{{type == '拍卖' ? '竞拍中' : '在售中'}}</p>
                </div>
                <div v-show="type == '拍卖'" style="margin-top:.3rem;font-size:.24rem;">结标：{{formatDate2(new Date(deadline))}}</div>
                <div v-show="type == '精品商城'" style='margin-top:.3rem;font-size:.24rem;'>剩余数量：<span style='font-color:red'>{{stockCount-orderCount}}</span></div>
            </div> 
            <div style="width:2.5rem;"><img src="images/android.png" style="width:100%"></div>
        </div>
        <div style="display:flex;flex-direction:row;justify-content:center;padding:.3rem;">
            <a href="#" v-on:tap="onDownload" class="gooddet_pricebox_button pink_gradient fl" style="justify-content:center;width:3rem;">立即下载</a>
        </div>
    </div>
</template>

<script>
    import mainMenu from '../components/MainMenu.vue'
    import imageViewer from '../components/ImageViewer.vue'
    import { mapGetters } from 'vuex'
    import fetch from '../utils/fetch.js'
    import nav from '../utils/nav.js'
    import { formatImage, formatDateDiff, formatDate2, formatImageBackground, formatIconBackground } from '../utils/format.js'

    export default {
        components: {
            mainMenu,
            imageViewer
        },
        data(){
            return {
                id: null,
                images: [],
                title: null,
                description: null,
                basePrice: null,
                price: null,
                priceInput: null,
                questions: [],
                questionInput: null,
                ownerFlag: false,
                status: null,
                slider: null,
                deadline: null,
                orderCount: null,
                supplier: null,
                buyerName: null,
                orders: [],
                postage: null,
                favoriteFlag: false,
                supplierName: null,
                supplierImage: null,
                payment: [],
                type: null,
                stockCount: null,
                visibleView: 'MAIN_VIEW'
            }
        },
        methods: {
            onDownload: function(){
                window.location.href = 'http://101.201.233.31/packs/android_debug.apk';
            },
            showImageView: function(){
                this.visibleView = 'IMAGE_VIEW';
            },
            showMainView: function(){
                this.visibleView = 'MAIN_VIEW';
            },
            questionOnTap: function(){
                nav.go(`/question/${this.id}/${this.title}`);
            },
            favoriteOnTap: function(goodId){
                fetch.post(`/user/v2/good/${goodId}/favorite`, null, function(data){
                    this.favoriteFlag = data.data;    
                }.bind(this));
            },
            onSupplierGoods: function(){
                nav.go(`/supplier/goods/${this.supplier}`);
            },
            formatImage: formatImage,
            formatDate2: formatDate2,
            formatImageBackground: formatImageBackground,
            formatIconBackground: formatIconBackground,
            loadFavorite: function(goodId){
                fetch.get(`/user/v2/good/${goodId}/favorite`, null, function(data){
                    this.favoriteFlag = data.data;
                }.bind(this));
            },
            loadGood: function(goodId){
                fetch.get(`/user/v2/good/${goodId}`, null, function(data){
                    var price = data.data.nextBid;

                    this.id = data.data.goodId;
                    this.images = JSON.parse(data.data.images);
                    this.title = data.data.goodName;
                    this.description = data.data.description;
                    this.type = data.data.type;
                    this.status = data.data.status;
                    this.deadline = data.data.deadline;
                    this.orderCount = data.data.orders.length;
                    this.supplier = data.data.supplier;
                    this.orders = data.data.orders;
                    this.postage = data.data.postage;
                    if(data.data.order != null){
                        this.buyerName = data.data.order.buyerName;
                        this.ownerFlag = data.data.order.ownerFlag;
                    }    

                    this.price = price;
                    this.priceInput = price;
                    this.basePrice = price;

                    if(data.data.order != null && this.ownerFlag){
                        this.priceInput = data.data.order.buyPrice;
                        this.basePrice = data.data.order.buyPrice;
                    }
                    this.stockCount = data.data.stockCount;

                    if(data.data.payment != null){
                        this.payment = JSON.parse(data.data.payment);
                    }

                    this.loadSupplier(data.data.supplier);

                }.bind(this));
            },
            loadSupplier: function(userId){
                fetch.get(`/user/v1/user/${userId}`, null, function(data){
                    this.supplierName = data.data.nickName;
                    this.supplierImage = data.data.avatar;
                }.bind(this));
            },
            orderCountOnTap: function(id){
                nav.go(`/auction/list/${id}`);
            },
            priceOnInc: function(){
                var inc = this.getInc(this.priceInput);
                this.priceInput += inc;
            },
            getInc: function(price){
                var inc = 0;
                if(price < 100){
                    inc = 5;
                }else if(price >= 100 && price < 1000){
                    inc = 10;
                }else{
                    inc = 20;
                }
                return inc;
            },
            priceOnDec: function(){
                var inc = this.getInc(this.priceInput);
                this.priceInput -= inc;
            },
            submitOnTap: function(){
                if(this.priceInput <= this.basePrice){
                    mui.alert('必须高于目前出价');
                    return;
                }

                fetch.post(`/user/v2/good/${this.id}/order?type=拍卖`, {
                    goodId: this.id,
                    buyPrice: this.priceInput,
                    goodName: this.title,
                    goodImages: JSON.stringify(this.images)
                }, function(data){
                    mui.toast('竞价完成');
                    this.loadGood(this.id);
                }.bind(this), function(data){
                    mui.alert(data.message);
                    this.loadGood(this.id);
                }.bind(this));
            }
        },
        updated(){
            mui('#slider').slider({interval: 0});
            mui.previewImage();
        },
        computed: {
             ...mapGetters({
                 token: 'user/token',
                 userId: 'user/userId'
             }),
             role: function(){
                 if(this.token == null){
                    return null;
                }

                var arr = this.token.split('_');

                if(arr.length == 3){
                    return arr[2];
                }

                return null;
            },
			renderPrice: function(){
				return Math.round(this.price * 1.03);				
			},
            renderPriceInput: function(){
                return Math.round(this.priceInput * 1.03);
            },
            remainTitle: function(){
                return formatDateDiff(new Date(), new Date(this.deadline));
            },
            submitEnabledFlag: function(){
                var now = new Date();
                
                var deadline = new Date(this.deadline);
                return this.supplier != this.userId && deadline > now;
            },
            buyerFlag: function(){
                var orders = this.orders.filter(e => e.buyer == this.userId);
                return orders.length != 0;
            },
            filterredPayment: function(){
                return this.payment.filter(e => e.checked == true);
            }
		},
        mounted() {

            var goodId = this.$route.params.goodId;
            this.loadGood(goodId)
            this.loadFavorite(goodId);
        }
    }
</script>