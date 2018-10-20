<template>
    <a class="third-party-link" :href="url" target="_blank">
        <Thumbnail :src="imageSrc" size="50px" :border-color="themeColor" :is-round="true"></Thumbnail>
        <div class="third-party-link-title">
            <p>
                <slot></slot>
            </p>
        </div>
    </a>
</template>

<script>
import Thumbnail from './thumbnail.vue';

export default {
    name: 'third-party-link',
    components: {Thumbnail},
    props: {
        imageSrc: {
            type: String,
            required: true,
        },
        themeColor: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped lang="scss">
    .third-party-link {

        &-title {
            text-align : center;

            p {
                font-size   : 12px;
                line-height : 20px;
            }
        }
    }
</style>