<template>
    <!--由父级提供多个SongListItem，设置最高显示项数和当前显示项数
    同时尽可能将hiddenCount数量的列表项滚出可视区-->
    <div class="song-list">
        <SongListItem class="song-list-header" type="header"></SongListItem>
        <ScrollArea class="song-list-body" :style="bodyStyles" :initial-scroll="30 * hiddenItemCount">
            <transition-group tag="ul">
                <slot></slot>
            </transition-group>
            <div class="song-list-empty" v-if="itemCount === 0">
                <p>
                    <slot name="empty-text"></slot>
                </p>
            </div>
        </ScrollArea>
        <FloatBox class="song-list-menu" :draw-triangle="false" direction="none" :style="menuStyles"
                  v-click-outside="handleClickOutside">
            <FloatBoxItem :can-hover="true" :icon="true" :tight="false" @click.native="handleClickPlay">
                <Icon slot="icon" type="play-2" size="xs"></Icon>
                <div slot="content">播放（Ctrl + P）</div>
            </FloatBoxItem>
            <FloatBoxItem :can-hover="true" :icon="true" :tight="false" @click.native="handleClickNext">
                <Icon slot="icon" type="play-3" size="xs"></Icon>
                <div slot="content">下一首播放</div>
            </FloatBoxItem>
            <FloatBoxItem :can-hover="true" :icon="true" :tight="false" @click.native="handleClickAdd">
                <Icon slot="icon" type="plus" size="xs"></Icon>
                <div slot="content">添加到歌单</div>
            </FloatBoxItem>
            <FloatBoxItem v-if="canDelete" class="clear" :can-hover="true" :icon="true" :tight="false"
                          @click.native="handleClickDelete">
                <Icon slot="icon" type="clear" size="xs"></Icon>
                <div slot="content">删除（Delete）</div>
            </FloatBoxItem>
        </FloatBox>
    </div>
</template>

<script>
import ClickOutside from '../../directives/clickoutside';
import Icon from './icon.vue';
import FloatBox from './float-box.vue';
import FloatBoxItem from './float-box-item.vue';
import ScrollArea from './scroll-area.vue';
import SongListItem from './song-list-item.vue';

export default {
    name: 'song-list',
    components: {SongListItem, ScrollArea, FloatBoxItem, FloatBox, Icon},
    directives: {ClickOutside},
    props: {
        // 影响右键菜单行为
        canDelete: {
            type: Boolean,
            default: false,
        },
        // 真实传入的项数，影响空列表缺省项显示
        itemCount: {
            type: Number,
            required: true,
        },
        // 最多隐藏项数，影响列表初始滚动
        hiddenItemCount: {
            type: Number,
            default: 0,
        },
        // 最多显示项数，影响列表真实高度
        maxVisibleItemCount: {
            type: Number,
            default: 10,
        },
        heightType: {
            type: String,
            default: 'fit',
            validator: value => ['fit', 'full'].includes(value),
        },
    },
    data () {
        return {
            songFocused: {},
            menuLeft: 0,
            menuTop: 0,
            showMenu: false,
            inspect: false,
        };
    },
    computed: {
        visibleItemCount () {
            if (this.heightType === 'full') {
                return this.maxVisibleItemCount;
            } else if (this.heightType === 'fit') {
                return Math.min(Math.max(this.itemCount, 1), this.maxVisibleItemCount);
            }
        },
        menuStyles () {
            return {
                left: `${this.menuLeft}px`,
                top: `${this.menuTop}px`,
                display: this.showMenu ? 'initial' : 'none',
            };
        },
        bodyStyles () {
            return {
                // 最小高度为1项，用来显示空列表的缺省项
                // 最大高度为maxItemVisible项
                height: `${this.visibleItemCount * 30}px`,
            };
        },
    },
    methods: {
        handleMenu (event, song) {
            this.songFocused = song;
            // JS单线程执行，先改位置还是先显示不影响
            this.showMenu = true;
            const {left, top, width, height} = this.$el.getBoundingClientRect();
            this.menuLeft = event.x - left;
            this.menuTop = event.y - top;
            if (this.menuLeft + 135 > width) {
                this.menuLeft -= this.menuLeft + 135 - width;
            }
            if (this.menuTop + 135 > height + 60) {
                this.menuTop -= this.menuTop + 135 - height - 60;
            }
        },
        handleClickPlay () {
            if (this.songFocused.type === 'playlist') {
                this.$store.dispatch('switchPlaylistHead', this.songFocused.index);
            } else {
                this.$store.dispatch('playNewSong', this.songFocused.song);
            }
            this.showMenu = false;
        },
        handleClickNext () {
            this.$store.dispatch('addToPlaylist', {position: 'head', song: this.songFocused.song});
            this.showMenu = false;
        },
        handleClickAdd () {
            // 添加到歌单，弹窗
            this.$hasher.set('add', this.songFocused.song.id);
            this.showMenu = false;
        },
        handleClickDelete () {
            if (this.inspect) {
                console.log(`Gonna delete song ${this.songFocused.song.title}`);
            }
            if (this.songFocused.type === 'played') {
                this.$store.dispatch('removeFromPlayed', this.songFocused.index);
            } else if (this.songFocused.type === 'playlist') {
                this.$store.dispatch('removeFromPlaylist', this.songFocused.index);
            } else if (this.songFocused.type === 'collection') {
                this.$store.dispatch('removeSongFromCollection', {
                    id: this.songFocused.collection,
                    songId: this.songFocused.song.id,
                });
            }
            this.$emit('update');
            this.showMenu = false;
        },
        handleClickOutside () {
            this.showMenu = false;
        },
    },
    provide () {
        return {
            handleMenu: this.handleMenu,
        };
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .song-list {
        /*为menu和empty提供定位依据*/
        position : relative;

        &-header {
            border       : solid $gray-3;
            border-width : 1px 0;
        }

        &-body {
            border-bottom : 1px solid $gray-3;
            transition    : height .2s;
        }

        &-empty {
            position     : absolute;
            top          : 0;
            bottom       : 0;
            left         : 0;
            right        : 0;
            color        : $gray-4;
            text-align   : center;
            writing-mode : vertical-lr;

            p {
                display      : inline-block;
                width        : 100%;
                font-size    : 18px;
                line-height  : 18px;
                writing-mode : horizontal-tb;
            }
        }

        &-menu {
            position       : absolute;
            /*FloatBox默认内边距太小了，从外部调整一下*/
            padding-top    : 5px;
            padding-bottom : 5px;

            .clear {
                border-top : 1px solid $gray-3;
            }
        }
    }
</style>