<template>
    <div class="fav-artist">
        <PageHeader layout="icon" icon-type="light-2" :can-edit="true" @edit="handleClickEdit">
            <template slot="title">
                我加推的歌手
            </template>
            <template slot="description">
                共 {{ favArtists.length }} 位，{{ bestArtist === 0 ? '没有主推' : '主推 1 位' }}，加推不能等
            </template>
        </PageHeader>
        <div class="fav-artist-best">
            <div class="fav-artist-best-title">
                <p>
                    主推
                    <span class="sub-title">
                        <template v-if="bestArtistData">
                            我永远喜欢{{ bestArtistData['name'] }}
                        </template>
                        <template v-else>
                            还没有确定主推呢
                        </template>
                    </span>
                </p>
            </div>
            <div class="fav-artist-best-content">
                <ul>
                    <ArtistListItem class="fav-artist-best-item" :artist="bestArtistData" v-if="bestArtistData">
                    </ArtistListItem>
                    <li class="empty" v-else>
                        <p>空空如也</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fav-artist-all">
            <div class="fav-artist-all-title">
                <p>
                    全部
                    <span class="sub-title">
                    排名不分先后
                </span>
                </p>
            </div>
            <ArtistList class="fav-artist-all-content" :style="scrollStyles">
                <ArtistListItem class="fav-artist-all-item" v-for="(artist, index) in favArtistsData" :key="index"
                                :artist="artist">
                </ArtistListItem>
                <li class="empty" v-if="favArtistsData.length === 0">
                    <p>空空如也</p>
                </li>
            </ArtistList>
        </div>
        <DialogBox class="fav-artist-edit" :style="editStyles" v-show="showEdit" @close="handleCloseEdit"
                   @keypress.native.enter="handleConfirmEdit" v-click-outside="handleCloseEdit">
            <Icon slot="title-icon" type="edit" size="sm"></Icon>
            <template slot="title">
                <span>我的加推清单</span>
            </template>
            <template slot="content-top">
                <div class="edit-list">
                    <div class="title">
                        <div class="artist">
                            <p>歌手</p>
                        </div>
                        <div class="fav">
                            <p>加推</p>
                        </div>
                        <div class="best">
                            <p title="主推只能选一个喔">主推</p>
                        </div>
                    </div>
                    <ScrollArea :style="listStyles">
                        <div class="item" v-for="(artist, index) in favArtistsData" :key="index">
                            <div class="artist">
                                <Thumbnail class="artist-thumbnail" :is-round="true" border-color="#e1e5e6" size="25px"
                                           :src="artist.imageUrl"></Thumbnail>
                                <p>{{ artist['name'] }}</p>
                            </div>
                            <div class="fav">
                                <label>
                                    <input type="checkbox" v-model="myFavArtists" :value="artist['id']"
                                           :title="`加推${artist['name']}`" :id="`list-fav-${artist['id']}`">
                                </label>
                            </div>
                            <div class="best">
                                <label>
                                    <input type="radio" v-model="myBestArtist" :value="artist['id']"
                                           :disabled="!myFavArtists.includes(artist['id'])"
                                           :title="`主推${artist['name']}`" :id="`list-best-${artist['id']}`">>
                                </label>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </template>
            <template slot="content-bottom">
                <div class="button-group">
                    <NormalButton class="button" icon-type="edit" :active="true" @click.native="handleConfirmEdit">
                        保存
                    </NormalButton>
                    <NormalButton class="button" icon-type="cancel" @click.native="handleCloseEdit">
                        放弃
                    </NormalButton>
                </div>
            </template>
        </DialogBox>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import ArtistList from '../../common/artist-list.vue';
import ClickOutside from '../../../directives/clickoutside';
import Thumbnail from '../../common/thumbnail.vue';
import Icon from '../../common/icon.vue';
import NormalButton from '../../common/normal-button.vue';
import ArtistListItem from '../../common/artist-list-item.vue';
import PageHeader from '../../common/page-header.vue';
import ScrollArea from '../../common/scroll-area.vue';
import DialogBox from '../../common/dialog-box.vue';

export default {
    name: 'fav-artist',
    components: {ArtistList, Thumbnail, Icon, DialogBox, ScrollArea, PageHeader, ArtistListItem, NormalButton},
    directives: {ClickOutside},
    data () {
        return {
            maxItemCount: 6,
            favArtistsData: [],
            showEdit: false,
            myFavArtists: [],
            myBestArtist: undefined,
            inspect: false,
        };
    },
    computed: {
        ...mapGetters('favorite', [
            'favArtists',
            'bestArtist',
        ]),
        ...mapGetters([
            'height',
        ]),
        bestArtistData () {
            return this.favArtistsData.filter(item => item['id'] === this.bestArtist)[0];
        },
        editStyles () {
            return {
                height: `${this.favArtists.length * 40 + 110}px`,
                maxHeight: `${this.maxItemCount * 40 + 110}px`,
            };
        },
        listStyles () {
            return {
                height: `${this.favArtists.length * 40}px`,
                maxHeight: `${this.maxItemCount * 40}px`,
            };
        },
        scrollStyles () {
            return {
                height: `${this.height - 370}px`,
            };
        },
    },
    watch: {
        favArtists () {
            this.updateMyFavArtists();
            this.getData();
        },
        bestArtist () {
            this.myBestArtist = this.bestArtist;
        },
        showEdit (value) {
            if (value) {
                this.$hasher.set('edit');
            } else {
                this.$hasher.remove('edit');
            }
        },
    },
    methods: {
        async getData () {
            this.favArtistsData = await this.$ajax.getArtistsFullAsync(this.myFavArtists);
        },
        handleClickEdit () {
            this.showEdit = true;
        },
        handleCloseEdit () {
            this.showEdit = false;
        },
        handleConfirmEdit () {
            // 提交更改
            // 过滤出被删去的元素
            const toRemove = this.favArtists.filter(id => !this.myFavArtists.includes(id)).sort((a, b) => a < b);
            // 然后按逆序从favArtists里删去，否则在删去前面的元素之后索引将变得不准确
            for (let i = toRemove.length - 1; i >= 0; i--) {
                this.$store.dispatch('removeFavArtist', toRemove[i]);
                if (this.inspect) {
                    console.log(`Removing ${toRemove[i]}`);
                }
            }
            if (this.myFavArtists.includes(this.myBestArtist)) {
                this.$store.dispatch('setBestArtist', this.myBestArtist);
            } else {
                this.$store.dispatch('setBestArtist', 0);
            }
            this.showEdit = false;
        },
        // 根据hash值同步edit显示状态
        handleHashChange (hash) {
            this.showEdit = hash['edit'] === true;
        },
        updateMyFavArtists () {
            this.myFavArtists.push(...this.favArtists.filter(item => !this.myFavArtists.includes(item)));
        },
    },
    mounted () {
        this.updateMyFavArtists();
        this.myBestArtist = this.bestArtist;
        this.getData();
        this.$hasher.bind(this.handleHashChange);
        this.handleHashChange(this.$hash);
    },
    destroyed () {
        this.$hasher.unbind(this.handleHashChange);
    },
};
</script>

<style scoped lang="scss">
    @import "../../../styles/colors";

    .fav-artist {
        padding : 20px 15px 0 15px;

        &-best, &-all {
            margin : 15px 20px 0 20px;

            .empty {
                height : 140px;

                p {
                    color       : $gray-4;
                    font-size   : 12px;
                    line-height : 50px;
                }
            }

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

            &-item {
                margin : 10px 30px 0 0;
            }
        }

        /*&-all-content {*/
            /*height        : 280px;*/
            /*border-bottom : 1px solid $gray-3;*/
        /*}*/

        &-edit {
            position  : absolute;
            top       : 50%;
            left      : 50%;
            transform : translate3d(-50%, -50%, 0);
            width     : 250px;

            .edit-list {
                margin-top : 10px;
                max-height : 360px;

                .title, .item {

                    .artist, .fav, .best {
                        vertical-align : middle;
                    }

                    .artist {
                        display      : inline-block;
                        width        : 60%;
                        padding-left : 5px;
                        box-sizing   : border-box;

                        &-thumbnail {
                            float        : left;
                            margin-right : 5px;
                            line-height  : 40px;
                        }
                    }

                    .fav, .best {
                        text-align : center;
                    }

                    .fav {
                        display : inline-block;
                        width   : 20%;
                    }

                    .best {
                        display         : inline-block;
                        width           : 20%;
                        text-decoration : underline;
                    }
                }

                .title {
                    background : $gray-1;

                    .best {
                        cursor : help;
                    }

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
                    }
                }
            }

            .button-group {
                text-align : right;
            }
        }
    }
</style>