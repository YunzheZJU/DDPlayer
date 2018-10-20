<template>
    <div class="show-area">
        <div class="show-area-title">
            <p>
                <slot name="title"></slot>
                <span class="sub-title">
                    <slot name="sub-title"></slot>
                </span>
            </p>
        </div>
        <ScrollArea class="show-area-scroll" direction="horizontal">
            <ul>
                <slot name="content"></slot>
            </ul>
        </ScrollArea>
    </div>
</template>

<script>
import ScrollArea from './scroll-area.vue';

export default {
    name: 'show-area',
    components: {ScrollArea},
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .show-area {
        border-bottom : 1px solid $gray-3;

        &-title {

            p {
                font-size   : 14px;
                line-height : 20px;
            }

            .sub-title {
                margin-left : 10px;
                font-size   : 12px;
                color       : $gray-4;
            }
        }

        &-scroll {
            padding : 10px 0;
        }
    }
</style>