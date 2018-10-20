<template>
    <div class="rec-board">
        <div class="rec-board-title">
            <p>
                <slot name="title">标题</slot>
            </p>
        </div>
        <div class="rec-board-content">
            <slot name="content">
                内容
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'rec-board',
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .rec-board {

        &-title {
            font-size   : 15px;
            line-height : 25px;
            color       : $gray-6;

            &:after {
                content    : '';
                display    : block;
                margin-top : 5px;
                height     : 14px;
                border-top : 1px solid hsla(0, 0, 0, .1);
            }
        }

        &-content {
            height      : 100px;
            white-space : initial;
        }
    }
</style>