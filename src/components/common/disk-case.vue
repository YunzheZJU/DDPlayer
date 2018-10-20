<template>
    <!--需要在外部定义宽高尺寸-->
    <div class="disk-case">
        <img :src="src"/>
    </div>
</template>

<script>
export default {
    name: 'disk-case',
    props: {
        src: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .disk-case {
        position      : relative;
        text-align    : center;
        border        : 1px solid $gray-3;
        border-radius : 0 2px 2px 2px;
        box-sizing    : border-box;

        &:before {
            content      : '';
            float        : left;
            width        : 11%;
            height       : 100%;
            border-right : 1px solid $gray-3;
            background   : $gray-1;
            box-sizing   : border-box;
        }

        &:after {
            content       : '';
            display       : block;
            position      : absolute;
            top           : 0;
            left          : 0;
            width         : 100%;
            height        : 100%;
            /*不支持linear-gradient也没多大影响*/
            background    : linear-gradient(-45deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 1));
            border        : solid $gray-3;
            border-width  : 0 1px 1px 0;
            border-radius : 2px;
            box-sizing    : border-box;
        }

        img {
            /*少1%，同时在父级上设置text-align为center，使1%的空隙*/
            width  : 88%;
            height : 100%;
        }
    }
</style>