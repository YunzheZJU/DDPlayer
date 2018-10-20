<template>
    <div class="artist-detail">
        <PageHeader layout="image" :imageSrc="artist.imageUrl">
            <template slot="title">
                {{ artist.name }}
            </template>
            <template slot="title-sub">
                名字和职业
            </template>
            <template slot="description-1">
                <span>作品数</span>
                <span>专辑数</span>
                <span>歌曲数</span>
            </template>
            <template slot="description-2">
                <!--组合信息（可能为空）-->
            </template>
            <template slot="button">
                <NormalButton class="button" :icon-type="`light-${isFavorite ? '2' : '1'}`"
                              :highlight="true" :active="isFavorite"
                              @click.native="handleClickFav">
                    <template v-if="!isFavorite">
                        立即加推
                    </template>
                    <template v-else>
                        已加推
                    </template>
                </NormalButton>
                <NormalButton class="button" icon-type="share">
                    分享
                </NormalButton>
            </template>
        </PageHeader>
        <ShowArea class="song-list">
            <template slot="title">
                热门歌曲
            </template>
            <SongListItemV class="song-list-item" slot="content" v-for="(song, index) in songs" :key="index"
                           :song="song">
            </SongListItemV>
        </ShowArea>
        <ShowArea class="album-list">
            <template slot="title">
                专辑
            </template>
            <AlbumListItem class="album-list-item" slot="content" v-for="(album, index) in albums" :key="index"
                           :album="album"></AlbumListItem>
        </ShowArea>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import SongListItemV from '../../common/song-list-item-v.vue';
import ShowArea from '../../common/show-area.vue';
import NormalButton from '../../common/normal-button.vue';
import AlbumListItem from '../../common/album-list-item.vue';
import PageHeader from '../../common/page-header.vue';

export default {
    name: 'artist-detail',
    components: {SongListItemV, ShowArea, AlbumListItem, PageHeader, NormalButton},
    props: ['id'],
    data () {
        return {
            artist: {},
            songs: [],
            albums: [],
            inspect: true,
        };
    },
    watch: {
        id () {
            this.getArtist();
        },
    },
    computed: {
        ...mapGetters('favorite', [
            'favArtists',
        ]),
        isFavorite () {
            return this.favArtists.includes(this.artist['id']);
        },
    },
    methods: {
        async getArtist () {
            this.artist = (await this.$ajax.getArtistsFullAsync(this.id))[0];

            // 假装获得了热门歌曲和专辑列表，其实用了最近添加的数据
            const getSongsInfo = this.$ajax.getRecentSongsFullAsync(5);
            const getAlbumsInfo = this.$ajax.getRecentAlbumsFullAsync(6);
            const [songsInfo, albumsInfo] = await Promise.all([getSongsInfo, getAlbumsInfo]);

            this.songs = songsInfo.map(info => ({
                ...info,
                from: {
                    name: `歌手：${this.artist.name}`,
                    url: this.$route.path,
                },
            }));
            this.albums = albumsInfo;
        },
        handleClickFav () {
            if (this.isFavorite) {
                this.$store.dispatch('removeFavArtist', this.artist['id']);
            } else {
                this.$store.dispatch('addFavArtist', this.artist['id']);
            }
        },
    },
    mounted () {
        this.getArtist();
    },
};
</script>

<style scoped lang="scss">
    .artist-detail {
        padding : 15px;

        .song-list {
            margin : 35px 0 0 20px;

            &-item + .song-list-item {
                margin-left : 20px;
            }
        }

        .album-list {
            margin : 35px 0 0 20px;

            &-item + .album-list-item {
                margin-left : 20px;
            }
        }
    }
</style>