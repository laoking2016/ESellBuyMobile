<template>
    <div>
        <main-menu top-button-type="MENU" header-text="拍卖出品"/>
        <div v-show="dialog == 'self'">
            <div class="pm_main">
                <div class="pm_fileup">
                    <div class="install_filebox">
                        <ul class="upload-ul clearfix">
                            <li v-bind:key="image" v-for="image in images">
                                <div class="webuploader-container clearfix"  v-bind:style="formatImageBackground(image)">
                                    <div class="image-close" v-on:tap="removeImageOnTag(image.image)"><b>X</b></div>
                                </div>
                            </li>
                            <li class="upload-pick">
                                <div class="webuploader-container clearfix" v-on:tap="fileInputOnTap"></div>
                                <input id="file-input-handler" type="file" style="display:none;">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="pm_info">
                    <div class="good_title">
                        <input type="text" v-model="goodName" class="ipt title" placeholder="商品名称"/>
                    </div>
                    <div>
                        <textarea class="ipt desc" v-model="description" placeholder="在此描述商品"></textarea>
                    </div>
                </div>
                <div class="pm_showinfo border_top">
                    <li class="item clearfix" v-on:tap="categoryOnTap">
                        <span class="tit">分类</span>
                        <div class="info">
                            <input type="text" readonly v-bind:value="category.title" class="ipt ipt_txt" />
                        </div>
                    </li>
                    <li class="item clearfix">
                        <span class="tit">邮费</span>
                        <div class="info">
                            <input type="text" v-model="postage" class="ipt ipt_txt" placeholder="单位(元)"/>
                        </div>
                    </li>
                    <li class="item clearfix">
                        <span class="tit">起拍价</span>
                        <div class="info">
                            <input type="text" v-model="originalPrice" class="ipt ipt_txt" placeholder="单位(元)"/>
                        </div>
                    </li>
                    <li class="item clearfix" v-on:tap="deadlineOnTap">
                        <span class="tit">截标时间</span>
                        <div class="info">
                            <input type="text" readonly v-bind:value="deadline" class="ipt ipt_txt"/>
                        </div>
                    </li>
                    <li class="item clearfix">
                        <span class="tit">支付方式</span>
                        <div class="info" style="width:5rem;">
                            <button v-on:tap="paymentOnTap(index)" style="padding:5px;margin:5px;" class="mui-btn mui-btn-outlined" v-bind:class="{'mui-btn-success': item.checked}" v-bind:key="item" v-for="(item, index) in payment">{{item.name}}</button>
                        </div>
                    </li>
                    <input type="button" v-on:tap="submitOnTap" value="上拍" class="ipt ipt_button pink_gradient" />
                </div>
            </div>
        </div>
        <div v-show="dialog == 'category'">
            <category v-bind:search="handleCategoryCallback" />
        </div>
        <div v-show="dialog == 'crop'" style="margin-top: 1rem">
            <image-crop v-bind:image="cropImage" v-bind:on-crop="onCrop"/>
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
    import nav from '../utils/nav.js'
    import category from '../components/Category.vue'
    import mainMenu from '../components/MainMenu.vue'
    import imageCrop from '../components/ImageCrop.vue'
    import { formatImage, formatImageBackground, isNumeric } from '../utils/format.js'
    
    export default {
        components: {
            category,
            imageCrop,
            mainMenu
        },
        data(){
            return {
                images: [],
                deadline: null,
                payment: [
                    {
                        name: '微信',
                        checked: true
                    },
                    {
                        name: '支付宝',
                        checked: false
                    },
                    {
                        name: '内地银行转账',
                        checked: false
                    },
                    {
                        name: '香港银行转账',
                        checked: false
                    },
                    {
                        name: 'PayPal',
                        checked: false
                    },
                    {
                        name: '店取',
                        checked: false
                    }
                ],
                postage: null,
                goodName: null,
                originalPrice: null,
                category: {
                    id: -1,
                    title: '所有分类'
                },
                description: null,
                dialog: 'self',
                cropImage: null
            }
        },
        methods: {
            onCrop: function(args){
                var searchedImage = this.images.filter(c => c.image == args.image);
                
                if(searchedImage.length == 0){
                    this.images.push(args);
                }
                this.cropImage = null;
                this.dialog = 'self';
            },
            handleCategoryCallback: function(id, title, firstId){
                this.category = {
                    id: id,
                    title: title
                };
                this.dialog = 'self';
            },
            formatImage: formatImage,
            formatImageBackground: formatImageBackground,
            removeImageOnTag: function(image){
                var index = _.findIndex(this.images, c => c.image == image);
                this.images.splice(index, 1);
                this.$forceUpdate();
            },
            categoryOnTap: function(){
                this.dialog = 'category';
            },
            fileInputOnTap: function(){
                plus.gallery.pick(function(path){

                    var name = path.substr(path.lastIndexOf('/') + 1);
                    
                    plus.zip.compressImage({
                        src: path,
                        dst: '_doc/' + name,
                        overwrite: true,
                        quality: 10
                    }, function(zip){
                        uploadFileExt(`/api/v1/fileUpload`, zip.target, function(json){

                            var url = json.data;
                            this.cropImage = url;
                            this.dialog = 'crop';

                        }.bind(this));
                    }.bind(this), function(zipe){

                    }.bind(this));
                    
                }.bind(this), function(e){
                    console.log(e);
                }.bind(this), false);

                //$("#file-input-handler").trigger('click');
            },
            deadlineOnTap: function(event){
                if(event.target.picker){
                    event.target.picker.show(function(rs){
                        this.deadline = rs.text;
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }else{
                    event.target.picker = new mui.DtPicker({
                        beginDate: moment().toDate(),
                        endDate: moment().add(14, 'day').toDate()
                    });
                    event.target.picker.show(function(rs){
                        this.deadline = rs.text;
                        event.target.picker.dispose();
                        event.target.picker = null;
                    }.bind(this));
                }
            },
            paymentOnTap: function(index){
                this.payment[index].checked = !this.payment[index].checked;
            },
            submitOnTap: function(){
                if(this.category.id == -1){
                    mui.alert('请选择分类');
                    return;
                }

                if(this.postage == null){
                    mui.alert('请输入邮费');
                    return;
                }

                if(this.originalPrice == null){
                    mui.alert('请输入起拍价');
                    return;
                }

                if(this.deadline == null){
                    mui.alert('请输入截标时间');
                    return;
                }

                if(!isNumeric(this.postage)){
                    mui.alert('邮费只能为数字格式');
                    return;
                }

                if(!isNumeric(this.originalPrice)){
                    mui.alert('起拍价只能为数字格式');
                    return;
                }

                fetch.post(`/user/v2/good?type=拍卖`, {
                    categorySecondId: this.category.id,
                    goodName: this.goodName,
                    postage: this.postage,
                    price: this.originalPrice,
                    deadline: new Date(this.deadline),
                    payment: JSON.stringify(this.payment),
                    images: JSON.stringify(this.images),
                    description: this.description
                }, function(data){
                    
                    mui.alert('上拍成功');

                    this.images = [];
                    this.deadline = null;
                    this.payment = '微信';
                    this.postage = null;
                    this.goodName = null;
                    this.originalPrice = null;
                    this.category = {
                        id: -1,
                        title: '所有分类'
                    };
                    this.description = null;
                    this.dialog = 'self';
                    this.cropImage = null;
                }.bind(this));
            }
        },
        mounted() {

            $('#file-input-handler').on('change', function(event){
                
                var file = event.target.files[0];
                var _this = this;
                uploadFile(`/api/v1/fileUpload`, file, null, function(){
                    if(4 == this.readyState && this.response != null){
                        var json = eval('(' + this.response + ')');
                        var url = json.data;
                        _this.cropImage = url;
                        _this.dialog = 'crop';
                        event.target.value="";
                    }
                });
            }.bind(this));
        }
    }
</script>