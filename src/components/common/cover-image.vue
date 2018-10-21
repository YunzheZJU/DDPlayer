<template>
    <div class="cover-image">
        <div class="cover-image-bg">
            <Icon class="cover-image-bg-icon" type="logo" :size="size"></Icon>
        </div>
        <img :src="imageSrc" v-show="imageSrc"/>
        <div class="song-state" :title="`音质：${state}`" v-show="state && imageSrc">{{ state }}</div>
    </div>
</template>

<script>
import Icon from './icon.vue';

export default {
    name: 'cover-image',
    components: {Icon},
    props: {
        imageSrc: {
            type: String,
            default: '',
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            default: '',
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .cover-image {
        position : relative;

        &-bg {
            width        : 100%;
            height       : 100%;
            color        : $theme;
            background   : white;
            /*border默认颜色为color颜色*/
            border       : 5px solid;
            box-sizing   : border-box;
            writing-mode : vertical-lr;
            text-align   : center;

            &-icon {
                /*若使用position定位，可能变模糊*/
                writing-mode : horizontal-tb;
                width        : 100%;
            }
        }

        img {
            position   : absolute;
            top        : 0;
            bottom     : 0;
            left       : 0;
            right      : 0;
            border     : 1px solid $gray-3;
            box-sizing : border-box;
        }

        .song-state {
            position               : absolute;
            bottom                 : 0;
            right                  : 0;
            width                  : 20px;
            height                 : 10px;
            background             : $theme;
            border-top-left-radius : 3px;
            font-size              : 8px;
            color                  : white;
            padding                : 0 3px;
            box-sizing             : border-box;
            letter-spacing         : 2px;
            line-height            : normal;

            &:before {
                content  : '';
                position : absolute;
                bottom   : 0;
                right    : 0;
                width    : 25px;
                height   : 15px;
            }
        }
    }
</style>