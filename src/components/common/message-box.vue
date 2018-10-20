<template>
    <div class="message-box" :class="theme">
        <p>
            <slot></slot>
        </p>
    </div>
</template>

<script>
export default {
    name: 'message-box',
    props: {
        theme: {
            type: String,
            required: true,
            validator: value => ['error', 'warning', 'ok'].includes(value),
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .message-box {
        position      : absolute;
        top           : 55px;
        left          : 50%;
        transform     : translate3d(-50%, 0, 0);
        padding       : 0 10px;
        color         : white;
        border-radius : 2px;
        box-shadow    : 0 0 10px 1px $shadow;

        p {
            font-size   : 12px;
            line-height : 30px;
        }

        &.error {
            background : $theme-light-1;
        }

        &.warning {
            background : $yellow;
        }

        &.ok {
            background : $green;
        }
    }
</style>