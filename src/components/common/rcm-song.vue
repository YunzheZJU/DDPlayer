<template>
    <div class="rcm-song">
        <div class="cover">
            <Thumbnail slot="cover" :src="imageSrc" :is-round="false" border-color="#e1e5e6" size="36px"></Thumbnail>
        </div>
        <div class="content">
            <!--float-right需要写在前面-->
            <div class="content-right">
                <p class="count">
                    <slot name="count"></slot>
                    人听过
                </p>
            </div>
            <div class="content-left">
                <p class="text">
                    <slot name="title"></slot>
                    -
                    <slot name="artist"></slot>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Thumbnail from './thumbnail.vue';

export default {
    name: 'rcm-song',
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
    @import "../../styles/colors";

    .rcm-song {
        padding : 7px;

        p {
            line-height : 36px;
            font-size   : 12px;
        }

        .cover {
            float  : left;
            margin : 0 3px;
        }

        .content {
            margin-left : 42px;
            padding     : 0 3px 0 7px;

            .content-right {
                float : right;
                width : 75px;

                .count {
                    text-align : right;
                }
            }

            .content-left {
                margin-right : 80px;
            }
        }

        &:hover {
            background : hsla(0, 0, 100, .15);
        }
    }
</style>