<template>
    <!--专用于show-area中的歌曲信息展示块-->
    <li class="song-list-v">
        <Thumbnail class="cover" size="70px" :src="song.imageUrl" border-color="#e1e5e6"
                   @click.native="handleClickPlay">
        </Thumbnail>
        <div class="title" @click="handleClickPlay">
            <p v-title>
                {{ song.title }}
            </p>
        </div>
        <div class="album">
            <router-link :to="{name: 'album-detail', params: {id: song['simpleAlbumInfo'].id}}">
                <p v-title>
                    {{ song.album }}
                </p>
            </router-link>
        </div>
        <div class="action">
            <p>
                <Icon :type="`favorite-${isFavorite ? '2' : '1'}`" size="xs"
                      :color="isFavorite ? 'theme' : 'inherit'" class="action-icon" title="收藏歌曲"
                      @click.native.stop="handleClickFav"></Icon>
                <Icon type="play-2" size="xs" class="action-icon" title="立即播放"
                      @click.native.stop="handleClickPlay"></Icon>
                <Icon type="plus" size="xs" class="action-icon" title="添加到歌单"
                      @click.native.stop="handleClickAdd"></Icon>
            </p>
        </div>
        <div class="duration">
            <p v-title>
                {{ song.durationFmt }}
            </p>
        </div>
    </li>
</template>

<script>
import {mapGetters} from 'vuex';
import Title from '../../directives/title.js';
import Icon from './icon.vue';
import Thumbnail from './thumbnail.vue';

export default {
    name: 'song-list-item-v',
    components: {Thumbnail, Icon},
    directives: {Title},
    props: {
        song: {
            type: Object,
            required: true,
        },
    },
    data () {
        return {
            inspect: true,
        };
    },
    computed: {
        ...mapGetters('favorite', [
            'favSongs',
        ]),
        isFavorite () {
            return this.favSongs.includes(this.song['id']);
        },
    },
    methods: {
        handleClickFav () {
            if (this.inspect) {
                console.log('fav icon is clicked');
            }
            if (this.isFavorite) {
                this.$store.dispatch('removeFavSong', this.song['id']);
            } else {
                this.$store.dispatch('addFavSong', this.song['id']);
            }
        },
        handleClickPlay () {
            if (this.inspect) {
                console.log('play icon is clicked');
            }
            this.$store.dispatch('playNewSong', this.song);
        },
        handleClickAdd () {
            // Pass
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .song-list-v {
        display : inline-block;
        width   : 210px;

        p {
            color       : $gray-6;
            font-size   : 12px;
            line-height : 20px;
        }

        .thumbnail {
            float        : left;
            margin-right : 10px;
            cursor       : pointer;
        }

        .title, .album, .duration {
            &:hover p {
                color : black;
            }
        }

        .title {
            height   : 30px;
            overflow : hidden;
            cursor   : pointer;

            p {
                line-height : 15px;
                white-space : normal;
                word-break  : break-all;
            }
        }

        .action {
            display    : inline-block;
            float      : right;
            box-sizing : border-box;

            p {
                font-size : 0;
            }

            &-icon {
                display      : inline-block;
                color        : $gray-4;
                cursor       : pointer;
                border       : solid transparent;
                border-width : 0 3px;
                &:hover {
                    color : $gray-6;
                }
            }
        }

        &:hover {
            background : $gray-1;
        }
    }
</style>