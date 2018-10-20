<template>
    <!--3-in-1-->
    <div class="page-header" :class="[layout]">
        <div class="edit" @click="handleEdit" v-if="canEdit">
            <Icon type="edit" size="lg"></Icon>
            <p>编辑</p>
        </div>
        <div v-if="layout === 'icon'" class="cover">
            <Icon :type="iconType" size="4xl" color="theme"></Icon>
        </div>
        <DiskCase v-else-if="layout === 'disk'" class="cover" :src="imageSrc"></DiskCase>
        <CoverImage v-else-if="layout === 'image'" class="cover" :image-src="imageSrc" size="10xl"></CoverImage>
        <template v-if="isEditing">
            <div class="edit-title">
                <p>名称：</p>
            </div>
        </template>
        <template v-else>
            <div class="title">
                <p>
                    <span class="title-main" :style="titleMainStyles" v-title>
                        <slot name="title"></slot>
                    </span>
                    <span class="title-sub" v-title>
                        <slot name="title-sub"></slot>
                    </span>
                </p>
            </div>
        </template>
        <template v-if="layout === 'icon'">
            <div class="description">
                <p v-title>
                    <slot name="description"></slot>
                </p>
            </div>
        </template>
        <template v-else>
            <template v-if="isEditing">
                <div class="edit-description">
                    <p>简介：</p>
                </div>
            </template>
            <template v-else>
                <div class="description-1">
                    <p v-title>
                        <slot name="description-1"></slot>
                    </p>
                </div>
                <div class="description-2">
                    <p v-title>
                        <slot name="description-2"></slot>
                    </p>
                </div>
                <div class="button-group">
                    <slot name="button"></slot>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import Title from '../../directives/title.js';
import CoverImage from './cover-image.vue';
import DiskCase from './disk-case.vue';
import Icon from './icon.vue';

export default {
    name: 'page-header',
    components: {Icon, DiskCase, CoverImage},
    directives: {Title},
    props: {
        iconType: {
            type: String,
        },
        imageSrc: {
            type: String,
        },
        layout: {
            type: String,
            validator: value => ['icon', 'image', 'disk'].includes(value),
            required: true,
        },
        isBoldTitle: {
            type: Boolean,
            default: false,
        },
        canEdit: {
            type: Boolean,
            default: false,
        },
        isEditing: {
            type: Boolean,
            default: false,
        },
        editTitle: {
            type: String,
            default: '',
        },
        editDescription: {
            type: String,
            default: '',
        },
    },
    data () {
        return {
            title: this.editTitle,
            description: this.editDescription,
        };
    },
    computed: {
        titleMainStyles () {
            return this.isBoldTitle ? {
                fontWeight: '600',
            } : {};
        },
    },
    methods: {
        handleEdit () {
            this.$emit('edit');
        },
        handleTitleChange () {
            this.$emit('update:editTitle', this.title);
        },
        handleDescriptionChange () {
            this.$emit('update:editDescription', this.description);
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .page-header {
        padding  : 0 20px;
        position : relative;

        /*无关layout，公用*/
        .cover {
            float : left;
        }

        /*.title {*/
            /*span {*/
                /*font-size : 18px;*/
            /*}*/
        /*}*/

        .edit {
            /*编辑按钮*/
            position      : absolute;
            right         : 0;
            padding       : 5px 10px;
            border-radius : 3px;
            text-align    : center;
            cursor        : pointer;

            &:hover {
                background : $gray-1;
            }

            p {
                font-size   : 12px;
                line-height : 20px !important;
            }
        }

        /*针对性设置*/
        &.icon {
            .title {
                p {
                    line-height : 0;

                    span {
                        line-height : 25px;
                        font-size : 18px;
                    }
                }
            }

            p {
                line-height : 25px;
            }

            .cover {
                margin-right : 5px;
                line-height  : 50px;
            }

            .description {
                p {
                    font-size : 12px;
                }
            }
        }

        &.image, &.disk {
            .title {
                p {
                    line-height : 0;

                    span {
                        line-height : 30px;
                        font-size : 18px;
                    }
                }
            }

            p {
                line-height : 30px;
            }

            .cover {
                margin-right : 15px;
            }

            .title-sub {
                font-size   : 12px;
                margin-left : 20px;
                font-weight : normal;
            }

            .description-1, .description-2 {
                /*description可能是空的，需要高度占位*/
                height : 30px;

                p {
                    font-size : 12px;
                }

                span {
                    vertical-align : middle;
                }

                span + span {
                    margin-left : 20px;
                }
            }

            .button-group {
                line-height : 30px;
            }
        }

        &.image {
            .cover {
                width  : 120px;
                height : 120px;
            }
        }

        &.disk {
            .cover {
                width  : 140px;
                height : 120px;
            }
        }
    }
</style>