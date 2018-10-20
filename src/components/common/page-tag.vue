<template>
    <router-link v-if="isLink" tag="li" :to="to" class="page-tag">
        <a class="tag">
            <slot></slot>
        </a>
    </router-link>
    <li v-else class="page-tag" :class="classes">
        <a class="tag">
            <slot></slot>
        </a>
    </li>
</template>

<script>
export default {
    name: 'page-tag',
    props: {
        to: [Object, String],
        isLink: {
            type: Boolean,
            default: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        classes () {
            return {
                active: this.isActive,
            };
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .page-tag {
        display : inline-block;
        cursor  : pointer;

        .tag {
            text-align  : center;
            display     : block;
            width       : 60px;
            font-size   : 12px;
            line-height : 35px;
            height      : 35px;
            /*height与box-sizing组合使用*/
            box-sizing  : border-box;

            &:hover {
                border-bottom : 2px solid $theme;
            }
        }

        &.router-link-active .tag, &.active .tag {
            border-bottom : 2px solid $theme;
        }
    }
</style>