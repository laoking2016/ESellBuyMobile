<template>
    <div>
        <div v-show="selfShown">
            <header class="mui-bar mui-bar-nav">
                <a href="#offCanvasSide" class="mui-action-back mui-icon mui-action-menu mui-icon-back mui-pull-left "></a>
                <h1 class="mui-title">商城出品</h1>
            </header>
            <div class="mui-content feedback">
                <div id="image-list" class="row image-list">
                    <div  class="image-item space" v-bind:key="image" v-for="image in images" v-bind:style="{backgroundImage: `url(${formatImage(image)}`}">
                        <div class="image-close" v-bind:data-image="image">X</div>
                        <div></div>
                    </div>
                    <div class="image-item space">
                        <div id="file-input" class="image-up">
                            <input id="file-input-handler" type="file" style="display:none;">
                        </div>
                    </div>
                </div>
                <form class="mui-input-group">
                    <div class="mui-input-row">
                        <label>商品名</label>
                        <input type="text" v-model="goodName" placeholder="商品名称"> 
                    </div>
                    <div class="mui-input-row" style="height:auto;">
                        <textarea v-model="description" class="mui-input-clear" placeholder="在此描述商品" data-input-clear="5" style="width:100%"></textarea>
                    </div>
                    <div class="mui-input-row">
                        <label>分类</label>
                        <a id="category-btn" class="mui-navigate-right"><label style="padding-left:0px;">{{category.title}}</label></a>
                    </div>
                    <div class="mui-input-row">
                        <label>邮费</label>
                        <input type="text" v-model="postage" placeholder="单位(元)">
                    </div>
                    <div class="mui-input-row">
                        <label>价格</label>
                        <input type="text" v-model="originalPrice" placeholder="单位(元)">
                    </div>
                    <div class="mui-input-row">
                        <label>数量</label>
                        <input type="text" v-model="stockCount" placeholder="">
                    </div>
                    <div class="mui-input-row">
                        <label>支付方式</label>
                        <span class="mui-navigate-right"><label id="payment-btn" style="width:60%;padding-left:0px;">{{payment}}</label></span>
                    </div>
                    <div class="mui-button-row">
                        <button type="button" id="submit-btn" class="mui-btn mui-btn-danger"  style="width:90%;">上架</button>
                    </div>
                </form>           
            </div>
        </div>
        <div v-show="categoryShown">
            <category v-bind:search="processCategorySearch" v-bind:close="processCategoryClose" />
        </div>
    </div>
</template>

<style scoped>
    @import "../assets/retention.css";
</style>

<script>
    import _ from 'lodash'
    import { uploadFile, uploadFileExt } from '../utils/uploader.js'
    import fetch from '../utils/fetch.js'
    import router from '../router.js'
    import category from '../components/Category.vue'
    import { formatImage, isNumeric } from '../utils/format.js'

    export default {
        components: {
            category
        },
        data(){
            return {
                images: [],
                stockCount: null,
                payment: '微信',
                postage: null,
                goodName: null,
                originalPrice: null,
                categoryShown: false,
                selfShown: true,
                category: {
                    id: -1,
                    title: '所有分类'
                },
                description: null
            }
        },
        methods: {
            processCategorySearch: function(id, title){
                this.category = {
                    id: id,
                    title: title
                };
                this.categoryShown = false;
                this.selfShown = true;
            },
            processCategoryClose: function(){
                this.categoryShown = false;
                this.selfShown = true;
            },
            formatImage: formatImage
        },
        mounted() {
            
            var _this = this;

            $('#category-btn').on('tap', function(event){
				this.categoryShown = true;
                this.selfShown = false
                
			}.bind(this));

            $('#file-input').on('tap', function(event){
                plus.gallery.pick(function(path){

                    var name = path.substr(path.lastIndexOf('/') + 1);
                    
                    plus.zip.compressImage({
                        src: path,
                        dst: '_doc/' + name,
                        overwrite: true,
                        quality: 50
                    }, function(zip){
                        uploadFileExt(`/api/v1/fileUpload`, zip.target, function(json){
                            var url = json.data;
                            var index = _.findIndex(this.images, c => c == url);
                            if(index < 0){
                                this.images.push(url);
                            }
                        }.bind(this));
                    }.bind(this), function(zipe){

                    }.bind(this));
                    
                }.bind(this), function(e){
                    console.log(e);
                }.bind(this), false);

                //$("#file-input-handler").trigger('click');
                
            }.bind(this));

            $('#payment-btn').on('tap', function(event){
                if(event.target.picker){
                    event.target.picker.show(function(items){
                        if(items.length > 0){
                            this.payment = items[0].value;
                        }
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }else{
                    event.target.picker = new mui.PopPicker();
                    event.target.picker.setData([
                        {
                            value: '微信',
                            text: '微信'
                        },{
                            value: '支付宝',
                            text: '支付宝'
                        }
                    ]);
                    event.target.picker.show(function(items){
                        if(items.length > 0){
                            this.payment = items[0].value;
                        }
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }
            }.bind(this));

            mui(".feedback").on('tap', '.image-close', function(event){
                var image = $(event.target).data('image');
                var index = _.findIndex(_this.images, c => c == image);
                this.images.splice(index, 1);
                this.$forceUpdate();
            }.bind(this));

            $('#file-input-handler').on('change', function(event){
                
                var file = event.target.files[0];
                
                uploadFile(`/api/v1/fileUpload`, file, null, function(){
                    if(4 == this.readyState && this.response != null){
                        var json = eval('(' + this.response + ')');

                        var url = json.data;
                        var index = _.findIndex(_this.images, c => c == url);
                        if(index < 0){
                            _this.images.push(url);
                        }
                        event.target.value="";
                    }
                });
            }.bind(this));

            $('#submit-btn').on('tap', function(event){

                if(this.category.id == -1){
                    mui.toast('请选择分类');
                    return;
                }

                if(this.postage == null){
                    mui.toast('请输入邮费');
                    return;
                }

                if(this.originalPrice == null){
                    mui.toast('请输入起拍价');
                    return;
                }

                if(this.stockCount == null){
                    mui.toast('请输入数量');
                    return;
                }

                if(!isNumeric(this.postage)){
                    mui.toast('邮费只能为数字格式');
                    return;
                }

                if(!isNumeric(this.originalPrice)){
                    mui.toast('价格只能为数字格式');
                    return;
                }

                if(!isNumeric(this.stockCount)){
                    mui.toast('数量只能为数字');
                    return;
                }

                fetch.post(`/user/v2/good?type=精品商城`, {
                    categorySecondId: this.category.id,
                    goodName: this.goodName,
                    postage: this.postage,
                    price: this.originalPrice,
                    stockCount: this.stockCount,
                    payment: this.payment,
                    images: JSON.stringify(this.images),
                    description: this.description,
                    deadline: (new Date()).setFullYear(5000, 12, 31)
                }, function(data){
                    router.push('/supplier/orders')
                }.bind(this));
            }.bind(this));
        }
    }
</script>