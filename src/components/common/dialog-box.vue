<template>
    <transition>
        <div class="dialog-box">
            <CloseButton @close="handleClose"></CloseButton>
            <div class="title">
                <div class="title-icon">
                    <slot name="title-icon"></slot>
                </div>
                <p>
                    <slot name="title"></slot>
                </p>
            </div>
            <div class="content">
                <div class="content-top">
                    <slot name="content-top"></slot>
                </div>
                <div class="content-bottom">
                    <slot name="content-bottom"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import CloseButton from './close-button.vue';

export default {
    name: 'dialog-box',
    components: {CloseButton},
    props: {},
    methods: {
        handleClose () {
            this.$emit('close');
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .dialog-box {
        /*作为异步加载的组件，position: relative会将外层设置的absolute覆盖，改用overflow*/
        /*position      : relative;*/
        padding       : 10px 15px;
        /*用于设置关闭按钮的颜色*/
        color         : $gray-6;
        border        : solid $theme;
        border-width  : 0 0 0 5px;
        border-radius : 0 4px 4px 0;
        background    : white;
        box-shadow    : 0 0 10px 1px $shadow;
        box-sizing    : border-box;
        overflow      : hidden;

        &.v-enter-active, &.v-leave-active {
            transition : all .2s;
        }

        &.v-enter, &.v-leave-to {
            opacity : 0;
        }

        .title {
            &-icon {
                float          : left;
                margin-right   : 5px;
                line-height    : 15px;
                vertical-align : middle;
            }

            p {
                font-size   : 12px;
                line-height : 15px;
            }
        }

        .content {
            position     : absolute;
            /*留出边距*/
            top          : 25px;
            bottom       : 10px;
            left         : 15px;
            right        : 15px;
            writing-mode : vertical-lr;

            &-top {
                float : left;
            }

            &-bottom {
                float : right;
            }

            & > * {
                display      : inline-block;
                width        : 100%;
                writing-mode : horizontal-tb;
            }
        }
    }
</style>