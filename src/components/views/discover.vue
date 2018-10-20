<template>
    <div class="discover">
        <PageHeader layout="icon" icon-type="logo">
            <template slot="title">
                发现新音乐·加推
            </template>
            <template slot="description">
                欢迎来到DD Music
            </template>
        </PageHeader>
        <ScrollArea class="discover-scroll" :style="scrollStyles">
            <ShowArea class="artist-list">
                <template slot="title">
                    立即加推
                </template>
                <ArtistListItem class="artist-list-item" slot="content" v-for="(artist, index) in artists" :key="index"
                                :artist="artist"></ArtistListItem>
            </ShowArea>
            <ShowArea class="album-list">
                <template slot="title">
                    最新收录
                </template>
                <AlbumListItem class="album-list-item" slot="content" v-for="(album, index) in albums" :key="index"
                               :album="album"></AlbumListItem>
            </ShowArea>
            <ShowArea class="song-list">
                <template slot="title">
                    为你推荐
                </template>
                <SongListItemV class="song-list-item" slot="content" v-for="(song, index) in songs" :key="index"
                               :song="song">
                </SongListItemV>
            </ShowArea>
        </ScrollArea>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import PageHeader from '../common/page-header.vue';
import ScrollArea from '../common/scroll-area.vue';
import ShowArea from '../common/show-area.vue';
import ArtistListItem from '../common/artist-list-item.vue';
import AlbumListItem from '../common/album-list-item.vue';
import SongListItemV from '../common/song-list-item-v.vue';

export default {
    name: 'discover',
    components: {ArtistListItem, SongListItemV, ShowArea, AlbumListItem, ScrollArea, PageHeader},
    data () {
        return {
            artists: [],
            songs: [],
            albums: [],
            inspect: false,
        };
    },
    computed: {
        ...mapGetters([
            'height',
        ]),
        scrollStyles () {
            return {
                height: `${this.height - 120}px`,
            };
        },
    },
    methods: {
        async getData () {
            const getRecentArtistsInfo = this.$ajax.getRecentArtistsFullAsync(6);
            const getRecentAlbumsInfo = this.$ajax.getRecentAlbumsFullAsync(6);
            const getRecentSongsInfo = this.$ajax.getRecentSongsFullAsync(5);
            const [artistsInfo, albumsInfo, songsInfo] = await Promise.all(
                [getRecentArtistsInfo, getRecentAlbumsInfo, getRecentSongsInfo],
            );
            this.artists = artistsInfo;
            this.albums = albumsInfo;
            this.songs = songsInfo.map(info => ({
                ...info,
                from: {
                    name: '发现新音乐',
                    url: this.$route.path,
                },
            }));
        },
    },
    mounted () {
        this.getData();
    },
};
</script>

<style scoped lang="scss">
    .discover {
        padding : 20px 15px 0 15px;

        &-scroll {
            .artist-list {
                margin : 35px 20px 0 20px;
                /*防止没有数据时高度塌陷*/
                height : 170px;

                &-item + .artist-list-item {
                    margin-left : 40px;
                }
            }

            .album-list {
                margin : 35px 20px 0 20px;
                /*防止没有数据时高度塌陷*/
                height : 205px;

                &-item + .album-list-item {
                    margin-left : 20px;
                }
            }

            .song-list {
                margin : 35px 20px 20px 20px;
                /*防止没有数据时高度塌陷*/
                height : 111px;

                &-item + .song-list-item {
                    margin-left : 20px;
                }
            }
        }
    }
</style>