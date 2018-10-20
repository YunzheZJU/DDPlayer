<template>
    <li class="artist-list-item">
        <router-link :to="{name: 'artist-detail', params: {id: artist.id}}">
            <Thumbnail :src="artist.imageUrl" size="100px" border-color="#e1e5e6" :is-round="true">
            </Thumbnail>
        </router-link>
        <div class="artist-list-item-title">
            <p>
                <router-link :to="{name: 'artist-detail', params: {id: artist.id}}">
                    <span v-html="matchKeywords(artist.name)"></span>
                </router-link>
                <span class="fav-icon" @click="handleClickFav">
                    <Icon :type="`light-${isFavorite ? '2' : '1'}`" size="sm" :color="isFavorite ? 'theme' : 'inherit'">
                    </Icon>
                </span>
            </p>
        </div>
    </li>
</template>

<script>
import {mapGetters} from 'vuex';
import Icon from './icon.vue';
import Thumbnail from './thumbnail.vue';

export default {
    name: 'artist-list-item',
    components: {Icon, Thumbnail},
    props: {
        artist: {
            type: Object,
            required: true,
        },
        highlight: {
            type: String,
        },
        index: {
            type: Number,
            default: 0,
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
        handleClickFav () {
            if (this.isFavorite) {
                this.$store.dispatch('removeFavArtist', this.artist['id']);
            } else {
                this.$store.dispatch('addFavArtist', this.artist['id']);
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

    .artist-list-item {
        display  : inline-block;
        position : relative;

        &-title {
            text-align : center;
            color      : $gray-6;

            p {
                font-size   : 12px;
                line-height : 30px;
            }

            .fav-icon {
                color  : $gray-4;
                cursor : pointer;

                &:hover {
                    color : $theme;
                }
            }
        }

        &:hover {
            border-radius: 50px 50px 0 0;
            background : $gray-1;
        }
    }
</style>