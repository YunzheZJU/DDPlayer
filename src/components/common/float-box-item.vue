<template>
    <div class="float-box-item" :class="classes">
        <div v-if="icon" class="float-box-item-icon">
            <slot name="icon"></slot>
        </div>
        <div class="float-box-item-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>

export default {
    name: 'float-box-item',
    props: {
        canHover: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: Boolean,
            default: false,
        },
        tight: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        classes () {
            return [
                this.canHover ? 'canHover' : '',
                this.tight ? 'tight' : '',
            ];
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .float-box-item {
        font-size   : 0;
        line-height   : 30px;

        &.tight {
            line-height : 20px;
        }

        &.active {
            color : $theme;
        }

        &.active, &.canHover:hover {
            background : $gray-1;
        }

        &-icon, &-content {
            display        : inline-block;
            vertical-align : middle;
        }

        &-icon {
            margin : 0 9px;
        }

        &-icon + &-content {
            margin-left : 0;
        }

        &-content {
            font-size : 12px;
            margin    : 0 10px;
        }
    }
</style>