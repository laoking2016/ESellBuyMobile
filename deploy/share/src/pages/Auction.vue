<template>
    <div>
        <main-menu top-button-type="BACK" v-bind:header-text="title" />
        <div v-show="visibleView == 'MAIN_VIEW'"  style="margin-top:1rem;">
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
            <div class='mui-content'>
                <div class='mui-row'>
                    <div class="mui-col-sm-12 mui-col-xs-12" style='padding:10px;'>
                        <h1 style='font-size:large;'>{{title}}</h1>
                        <div style='font-size:.24rem;color:#999999'>{{description}}</div>
                    </div>
                </div>
                <div class='mui-row' style='border-top:1px solid #f1f6f9;padding:10px;'>
                    <div class='mui-col-sm-7 mui-col-xs-7'>
                        <p class="font" style='font-weight:bold;'><span style='color:red;font-weight:bold;'>当前价</span>&nbsp;<span style="font-size:x-large;font-weight:bold;">{{renderPrice}}&nbsp;</span>元</p>
                        <p style='font-size:.24rem;color:#999999'>(含3%手续费不含邮费, 邮费{{postage}}元)</p>
                        
                    </div>
                    <div class="mui-col-sm-5 mui-col-xs-5" style='text-align:right;'>
                        <span class='mui-icon mui-icon-help' style='font-size:.5rem;margin-right:10px;' v-on:tap="questionOnTap"></span>
                        <span class='mui-icon-extra mui-icon-extra-comment' style='font-size:.41rem;margin-right:10px;'></span>
                        <span class='mui-icon-extra mui-icon-extra-share' style='margin-right:10px;' v-on:tap="onShare"></span>
                        <span v-show='userId != null' v-bind:class="favoriteFlag ? 'mui-icon-extra-heart-filled' : 'mui-icon-extra-heart'" class="mui-icon-extra mui-pull-right" v-on:tap="favoriteOnTap(id)"></span>
                    </div>
                    <div class="mui-col-sm-9 mui-col-xs-9">
                        <div class="gooddet_para clearfix" style='margin-top:10px;padding-left:0px;'>
                            <em class="icon icon_1 fl">截至</em>
                            <div class="txt fl">
                                {{formatDate2(new Date(this.deadline))}}
                            </div>
                        </div>
                        <div class="gooddet_para" style="padding-left:0px;">
                            <em class="icon icon_2 fl">剩余</em>
                            <div class="txt fl">
                                {{remainTitle}} 
                            </div>
                        </div>
                    </div>
                    <div class='mui-col-sm-3 mui-col-xs-3' style='text-align:center;height:1rem;line-height:1rem;' v-on:tap='orderCountOnTap(id)'>
                        <img src='images/bids.jpg' style='width:24xpx'>
                        <span style='font-color:red'>{{orderCount}}</span><span>次</span>
                    </div>
                </div>
                <div class='mui-row'>
                    <div class='mui-col-sm-12 mui-col-xs-12'>
                        <div class='gooddet_pricebox border_top' style='border-top:0px;padding-top:0px;margin-top:0px;'>
                            <div class="box clearfix"  v-show="submitEnabledFlag">
                                <div class="gooddet__num_box fl clearfix">
                                    <a id="sub" href="javascript:void(0);" class="min fl" v-on:tap="priceOnDec"></a>
                                    <input type="text" class="fl text" v-model="priceInput">
                                    <a id="add" href="javascript:void(0);" class="add fl" v-on:tap="priceOnInc"></a>
                                </div>
                                <a href="#" class="gooddet_pricebox_button pink_gradient fl" v-on:tap="submitOnTap">竞价</a>
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
                
                <div class='mui-row' v-on:tap="onSupplierGoods" style="padding:10px;">
                    <div class='mui-col-sm-9 mui-col-xs-9'>
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