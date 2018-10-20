<template>
    <Thumbnail :src="imageSrc" :is-round="true" border-color="#e1e5e6" size="36px" class="rcm-user"></Thumbnail>
</template>

<script>
import Thumbnail from './thumbnail.vue';

export default {
    name: 'rcm-user',
    components: {Thumbnail},
    props: {
        imageSrc: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
    .rcm-user {
        margin : 5px 9px 5px 0;
    }
</style>