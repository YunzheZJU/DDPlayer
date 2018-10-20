<template>
    <div class="playlist">
        <PageHeader layout="icon" icon-type="playlist-1">
            <template slot="title">
                播放队列
            </template>
            <template slot="description">
                {{ playlist.length || '0' }} 首歌曲
            </template>
        </PageHeader>
        <div class="playlist-indicator">
            <!--作用有点微妙，要不在这里记录一下持续听歌时间？-->
            <p v-if="played.length">
                向上滚动回忆 {{ played.length }} 首听过的歌
            </p>
            <p v-else>
                还没有听完一首歌呢
            </p>
        </div>
        <!--尽可能多地显示列表项，高度固定为13项-->
        <SongList class="playlist-song-list" height-type="full" :can-delete="true" :item-count="listItemCount"
                  :hidden-item-count="played.length" :max-visible-item-count="Math.floor((height -  220) / 30)">
            <SongListItem v-for="(song, index) in played" :key="`played-${song.id}`"
                          type="entity" :song="song" theme="dark" playlist-type="played" :index="index">
            </SongListItem>
            <SongListItem v-for="(song, index) in playlist" :key="`playlist-${song.id}`"
                          type="entity" :song="song" :theme="index %2 === 0 ? 'white' : 'gray'" playlist-type="playlist"
                          :index="index">
            </SongListItem>
            <template slot="empty-text">
                播放队列空空如也~
            </template>
        </SongList>
        <NormalButton class="playlist-clear" icon-type="clear" @click.native="handleClickClear">
            清空…
        </NormalButton>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import SongList from '../../common/song-list.vue';
import SongListItem from '../../common/song-list-item.vue';
import NormalButton from '../../common/normal-button.vue';
import PageHeader from '../../common/page-header.vue';

export default {
    name: 'playlist',
    components: {NormalButton, SongListItem, SongList, PageHeader},
    computed: {
        ...mapGetters('playlist', [
            'played',
            'playlist',
            'noPlaying',
        ]),
        ...mapGetters([
            'height',
        ]),
        listItemCount () {
            return this.played.length + this.playlist.length;
        },
    },
    methods: {
        handleClickClear () {
            // 应该是弹窗询问清多少的
            // 清除playlist之后会遗留一个played，所以应先清除playlist
            this.$store.dispatch('clearPlaylist');
            this.$store.dispatch('clearPlayed');
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../../styles/colors";

    .playlist {
        padding : 20px 15px 0 15px;

        &-indicator {
            color       : $gray-4;
            font-size   : 12px;
            line-height : 20px;
            text-align  : right;
        }

        &-clear {
            float      : right;
            margin-top : 10px;
        }
    }

</style>