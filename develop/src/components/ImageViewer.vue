<template>
        <div style="height:100%;background-position:center;background-size:100%;background-repeat:no-repeat" 
            v-bind:style="{backgroundImage: `url(${formatImage(image)})`}">
            
        </div>
</template>

<script>
    import { formatImage, formatDateDiff, formatDate2, formatImageBackground } from '../utils/format.js'

    export default {
        name: 'image-viewer',
        props: ['image'],
        data(){
            return {
                index: 0
            }
        },
        methods: {
            formatImage: formatImage,
            formatImageBackground: formatImageBackground
        }
    }
</script>
