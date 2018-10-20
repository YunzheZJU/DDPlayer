<template>
    <div class="fav-song">
        <PageHeader layout="image" :image-src="favSongsList.length ? favSongsList[0].imageUrl : undefined">
            <template slot="title">
                我喜欢的音乐
            </template>
            <template slot="description-1">
                <template v-if="isLogged">
                    <Thumbnail class="avatar" :src="userInfo.avatarSrc" :is-round="true" border-color="white"
                               size="20px"></Thumbnail>
                    <span>{{ userInfo.username }}</span>
                    <span>2018-09-24 创建</span>
                </template>
                <span>共{{ myFavSongs.length }}首</span>
            </template>
            <template slot="button">
                <NormalButton class="button" icon-type="play-2" :highlight="true"
                              @click.native="handlePlayAll">
                    播放全部
                </NormalButton>
                <NormalButton class="button" icon-type="plus"
                              @click.native="handleAddToPlaylist">
                    加入队列
                </NormalButton>
            </template>
        </PageHeader>
        <!--尽可能多地显示列表项，高度固定为10项-->
        <SongList class="content" :item-count="favSongsList.length" height-type="full"
                  :max-visible-item-count="Math.floor((height -  280) / 30)">
            <SongListItem v-for="(song, index) in favSongsList" :key="song.id"
                          type="entity" :song="song" :theme="index % 2 === 0 ? 'white' : 'gray'" :index="index">
            </SongListItem>
            <template slot="empty-text">
                这里，空的
            </template>
        </SongList>
    </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import SongList from '../../common/song-list.vue';
import Thumbnail from '../../common/thumbnail.vue';
import SongListItem from '../../common/song-list-item.vue';
import NormalButton from '../../common/normal-button.vue';
import PageHeader from '../../common/page-header.vue';

export default {
    name: 'fav-song',
    components: {Thumbnail, PageHeader, SongListItem, NormalButton, SongList},
    data () {
        return {
            favSongsList: [],
            myFavSongs: [],
        };
    },
    computed: {
        ...mapState([
            'userInfo',
        ]),
        ...mapGetters('favorite', [
            'favSongs',
        ]),
        ...mapGetters([
            'isLogged',
            'height',
        ]),
    },
    watch: {
        favSongs (favSongs) {
            this.myFavSongs.push(...favSongs.filter(item => !this.myFavSongs.includes(item)));
            this.getData();
        },
    },
    methods: {
        async getData () {
            this.favSongsList = (await this.$ajax.getSongsSimpleAsync(this.myFavSongs)).map(
                songInfo => ({
                    ...songInfo,
                    from: {
                        name: '我喜欢的音乐',
                        url: this.$route.path,
                    },
                }),
            );
        },
        handlePlayAll () {
            this.$store.dispatch('playNewPlaylist', this.favSongsList);
        },
        handleAddToPlaylist () {
            this.$store.dispatch('addToPlaylist', {position: 'head', song: this.favSongsList});
        },
    },
    mounted () {
        this.favSongs.forEach(item => {
            if (!this.myFavSongs.includes(item)) {
                this.myFavSongs.push(item);
            }
        });
        this.getData();
    },
};
</script>

<style scoped lang="scss">
    .fav-song {
        padding : 15px;

        .avatar {
            line-height : 0;
        }

        .content {
            margin-top : 40px;
        }
    }
</style>