<template>
    <div class="action-button">
        <div class="icon">
            <Icon :type="type" :color="color" size="xl"></Icon>
        </div>
        <div class="label">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import Icon from './icon.vue';

export default {
    name: 'action-button',
    components: {Icon},
    props: {
        type: String,
        color: String,
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .action-button {
        padding       : 10px 15px;
        text-align    : center;
        cursor        : pointer;
        border-radius : 5px;

        .label {
            margin-top  : 10px;
            font-size   : 15px;
            line-height : 15px;
        }

        &:hover {
            background : hsla(0, 0, 100, .15);
        }
    }
</style>