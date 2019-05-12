<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />
        <div  v-show="visibleView == 'MAIN_VIEW'" style="margin-top:1rem;">
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
            <div class="mui-content">
                <div class='mui-row' style="padding:10px;">
                    <div class="mui-col-sm-12 mui-col-xs-12">
                        <h1 style='font-size:large;'>{{title}}</h1>
                        <div style='font-size:.24rem;color:#999999'>{{description}}</div>
                    </div>
                </div>

                <div class='mui-row' style='border-top:1px solid #f1f6f9;padding:10px;'>
                    <div class='mui-col-sm-7 mui-col-xs-7'>
                        <p class="font" style='font-weight:bold;'><span style='color:red;font-weight:bold;'>&yen;</span>&nbsp;<span style="font-size:x-large;font-weight:bold;">{{renderPrice}}&nbsp;</span>元</p>
                        <p style='font-size:.24rem;color:#999999'>(含3%手续费不含邮费, 邮费{{postage}}元)</p>
                    </div>
                    <div class="mui-col-sm-5  mui-col-xs-5" style='text-align:right;'>
                        <span class='mui-icon mui-icon-help' style='font-size:.5rem;margin-right:10px;' v-on:tap="questionOnTap"></span>
                        <span class='mui-icon-extra mui-icon-extra-comment' style='font-size:.41rem;margin-right:10px;'></span>
                        <span class='mui-icon-extra mui-icon-extra-share' style='margin-right:10px;' v-on:tap="onShare"></span>
                        <span v-show='userId != null' v-bind:class="favoriteFlag ? 'mui-icon-extra-heart-filled' : 'mui-icon-extra-heart'" class="mui-icon-extra mui-pull-right" v-on:tap="favoriteOnTap(id)"></span>
                        <div style='text-align:right;font-size:.24rem;'>剩余数量：<span style='font-color:red'>{{stockCount-orderCount}}</span></div>
                    </div>          
                </div>

                <div class='mui-row'>
                    <div class='mui-col-sm-12 mui-col-xs-12'>
                        <div class='gooddet_pricebox border_top' style='border-top:0px;padding-top:0px;margin-top:0px;'>
                            <div class="bottom clearfix" v-show="submitEnabledFlag">
                                <div class="gooddet__num_box fl clearfix">
                                    <a id="sub" href="javascript:void(0);" class="min fl" v-on:tap="buyCountOnDec"></a>
                                    <input type="text" v-model="buyCount" class="fl text">
                                    <a id="add" href="javascript:void(0);" class="add fl" v-on:tap="buyCountOnInc"></a>
                                </div>
                                <a href="#" class="gooddet_pricebox_button pink_gradient fl" v-on:tap="submitOnTap">购买</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="height:10px;background-color:#f2f5f7;"></div>
            <div class="mui-content">
                <div class="mui-row">
                    <div class='mui-col-sm-2 mui-col-xs-2' style="padding:10px;">支付</div>
                    <div class='mui-col-sm-10 mui-col-xs-10'>
                        <button style="padding:5px;margin:5px;" class="mui-btn mui-btn-outlined" v-bind:key="item" v-for="(item, index) in filterredPayment">{{item.name}}</button>
                    </div>
                </div>
            </div>
            <div style="height:10px;background-color:#f2f5f7;"></div>
            <div class="mui-content">
                
                <div class='mui-row' v-on:tap="onSupplierGoods" style='padding:10px;'>
                    <div class='mui-col-sm-9 mui-col-xs-9' >
                        <h6 class="title aunction-title auction-supplier" style='width:100%;font-size:small;line-height:.5rem;height:.5rem;backgroundImage: url(images/seller.jpg)'>{{supplierName}}</h6>
                    </div>
                    <div class='mui-col-sm-3 mui-col-xs-3' style='text-align:right;font-size:small'>
                        <span>在售商品</span>
                        <img src='images/list.png' style='width:20px;'>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import imageViewer from '../components/ImageViewer.vue'
    import { mapGetters } from 'vuex'
    import nav from '../utils/nav.js'
    import fetch from '../utils/fetch.js'
    import mainMenu from '../components/MainMenu.vue'
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
                stockCount: null,
                buyCount: 1,
                supplierName: null,
                supplierImage: null,
                payment: [],
                visibleView: 'MAIN_VIEW'
            }
        },
        methods: {
            onShare: function(){
                if(window.sharewx != null){
                    window.sharewx.send( {
                        content: this.title,
                        href: `http://www.hkunitedauction.com/#/share/${this.id}`,
                        extra: { 
                            scene:"WXSceneTimeline"
                            }
                        }, function(){
                            mui.alert("分享成功！");
                        }, function(e){
                            mui.alert("分享失败："+e.message);
                        });
                }
            },
            questionOnTap: function(){
                nav.go(`/question/${this.id}/${this.title}`);
            },
            onSupplierGoods: function(){
                nav.go(`/supplier/goods/${this.supplier}`);
            },
            loadSupplier: function(userId){
                fetch.get(`/user/v1/user/${userId}`, null, function(data){
                    this.supplierName = data.data.nickName;
                    this.supplierImage = data.data.avatar;
                }.bind(this));
            },
            favoriteOnTap: function(goodId){
                fetch.post(`/user/v2/good/${goodId}/favorite`, null, function(data){
                    this.favoriteFlag = data.data;    
                }.bind(this));
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
                    var orderCount = 0;
                    if(data.data.orders != null){
                        data.data.orders.map(function(order, index){
                            orderCount += order.buyCount;
                        });
                    }
                    
                    this.id = data.data.goodId;
                    this.images = JSON.parse(data.data.images);
                    this.title = data.data.goodName;
                    this.description = data.data.description;
                    this.price = data.data.topPrice;
                    this.priceInput = data.data.topPrice;
                    this.basePrice = data.data.topPrice;
                    this.status = data.data.status;
                    this.deadline = data.data.deadline;
                    this.orderCount = orderCount;
                    this.supplier = data.data.supplier;
                    this.orders = data.data.orders;
                    this.postage = data.data.postage;
                    if(data.data.order != null){
                        this.buyerName = data.data.order.buyerName;
                        this.ownerFlag = data.data.order.ownerFlag;
                    }
                    this.stockCount = data.data.stockCount;

                    if(data.data.payment != null){
                        this.payment = JSON.parse(data.data.payment);
                    }
                    
                    this.loadSupplier(data.data.supplier);
                }.bind(this));
            },
            orderCountOnTap: function(id){
                nav.go(`/auction/list/${id}`);
            },
            buyCountOnInc: function(){
                if(this.buyCount >= (this.stockCount-this.orderCount)){
                    return;
                }
                this.buyCount += 1;
            },
            buyCountOnDec: function(){
                if(this.buyCount <= 1){
                    return;
                }
                this.buyCount -= 1;
            },
            submitOnTap: function(){
                if(this.buyCount > (this.stockCount - this.orderCount)){
                    mui.alert('数量不能高于可供数量');
                    return;
                }

                fetch.post(`/user/v2/good/${this.id}/order?type=精品商城`, {
                    goodId: this.id,
                    buyPrice: this.priceInput,
                    goodName: this.title,
                    goodImages: JSON.stringify(this.images),
                    buyCount: this.buyCount
                }, function(data){
                    mui.toast('购买完成');
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
                return this.supplier != this.userId && this.stockCount - this.orderCount > 0;
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