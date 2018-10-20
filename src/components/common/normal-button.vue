<template>
    <!--语义化标签-->
    <button class="normal-button" :class="{highlight, active}" v-title>
        <Icon class="icon" :type="iconType" size="sm" v-if="iconType"></Icon>
        <span class="title">
            <slot></slot>
        </span>
    </button>
</template>

<script>
import Title from '../../directives/title.js';
import Icon from './icon.vue';

export default {
    name: 'normal-button',
    components: {Icon},
    directives: {Title},
    props: {
        iconType: {
            type: String,
        },
        active: {
            type: Boolean,
            default: false,
        },
        highlight: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .normal-button {
        padding       : 0 8px;
        color         : $gray-6;
        border        : 1px solid $gray-3;
        border-radius : 3px;
        box-sizing    : border-box;
        cursor        : pointer;
        min-width     : 60px;
        transition    : all .2s;

        & + & {
            margin-left : 10px;
        }

        &:hover, &:focus {
            background : $gray-1;
        }

        &:active {
            background : $gray-2;
        }

        &.highlight {
            border-color : $theme;
            color        : $theme;
        }

        &.active {
            border-color : $theme;
            background   : $theme;
            color        : white;
        }

        .icon {
            margin-right   : 5px;
            vertical-align : middle;
        }

        .title {
            line-height    : 23px;
            font-size      : 12px;
            vertical-align : middle;
        }
    }
</style>