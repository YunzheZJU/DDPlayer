<template>
    <ScrollArea class="artist-list">
        <ul>
            <slot></slot>
        </ul>
    </ScrollArea>
</template>

<script>
import ScrollArea from './scroll-area.vue';

export default {
    name: 'artist-list',
    components: {ScrollArea},
};
</script>

<style scoped lang="scss">
    .artist-list {

    }
</style>