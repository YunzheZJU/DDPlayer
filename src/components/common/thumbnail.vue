<template>
    <div class="thumbnail">
        <img :src="src" :style="styles"/>
    </div>
</template>

<script>
export default {
    name: 'thumbnail',
    props: {
        isRound: {
            type: Boolean,
            default: false,
        },
        borderColor: {
            type: String,
            default: 'transparent',
        },
        borderWidth: {
            type: String,
            default: '1px',
        },
        src: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
    },
    computed: {
        styles () {
            return {
                borderRadius: this.isRound ? '50%' : '',
                borderColor: this.borderColor,
                borderWidth: this.borderWidth,
                width: this.size,
                height: this.size,
            };
        },
        titleStyles () {
            return {
                lineHeight: this.titleHeight,
            };
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .thumbnail {
        display : inline-block;

        img {
            border         : solid;
            vertical-align : middle;
            box-sizing     : border-box;
        }
    }
</style>