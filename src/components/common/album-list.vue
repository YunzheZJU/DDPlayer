<template>
    <!--其实就是一个裸的ScrollArea-->
    <ScrollArea class="album-list">
        <ul>
            <slot></slot>
        </ul>
    </ScrollArea>
</template>

<script>
import ScrollArea from './scroll-area.vue';

export default {
    name: 'album-list',
    components: {ScrollArea},
};
</script>

<style scoped lang="scss">
    .album-list {

    }
</style>