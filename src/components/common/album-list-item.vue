<template>
    <li class="album-list-item">
        <router-link :to="{name: 'album-detail', params: {id: album.id}}">
            <DiskCase class="image" :src="album.imageUrl"></DiskCase>
        </router-link>
        <div class="text">
            <router-link :to="{name: 'album-detail', params: {id: album.id}}">
                <p class="title" :title="album.title" v-html="matchKeywords(album.title)"></p>
            </router-link>
            <p class="artist" :title="album.artist.join(' / ')">
                {{ album.artist.join(' / ') }}
            </p>
            <p class="date" :title="album.releaseDate">
                {{ album.releaseDate }}
            </p>
        </div>
        <div class="fav-album" @click="handleClickFav">
            <Icon :type="isFavorite ? 'disk-1' : 'disk-2'" size="sm" :color="isFavorite ? 'theme' : 'inherit'"></Icon>
        </div>
    </li>
</template>

<script>
import {mapGetters} from 'vuex';
import Icon from './icon.vue';
import DiskCase from './disk-case.vue';

export default {
    name: 'album-list-item',
    components: {DiskCase, Icon},
    props: {
        album: {
            type: Object,
            required: true,
        },
        highlight: {
            type: String,
        },
    },
    computed: {
        ...mapGetters('favorite', [
            'favAlbums',
        ]),
        isFavorite () {
            return this.favAlbums.includes(this.album['id']);
        },
    },
    methods: {
        handleClickFav () {
            if (this.isFavorite) {
                this.$store.dispatch('removeFavAlbum', this.album['id']);
            } else {
                this.$store.dispatch('addFavAlbum', this.album['id']);
            }
        },
        matchKeywords (string) {
            if (this.highlight) {
                return string.replace(new RegExp(`(${this.highlight})`, 'g'), '<span class="highlight">$1</span>');
            } else {
                return string;
            }
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .album-list-item {
        display    : inline-block;
        position   : relative;
        width      : 120px;
        height     : 165px;
        box-sizing : border-box;

        .image {
            width  : 120px;
            height : 106px;
            cursor : pointer;
        }

        .text {

            .title {
                font-size : 12px;
                color     : $gray-6;
                cursor    : pointer;

                &:hover {
                    color : black;
                }
            }

            .artist, .date {
                font-size : 10px;
                color     : $gray-5;

                &:hover {
                    color : black;
                }
            }

            p {
                line-height   : 20px;
                padding-right : 20px;
            }
        }

        .fav-album {
            position : absolute;
            bottom   : 0;
            right    : 0;
            width    : 12px;
            height   : 12px;
            padding  : 4px;
            color    : $gray-4;
            cursor   : pointer;

            &:hover {
                color : $theme;
            }
        }

        &:hover {
            background : $gray-1;
        }
    }
</style>