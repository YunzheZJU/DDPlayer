<template>
    <div class="album-detail" v-if="album.id">
        <PageHeader layout="disk" :imageSrc="album.imageUrl" :is-bold-title="true">
            <template slot="title">
                {{ album.title }}
            </template>
            <template slot="description-1">
                歌手：
                <!--数据驱动-->
                <template v-for="(artist, index) in album['simpleArtistInfos']">
                    <router-link :to="{name: 'artist-detail', params: {id: artist.id}}" :key="index"
                                 :title="artist.name" class="highlight">
                        {{ artist.name }}
                    </router-link>
                    <template v-if="index !== album['simpleArtistInfos'].length - 1">
                        /
                    </template>
                </template>
            </template>
            <template slot="description-2">
                发行：
                <template>
                    {{ album.releaseDate }}
                </template>
            </template>
            <template slot="button">
                <NormalButton class="button" title="收藏专辑" icon-type="disk-1" :highlight="true" :active="isFavorite"
                              @click.native="handleClickFav">
                    <template v-if="!isFavorite">
                        收藏专辑
                    </template>
                    <template v-else>
                        已收藏
                    </template>
                </NormalButton>
                <NormalButton class="button" icon-type="play-2"
                              @click.native="handlePlayAll">
                    播放全部
                </NormalButton>
                <NormalButton class="button" icon-type="plus"
                              @click.native="handleAddToPlaylist">
                    加入队列
                </NormalButton>
                <NormalButton class="button" icon-type="share">
                    分享
                </NormalButton>
            </template>
        </PageHeader>
        <!--尽可能少地显示列表项，最大10行高度-->
        <SongList class="content" :item-count="songs.length" height-type="fit"
                  :max-visible-item-count="Math.floor((height -  220) / 30)">
            <SongListItem v-for="(song, index) in songs" :key="index"
                          type="entity" :song="song" :theme="index % 2 === 0 ? 'white' : 'gray'" :index="index">
            </SongListItem>
            <template slot="empty-text">
                正在加载……
            </template>
        </SongList>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import SongListItem from '../../common/song-list-item.vue';
import NormalButton from '../../common/normal-button.vue';
import SongList from '../../common/song-list.vue';
import PageHeader from '../../common/page-header.vue';

export default {
    name: 'album-detail',
    components: {PageHeader, SongListItem, NormalButton, SongList},
    props: ['id'],
    data () {
        return {
            album: {},
            songs: [],
            inspect: false,
        };
    },
    watch: {
        id () {
            this.getAlbum();
        },
    },
    computed: {
        ...mapGetters('favorite', [
            'favAlbums',
        ]),
        ...mapGetters([
            'height',
        ]),
        isFavorite () {
            return this.favAlbums.includes(this.album['id']);
        },
    },
    methods: {
        async getAlbum () {
            const getAlbumsInfo = this.$ajax.getAlbumsFullAsync(this.id);
            const getSongsInfo = this.$ajax.getAlbumSongsSimpleAsync(this.id);
            const [albumsInfo, songsInfo] = await Promise.all([getAlbumsInfo, getSongsInfo]);
            this.album = albumsInfo[0];
            if (this.inspect) {
                console.log(this.album);
            }
            this.songs = songsInfo.map(
                songInfo => ({
                    ...songInfo,
                    from: {
                        name: this.album.title,
                        url: this.$route.path,
                    },
                }),
            );
            if (this.inspect) {
                console.log(this.songs);
            }
        },
        handleClickFav () {
            if (this.isFavorite) {
                this.$store.dispatch('removeFavAlbum', this.album['id']);
            } else {
                this.$store.dispatch('addFavAlbum', this.album['id']);
            }
        },
        handlePlayAll () {
            this.$store.dispatch('playNewPlaylist', this.songs);
        },
        handleAddToPlaylist () {
            this.$store.dispatch('addToPlaylist', {position: 'head', song: this.songs});
        },
    },
    mounted () {
        this.getAlbum();
    },
};
</script>

<style scoped lang="scss">
    .album-detail {
        padding : 15px;

        .content {
            margin-top : 35px;
        }
    }
</style>