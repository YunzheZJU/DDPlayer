<template>
    <!--提供关闭按钮和close事件的按钮，按钮位置在容器content-box的右上角-->
    <div class="close-button">
        <div class="close" @click="handleClickClose">
            <Icon type="close" size="3xs"></Icon>
        </div>
    </div>
</template>

<script>
import Icon from './icon.vue';

export default {
    name: 'close-button',
    components: {Icon},
    methods: {
        handleClickClose () {
            this.$emit('close');
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .close-button {
        /*不使用position: absolute实现右上角对齐*/
        height     : 0;
        text-align : right;

        .close {
            display  : inline-block;
            position : relative;
            cursor   : pointer;

            &:after {
                content   : '';
                width     : 18px;
                height    : 18px;
                position  : absolute;
                left      : 50%;
                top       : 50%;
                transform : translate3d(-50%, -50%, 0);
                z-index: -1;
            }

            &:hover {
                color : black;

                &:after {
                    background : $gray-1;
                }
            }
        }
    }
</style>