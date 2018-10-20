<template>
    <div class="info-board">
        <div class="icon" title="喜欢" v-show="!noPlaying"
             @click="handleClickLike">
            <Icon
                    :type="`favorite-${isFavorite ? '2' : '1'}`"
                    size="sm"
                    :class="iconClasses"></Icon>
        </div>
        <div class="info" title="显示单曲页" v-show="!noPlaying"
             @click="handleClickInfo">
            <p class="title" :title="playing.title">
                {{ noPlaying ? '' : playing.title }}
            </p>
            <p class="artist" :title="noPlaying ? '' : playing.artist.join(' / ')">
                {{ noPlaying ? '' : playing.artist.join(' / ') }}
            </p>
            <p class="album" :title="playing.album">
                {{ noPlaying ? '' : playing.album }}
            </p>
        </div>
        <div class="placeholder" v-show="noPlaying">
            <p>没有正在播放的歌曲</p>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Icon from '../common/icon.vue';

export default {
    name: 'info-board',
    components: {Icon},
    computed: {
        ...mapGetters('playlist', [
            'playing',
            'noPlaying',
        ]),
        ...mapGetters([
            'isFavorite',
        ]),
        iconClasses () {
            return [
                this.isFavorite ? 'color-theme' : '',
            ];
        },
    },
    methods: {
        handleClickInfo () {
            this.$emit('single');
        },
        handleClickLike () {
            if (this.noPlaying) {
                return;
            }
            if (this.isFavorite) {
                this.$store.dispatch('removeFavSong', this.playing.id);
            } else {
                this.$store.dispatch('addFavSong', this.playing.id);
            }
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .info-board {
        height     : 75px;
        padding    : 15px 10px 0 10px;
        box-sizing : border-box;
    }

    .color-theme {
        color : $theme;
    }

    .icon {
        margin : 18px 5px;
        float  : left;
        border : transparent solid 5px;
        color  : $gray-5;
        cursor : pointer;
    }

    .info {
        /*在浮动元素上设置margin即可*/
        /*margin-left   : 34px;*/
        /*overflow为内部提供BFC，与外界隔离*/
        overflow      : hidden;
        padding-right : 5px;
        color         : $gray-5;
        font-size     : 12px;
        line-height   : 20px;
        cursor        : pointer;
    }

    .title {
        color : $gray-6;
        font-size     : 14px;
    }

    .placeholder {
        color         : $gray-6;
        font-size     : 12px;
        line-height   : 60px;
        text-align: center;
    }
</style>