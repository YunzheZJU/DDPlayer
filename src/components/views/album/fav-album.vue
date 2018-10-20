<template>
    <div class="fav-album">
        <PageHeader layout="icon" icon-type="disk-1">
            <template slot="title">
                我收藏的专辑
            </template>
            <template slot="description">
                {{ myFavAlbums.length }} 张专辑
            </template>
        </PageHeader>
        <AlbumList class="fav-album-list" :style="listStyles">
            <AlbumListItem class="fav-album-list-item" v-for="(album, index) in favAlbumsList" :key="index"
                           :album="album" :index="index">
            </AlbumListItem>
        </AlbumList>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import AlbumList from '../../common/album-list.vue';
import AlbumListItem from '../../common/album-list-item.vue';
import PageHeader from '../../common/page-header.vue';

export default {
    name: 'fav-album',
    components: {PageHeader, AlbumListItem, AlbumList},
    data () {
        return {
            favAlbumsList: [],
            myFavAlbums: [],
        };
    },
    computed: {
        ...mapGetters('favorite', [
            'favAlbums',
        ]),
        ...mapGetters([
            'height',
        ]),
        listStyles () {
            return {
                height: `${this.height -  160}px`,
            };
        },
    },
    watch: {
        favAlbums (favAlbums) {
            this.myFavAlbums.push(...favAlbums.filter(item => !this.myFavAlbums.includes(item)));
            this.getData();
        },
    },
    methods: {
        async getData () {
            this.favAlbumsList = await this.$ajax.getAlbumsFullAsync(this.myFavAlbums);
        },
    },
    mounted () {
        this.favAlbums.forEach(item => {
            if (!this.myFavAlbums.includes(item)) {
                this.myFavAlbums.push(item);
            }
        });
        this.getData();
    },
};
</script>

<style scoped lang="scss">
    .fav-album {
        padding : 20px 15px 0 15px;

        &-list {
            margin-left : 20px;

            &-item {
                margin : 15px 15px 0 0;
            }
        }
    }

</style>