<template>
    <DialogBox class="add-to-dialog" :style="addStyles" v-show="show" @close="handleClose"
               v-click-outside="handleClose">
        <Icon slot="title-icon" type="edit" size="sm"></Icon>
        <template slot="title">
            <span>添加到歌单</span>
        </template>
        <template slot="content-top">
            <div class="edit-list">
                <div class="title">
                    <div class="collection">
                        <p>歌单</p>
                    </div>
                    <div class="add">
                        <p>添加</p>
                    </div>
                </div>
                <ScrollArea :style="listStyles">
                    <ul>
                        <li class="item" v-for="(collection, index) in collectionsData" :key="index">
                            <div class="collection">
                                <template v-if="collection.imageUrl">
                                    <Thumbnail class="collection-thumbnail" size="25px" :src="collection.imageUrl">
                                    </Thumbnail>
                                </template>
                                <!--找不到封面和“创建新歌单”会以这种形式显示略缩图-->
                                <template v-else>
                                    <div class="collection-empty">
                                        <Icon class="collection-empty-icon" type="logo" size="lg"></Icon>
                                    </div>
                                </template>
                                <p :class="['name', {new: collection['id'] === 0}]">{{ collection['name'] }}</p>
                            </div>
                            <div class="add">
                                <label>
                                    <input type="checkbox" v-model="targetCollections" :value="collection['id']"
                                           :title="collection['id'] === 0 ? '创建新歌单' : `添加到${collection['name']}`"
                                           :id="`item-${collection['id']}`">
                                </label>
                            </div>
                        </li>
                    </ul>
                </ScrollArea>
            </div>
        </template>
        <template slot="content-bottom">
            <div class="button-group">
                <NormalButton class="button" icon-type="edit" :active="true" @click.native="handleConfirm">
                    添加
                </NormalButton>
                <NormalButton class="button" icon-type="cancel" @click.native="handleClose">
                    放弃
                </NormalButton>
            </div>
        </template>
    </DialogBox>
</template>

<script>
import {mapGetters} from 'vuex';
import ClickOutside from '../../directives/clickoutside';
import Icon from '../common/icon.vue';
import NormalButton from '../common/normal-button.vue';
import ScrollArea from '../common/scroll-area.vue';
import Thumbnail from '../common/thumbnail.vue';
import DialogBox from '../common/dialog-box.vue';

export default {
    name: 'add-song-dialog',
    components: {Thumbnail, DialogBox, Icon, NormalButton, ScrollArea},
    directives: {ClickOutside},
    data () {
        return {
            maxItemCount: 6,
            id: -1,
            targetCollections: [],
            collectionsData: [],
        };
    },
    watch: {
        show (value) {
            if (!value) {
                this.$hasher.remove('add');
            }
        },
    },
    computed: {
        ...mapGetters('collection', [
            'collections',
        ]),
        addStyles () {
            return {
                height: `${this.collectionsData.length * 40 + 110}px`,
                maxHeight: `${this.maxItemCount * 40 + 110}px`,
            };
        },
        listStyles () {
            return {
                height: `${this.collectionsData.length * 40}px`,
                maxHeight: `${this.maxItemCount * 40}px`,
            };
        },
        show () {
            return this.id > 0;
        },
    },
    methods: {
        handleConfirm () {
            this.targetCollections.filter(id => id !== 0).forEach(collectionId => {
                this.$store.dispatch('addSongToCollection', {id: collectionId, songId: this.id});
            });
            this.collections.filter(
                collection => !this.targetCollections.includes(collection.id),
            ).forEach(collection => {
                this.$store.dispatch('removeSongFromCollection', {id: collection.id, songId: this.id});
            });

            // 必须二选一，否则会冲突，导致跳转路由被hash变化覆盖
            if (this.targetCollections.includes(0)) {
                this.$router.push(`/collection/newPlaylist#edit&initial=${this.id}`);
                console.log('push');
            } else {
                this.handleClose();
            }
        },
        handleClose () {
            this.$hasher.remove('add');
        },
        // 根据hash值同步显示状态
        handleHashChange (hash) {
            this.id = ~~hash['add'];
            this.updateData();
        },
        updateData () {
            this.targetCollections = this.collections.filter(
                collection => collection.playlist.includes(this.id),
            ).map(collection => collection.id);
            this.collectionsData = [
                ...[...this.collections].map(collection => {
                    collection.imageUrl = '';
                    const cover = collection['cover'];
                    if (cover !== -1) {
                        this.$ajax.getSongsSimpleAsync(collection['playlist'][cover]).then(data => {
                            collection.imageUrl = data[0].imageUrl;
                        });
                    }
                    return collection;
                }),
                {
                    id: 0,
                    name: '创建新歌单',
                    imageUrl: '',
                },
            ];
        },
    },
    mounted () {
        this.updateData();
        // 此时this.$hash已经结束变化，必须手动调用一次
        this.handleHashChange(this.$hash);
        this.$hasher.bind(this.handleHashChange);
    },
    destroyed () {
        this.$hasher.unbind(this.handleHashChange);
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .add-to-dialog {
        position  : fixed;
        top       : 50%;
        left      : 50%;
        transform : translate3d(-50%, -50%, 0);
        width     : 250px;

        .edit-list {
            margin-top : 10px;
            max-height : 360px;

            .title, .item {

                .collection, .add {
                    vertical-align : middle;
                }

                .collection {
                    display      : inline-block;
                    width        : 70%;
                    padding-left : 5px;
                    box-sizing   : border-box;

                    &-thumbnail {
                        float        : left;
                        margin-right : 5px;
                        width        : 25px;
                        height       : 25px;
                        line-height  : 40px;
                    }

                    &-empty {
                        display        : inline-block;
                        margin-right   : 5px;
                        width          : 25px;
                        height         : 25px;
                        color          : $theme;
                        background     : white;
                        /*border默认颜色为color颜色*/
                        border         : 1px solid;
                        box-sizing     : border-box;
                        text-align     : center;
                        vertical-align : middle;
                        writing-mode   : vertical-lr;

                        &-icon {
                            width        : 100%;
                            /*若使用position定位，可能变模糊*/
                            writing-mode : horizontal-tb;
                        }
                    }

                    p.name {
                        vertical-align : middle;
                        display        : inline-block;
                    }
                }

                .add {
                    text-align : center;
                    display    : inline-block;
                    width      : 30%;
                }
            }

            .title {
                background : $gray-1;

                p {
                    font-size   : 12px;
                    line-height : 30px;
                }
            }

            .item {
                &:nth-child(2n + 1) {
                    background : $gray-2;
                }

                &:nth-child(2n) {
                    background : $gray-1;
                }

                p {
                    font-size   : 12px;
                    line-height : 40px;

                    &.new {
                        text-decoration : underline;
                        cursor          : help;
                    }
                }
            }
        }

        .button-group {
            text-align : right;
        }
    }
</style>