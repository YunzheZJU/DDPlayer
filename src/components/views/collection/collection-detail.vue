<template>
    <div class="collection-detail">
        <div class="header">
            <div class="left">
                <CoverImage class="cover" :image-src="coverImageUrl" size="10xl">
                </CoverImage>
            </div>
            <div class="center">
                <template v-if="isEditing">
                    <div class="edit-title">
                        <p>名称：</p>
                        <label class="input" :style="nameStyles" :data-count="wordCountName">
                            <input type="text" v-model="collection['name']" autofocus/>
                        </label>
                    </div>
                    <div class="edit-description">
                        <p>简介：</p>
                        <label class="input" :style="descriptionStyles" :data-count="wordCountDescription">
                            <textarea v-model="collection['description']" rows="2"></textarea>
                        </label>
                    </div>
                </template>
                <template v-else>
                    <div class="title">
                        <p v-title>
                            {{ collection['name'] }}
                        </p>
                    </div>
                    <div class="description-1">
                        <p v-title>
                            <template v-if="isLogged">
                                <Thumbnail class="avatar" :src="userInfo.avatarSrc" :is-round="true"
                                           border-color="white"
                                           size="20px"></Thumbnail>
                                <span>{{ userInfo.username }}</span>
                                <span>2018-10-03 创建</span>
                            </template>
                            <span>共{{ songsList.length }}首</span>
                        </p>
                    </div>
                    <div class="description-2">
                        <p>
                            简介：
                            <span v-if="collection['description']" v-title>
                                {{ collection['description'] }}
                            </span>
                            <span class="link" v-else @click="handleClickEdit">
                                添加简介
                            </span>
                        </p>
                    </div>
                    <div class="button-group">
                        <NormalButton class="button" icon-type="play-2" :highlight="true"
                                      @click.native="handlePlayAll">
                            播放全部
                        </NormalButton>
                        <NormalButton class="button" icon-type="plus" @click.native="handleAddToPlaylist">
                            加入队列
                        </NormalButton>
                    </div>
                </template>
            </div>
            <div class="right">
                <div class="edit" @click="handleClickEdit" v-if="!isEditing">
                    <Icon type="edit" size="lg"></Icon>
                    <p>编辑</p>
                </div>
                <div class="button-group" v-else>
                    <NormalButton class="button" icon-type="edit" :active="true"
                                  @click.native="handleConfirmEdit">
                        保存
                    </NormalButton>
                    <br/>
                    <NormalButton class="button" icon-type="cancel" @click.native="handleCancelEdit">
                        放弃
                    </NormalButton>
                </div>
            </div>
        </div>
        <!--尽可能多地显示列表项，高度固定为10项-->
        <SongList class="content" :item-count="songsList.length" height-type="full" :can-delete="!isEditing"
                  :max-visible-item-count="Math.floor((height -  (isEditing ? 310 : 280)) / 30)"
                  @update="handleSongListUpdate">
            <SongListItem v-for="(song, index) in songsList" :key="song.id" :collection="~~id"
                          playlist-type="collection"
                          type="entity" :song="song" :theme="index % 2 === 0 ? 'white' : 'gray'" :index="index"
                          :is-editing="isEditing" :is-cover="index === collection['cover']" @delete="handleDelete"
                          @cover="handleCover" @drop="handleDrop">
            </SongListItem>
            <template slot="empty-text">
                这里，空的
            </template>
        </SongList>
        <transition>
            <NormalButton v-show="isEditing" class="delete" icon-type="clear" @click.native="handleClickDelete">
                删除歌单
            </NormalButton>
        </transition>
        <transition>
            <DialogBox class="delete-confirm" v-show="showDeleteConfirm" @close="handleCloseDelete">
                <Icon slot="title-icon" type="information" size="sm"></Icon>
                <template slot="title">
                    <span>确认</span>
                </template>
                <template slot="content-top">
                    <p class="first">
                        即将删除 {{ collection.name }}
                    </p>
                    <p>
                        这个操作是不可撤销的！
                    </p>
                </template>
                <template slot="content-bottom">
                    <div class="button-group">
                        <NormalButton @click.native="handleConfirmDelete">
                            删除
                        </NormalButton>
                        <NormalButton :active="true" @click.native="handleCloseDelete">
                            放弃
                        </NormalButton>
                    </div>
                </template>
            </DialogBox>
        </transition>
    </div>
</template>

<script>
import u from '../../../libs/util';
import {mapState, mapGetters} from 'vuex';
import Title from '../../../directives/title.js';
import SongList from '../../common/song-list.vue';
import Thumbnail from '../../common/thumbnail.vue';
import CoverImage from '../../common/cover-image.vue';
import Icon from '../../common/icon.vue';
import SongListItem from '../../common/song-list-item.vue';
import NormalButton from '../../common/normal-button.vue';

const DialogBox = () => import(/* webpackChunkName: "popup" */ '../../common/dialog-box.vue');

export default {
    name: 'collection-detail',
    components: {DialogBox, Thumbnail, SongListItem, NormalButton, SongList, Icon, CoverImage},
    directives: {Title},
    props: ['id'],
    data () {
        return {
            collection: {},
            // songList本应作为依赖collection的计算属性，但是computed中不推荐使用异步逻辑，因此作为data手动修改
            // 这时可以作为编辑状态的collection的临时变量
            songsList: [],
            isEditing: false,
            isNew: false,
            initialSong: 0,
            showDeleteConfirm: false,
            inspect: true,
        };
    },
    computed: {
        ...mapState([
            'userInfo',
        ]),
        ...mapGetters('favorite', [
            'favSongs',
        ]),
        ...mapGetters('collection', [
            'collectionOfId',
            'collections',
        ]),
        ...mapGetters([
            'isLogged',
            'height',
        ]),
        wordCountName () {
            return 30 - (this.collection['name'] || '').length;
        },
        wordCountDescription () {
            return 60 - (this.collection['description'] || '').length;
        },
        nameStyles () {
            return this.wordCountName < 0 ? {
                color: '#f74231',
            } : {};
        },
        descriptionStyles () {
            return this.wordCountDescription < 0 ? {
                color: '#f74231',
            } : {};
        },
        coverImageUrl () {
            if (this.collection['cover'] !== -1 && this.songsList[this.collection['cover']]) {
                return this.songsList[this.collection['cover']].imageUrl;
            }
            return undefined;
        },
    },
    watch: {
        id (value) {
            this.getCollection(value);
        },
        isEditing (value) {
            if (value) {
                this.$hasher.set('edit');
            } else {
                this.$hasher.remove('edit');
            }
        },
    },
    methods: {
        async getCollection (id) {
            if (id === 'newPlaylist') {
                if (!this.$hash['edit']) {
                    this.$hasher.set('edit');
                }

                this.isNew = true;
                this.collection = {
                    name: '新歌单',
                    description: '这个人很简介， 没有懒惰。',
                    playlist: this.initialSong ? [this.initialSong] : [],
                    cover: this.initialSong ? 0 : -1,
                };
                this.songsList = (await this.$ajax.getSongsSimpleAsync(this.collection.playlist)).map(
                    songInfo => ({
                        ...songInfo,
                        from: {
                            name: `歌单：${this.collection['name']}`,
                            url: this.$route.path,
                        },
                    }),
                );
                return;
            }

            this.isNew = false;
            const collection = this.collectionOfId(id);

            if (!collection) {
                this.$store.dispatch('addMessage', {
                    type: 'error',
                    content: '404咯',
                });
                this.$router.replace({
                    name: 'discover',
                });
                return;
            }

            // 拷贝一份
            this.collection = {...collection};
            this.songsList = (await this.$ajax.getSongsSimpleAsync(this.collection.playlist)).map(
                songInfo => ({
                    ...songInfo,
                    from: {
                        name: `歌单：${this.collection['name']}`,
                        url: this.$route.path,
                    },
                }),
            );
        },
        handlePlayAll () {
            if (this.isNew) {
                return;
            }
            this.$store.dispatch('playNewPlaylist', this.songsList);
        },
        handleAddToPlaylist () {
            if (this.isNew) {
                return;
            }
            this.$store.dispatch('addToPlaylist', {position: 'head', song: this.songsList});
        },
        handleClickEdit () {
            if (this.isNew) {
                return;
            }
            this.isEditing = true;
        },
        async handleConfirmEdit () {
            let msgContent = '';
            if (this.collection['name'].length === 0) {
                msgContent = '名称不可以为空';
            } else if (this.wordCountName < 0) {
                msgContent = '名称过长';
            } else if (this.wordCountDescription < 0) {
                msgContent = '简介过长';
            } else {
                if (this.isNew) {
                    // 异步提交一个新的歌单，完成后跳转到新歌单
                    // 受isNew的影响，在完成前所有按钮都为不可用，可以放心异步
                    try {
                        const id = await this.$store.dispatch('createNewCollection', {
                            name: this.collection['name'],
                            description: this.collection['description'],
                            playlist: this.songsList.map(song => song.id),
                            cover: this.collection['cover'],
                        });
                        this.$router.push({
                            name: 'collection-detail',
                            params: {id},
                        });
                    } catch (error) {
                        console.log(error);
                        this.$store.dispatch('addMessage', {
                            type: 'error',
                            content: '创建新歌单时发生错误',
                        });
                    }

                    return;
                }

                this.$store.dispatch('setCollectionName', {
                    id: this.id,
                    name: this.collection['name'],
                });
                this.$store.dispatch('setCollectionDescription', {
                    id: this.id,
                    description: this.collection['description'],
                });
                this.$store.dispatch('setCollectionPlaylist', {
                    id: this.id,
                    playlist: this.songsList.map(song => song.id),
                });
                this.isEditing = false;

                return;
            }
            this.$store.dispatch('addMessage', {
                type: 'error',
                content: msgContent,
            });
        },
        handleCancelEdit () {
            if (this.isNew) {
                this.$router.go(-1);
                return;
            }
            // 重新获得collection和songsList
            this.getCollection(this.id);
            this.isEditing = false;
        },
        // 根据hash值同步edit显示状态
        handleHashChange (hash) {
            this.isEditing = hash['edit'] === true;
            this.initialSong = ~~hash['initial'];
            if (this.initialSong && u.filterInteger(this.initialSong, 1, Infinity) !== this.initialSong) {
                console.log(this.initialSong);
                this.$hasher.remove('initial');
            }
        },
        handleSongListUpdate () {
            this.getCollection(this.id);
        },
        handleCover (index) {
            if (this.isEditing) {
                this.collection['cover'] = index;
            }
        },
        handleDelete (index) {
            if (this.isEditing) {
                // 避免Vuex警告Mutation外修改，利用songsList做临时结果
                this.songsList.splice(index, 1);
            }
        },
        handleDrop (data) {
            if (this.inspect) {
                console.log(`drop ${data.drag} to ${data.drop}`);
                if (data.drag > data.drop) {
                    this.songsList.splice(data.drop, 0, this.songsList[data.drag]);
                    this.songsList.splice(data.drag + 1, 1);
                } else {
                    this.songsList.splice(data.drop + 1, 0, this.songsList[data.drag]);
                    this.songsList.splice(data.drag, 1);
                }
            }
        },
        handleClickDelete () {
            this.showDeleteConfirm = true;
        },
        handleCloseDelete () {
            this.showDeleteConfirm = false;
        },
        handleConfirmDelete () {
            this.showDeleteConfirm = false;
            this.$store.dispatch('deleteCollection', this.id);
            this.$router.push({name: 'discover'});
        },
    },
    mounted () {
        // 此时this.$hash已经结束变化，必须手动调用一次
        this.handleHashChange(this.$hash);
        this.$hasher.bind(this.handleHashChange);
        this.getCollection(this.id);
        // 在当前歌单中把这首歌取消添加在这个歌单的情况，需要deep监视collections数组
        this.$watch('collections', () => {
            this.getCollection(this.id);
        }, {deep: true});
    },
    destroyed () {
        this.$hasher.unbind(this.handleHashChange);
    },
};
</script>

<style scoped lang="scss">
    @import "../../../styles/colors";

    .collection-detail {
        padding : 15px;

        .header {
            position : relative;

            .left, .center, .right {
                display        : inline-block;
                vertical-align : top;
            }

            .left {
                margin : 0 15px 0 20px;

                .cover {
                    width  : 120px;
                    height : 120px;
                }
            }

            .center {
                position : absolute;
                top      : 0;
                bottom   : 0;
                left     : 155px;
                right    : 85px;

                .edit-title, .edit-description {
                    p {
                        font-size   : 12px;
                        line-height : 30px;
                    }

                    .input {
                        position : absolute;
                        left     : 40px;
                        /*用于控制字符提示的颜色*/
                        color    : $gray-4;

                        &:after {
                            content     : attr(data-count);
                            position    : absolute;
                            right       : 5px;
                            bottom      : 0;
                            font-size   : 12px;
                            line-height : 30px;
                        }
                    }

                    input, textarea {
                        width         : 100%;
                        height        : 100%;
                        padding       : 0 25px 0 5px;
                        font-size     : 12px;
                        line-height   : 30px;
                        /*不受字符提示颜色的影响*/
                        color         : black;
                        border        : 1px solid $gray-3;
                        border-radius : 3px;
                        box-sizing    : border-box;
                    }
                }

                .edit-title {
                    .input {
                        top    : 0;
                        right  : 0;
                        height : 30px;
                    }
                }

                .edit-description {
                    margin-top : 30px;

                    .input {
                        bottom : 0;
                        right  : 0;
                        height : 60px;
                    }

                    textarea {
                        resize : none;

                        &::-webkit-scrollbar {
                            display : none;
                        }
                    }
                }

                .title {
                    p {
                        font-size   : 18px;
                        line-height : 30px;
                    }
                }

                .description-1, .description-2 {
                    /*description可能是空的，需要高度占位*/
                    height : 30px;

                    p {
                        font-size   : 12px;
                        line-height : 30px;
                    }
                }

                .description-1 {
                    span {
                        vertical-align : middle;
                    }

                    span + span {
                        margin-left : 20px;
                    }
                }

                .description-2 {
                    .avatar {
                        line-height : 0;
                    }

                    .link {
                        color  : $theme-invert;
                        cursor : pointer;

                        &:hover {
                            text-decoration : underline;
                        }
                    }
                }

                .button-group {
                    line-height : 30px;
                }
            }

            .right {
                float : right;

                .edit {
                    /*编辑按钮*/
                    padding       : 5px 10px;
                    border-radius : 3px;
                    text-align    : center;
                    cursor        : pointer;

                    &:hover {
                        background : $gray-1;
                    }

                    p {
                        font-size   : 12px;
                        line-height : 20px;
                    }
                }

                .button-group {
                    margin-top : 60px;

                    .button ~ .button {
                        margin-top : 10px;
                    }
                }
            }
        }

        .content {
            margin-top : 40px;
        }

        .delete {
            float      : right;
            margin-top : 10px;

            &.v-enter, &.v-leave-to {
                opacity   : 0;
                transform : translateY(50%);
            }
        }

        .delete-confirm {
            position  : fixed;
            top       : 50%;
            left      : 50%;
            transform : translate3d(-50%, -50%, 0);
            width     : 300px;
            height    : 135px;

            p {
                font-size   : 12px;
                line-height : 30px;
                white-space : normal;

                &.first {
                    margin-top : 10px;
                }
            }

            .button-group {
                text-align : right;
            }
        }
    }

</style>