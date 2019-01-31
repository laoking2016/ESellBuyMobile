<template>
    <div class="pm_showinfo border_top" style="padding: 0px;border-top:none;text-align:center">
        <img id="crop-image" v-bind:src="formatImage(image)" />
        <input type="button" v-on:tap="cropOnTap" value="确定" class="ipt ipt_button pink_gradient" />
    </div>
</template>

<script>
    import { formatImage } from '../utils/format.js'

    export default {
        props: ['image', 'onCrop'],
        data(){
            return {
                args: null,
                cropper: null
            }
        },
        methods: {
            cropOnTap: function(){
                this.$props.onCrop(this.args);
                /*if(this.cropper != null){
                    this.cropper.clear();
                }*/
            },
            formatImage: formatImage
        },
        mounted(){
            
        },
        updated(){
            
            this.$nextTick(function () {
                
                var width = document.body.clientWidth - 20;
                var height = document.body.clientWidth - 20;

                $("#crop-image").cropbox({width: width, height: height, showControls: 'always' }).on('cropbox', function(event, results, img){
                    console.log(results);
                    var w, h, x, y;
                    w = results.width / results.cropW * 100;
                    h = results.height / results.cropH * 100;
                    x = results.cropX / (results.width - results.cropW) * 100;
                    y = results.cropY / (results.height - results.cropH) * 100;
                    if(x == null){
                        x = 0;
                    }
                    if(y == null){
                        y = 0;
                    }
                    this.args = {
                        image: this.$props.image,
                        w: w,
                        h: h,
                        x: x,
                        y: y
                    }
                }.bind(this));
                
            })
        }
    }
</script>

<style scope>

</style>