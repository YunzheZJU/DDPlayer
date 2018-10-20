<template>
    <!--这是一个具有独立功能的组件，当作为歌曲列表实体项使用（而不是表格头或空项）时，
    根据传入的song对象独立渲染自己的内容，响应自己内部的事件，判断本歌曲是否正在播放，是否已收藏等。
    父级可以控制的是它的类型：表格头、实体项或空项，以及它的背景样式。-->
    <li class="song-list-item" @dblclick="handleClickPlay" @contextmenu.prevent="handleClickMenu">
        <!--表格头-->
        <div class="header" v-if="isHeader">
            <div class="number" title="编号">
                <p>#</p>
            </div>
            <div class="title" title="歌曲">
                <p>歌曲</p>
            </div>
            <div class="artist" title="歌手">
                <p>歌手</p>
            </div>
            <div class="album" title="专辑">
                <p>专辑</p>
            </div>
            <div class="duration" title="时长">
                <p>时长</p>
            </div>
            <div class="action" title="操作">
                <p>操作</p>
            </div>
        </div>
        <!--实体项-->
        <div class="entity"
             :class="[theme, {focus: isFocusing, dragging: isDragging, 'dragging-over': isDraggingOver}]"
             v-else-if="isEntity" :draggable="isEditing" v-click-outside="handleClickOutside"
             @dragstart="handleDragStart" @dragend="handleDragEnd" @dragenter="handleDragEnter"
             @dragleave="handleDragLeave" @dragover="handleDragOver" @drop="handleDrop" @click="handleClickEntity">
            <transition>
                <div class="handler" v-show="isEditing"></div>
            </transition>
            <div class="number" title="编号">
                <!--播放中的当前歌曲，但不处于播放历史中的，并且不在编辑状态，显示播放状态-->
                <p v-if="isPlayingSong && playlistType !== 'played' && !isEditing">
                    <Icon :type="isPlaying ? 'volume' : 'pause'" size="xs" color="theme"></Icon>
                </p>
                <!--其他情况显示编号-->
                <p v-else>
                    {{ index + 1 | addZero }}
                </p>
            </div>
            <div class="title" :title="song.title">
                <p v-html="matchKeywords(song.title)"></p>
            </div>
            <div class="artist" :title="song.artist.join(' / ')">
                <p v-html="matchKeywords(song.artist.join(' / '))"></p>
            </div>
            <div class="album" :title="song.album">
                <p v-html="matchKeywords(song.album)"></p>
            </div>
            <div class="duration" :title="song.durationFmt">
                <p>
                    {{ song.durationFmt }}
                </p>
            </div>
            <div class="action">
                <p>
                    <template v-if="!isEditing">
                        <Icon :type="`favorite-${isFavorite ? '2' : '1'}`" size="sm"
                              :color="isFavorite ? 'theme' : 'inherit'" class="action-icon" title="收藏歌曲"
                              @click.native.stop="handleClickFav"></Icon>
                        <Icon type="play-2" size="sm" class="action-icon" title="立即播放"
                              @click.native.stop="handleClickPlay"></Icon>
                        <Icon type="more" size="sm" class="action-icon" title="更多操作"
                              @click.native.stop="handleClickMenu"></Icon>
                    </template>
                    <template v-else>
                        <Icon type="clear" size="sm" class="action-icon" title="删除"
                              @click.native.stop="handleClickDelete"></Icon>
                        <span class="action-icon-cover" :class="{active: isCover}"
                              @click="handleClickCover">封面</span>
                    </template>
                </p>
            </div>
        </div>
        <!--空项，不加title更好-->
        <div class="empty" v-else>
            <p>没有更多了……</p>
        </div>
    </li>
</template>

<script>
import Icon from './icon.vue';
import {mapState, mapGetters} from 'vuex';
import ClickOutside from '../../directives/clickoutside';

export default {
    name: 'song-list-item',
    components: {Icon},
    directives: {ClickOutside},
    inject: ['handleMenu'],
    props: {
        type: {
            type: String,
            required: true,
            validator: function (value) {
                // 这个值必须匹配下列字符串中的一个
                return ['header', 'entity', 'empty'].includes(value);
            },
        },
        theme: {
            type: String,
            default: 'white',
            validator: function (value) {
                // 这个值必须匹配下列字符串中的一个
                return ['white', 'gray', 'dark'].includes(value);
            },
        },
        song: {
            type: Object,
        },
        highlight: {
            type: String,
        },
        index: {
            type: Number,
            default: 0,
        },
        playlistType: {
            type: String,
            default: '',
        },
        collection: {
            type: Number,
            default: 0,
        },
        isEditing: {
            type: Boolean,
            default: false,
        },
        isCover: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            isFocusing: false,
            isDragging: false,
            isDraggingOver: false,
            inspect: false,
        };
    },
    computed: {
        ...mapState([
            'isPlaying',
        ]),
        ...mapGetters('favorite', [
            'favSongs',
        ]),
        ...mapGetters('playlist', [
            'playing',
        ]),
        isHeader () {
            return this.type === 'header';
        },
        isEntity () {
            return this.type === 'entity';
        },
        isPlayingSong () {
            return this.playing.id === this.song.id;
        },
        isFavorite () {
            return this.favSongs.includes(this.song.id);
        },
    },
    methods: {
        handleClickFav () {
            if (this.inspect) {
                console.log('fav icon is clicked');
            }
            if (this.isFavorite) {
                this.$store.dispatch('removeFavSong', this.song.id);
            } else {
                this.$store.dispatch('addFavSong', this.song.id);
            }
        },
        handleClickPlay () {
            // 过滤无关项
            if (['header', 'empty'].includes(this.type)) {
                return;
            }
            if (this.inspect) {
                console.log('play icon is clicked');
            }
            if (this.playlistType === 'playlist') {
                this.$store.dispatch('switchPlaylistHead', this.index);
            } else {
                this.$store.dispatch('playNewSong', this.song);
            }
        },
        handleClickMenu (event) {
            // 以防双击触发
            if (['header', 'empty'].includes(this.type)) {
                return;
            }
            if (this.inspect) {
                console.log(event);
                console.log('more icon is clicked');
            }
            // 高亮实体项
            this.isFocusing = true;
            // 调用父组件暴露的handleMenu方法
            this.handleMenu(
                event,
                {
                    song: this.song,
                    type: this.playlistType,
                    index: this.index,
                    collection: this.collection,
                },
            );
        },
        handleClickEntity () {
            this.isFocusing = !this.isFocusing;
        },
        handleClickOutside () {
            this.isFocusing = false;
        },
        matchKeywords (string) {
            if (this.highlight) {
                return string.replace(new RegExp(`(${this.highlight})`, 'g'), '<span class="highlight">$1</span>');
            } else {
                return string;
            }
        },
        handleClickDelete () {
            this.$emit('delete', this.index);
        },
        handleClickCover () {
            this.$emit('cover', this.index);
        },
        // Drag-er
        handleDragStart (event) {
            // console.log(this.index);
            event.dataTransfer.setData('text/plain', `${this.index}`);
            event.dataTransfer.dropEffect = 'move';
            this.isDragging = true;
            // console.log(`Dragging song ${this.index}`);
            this.$emit('drag-start', this.index);
        },
        handleDragEnd () {
            this.isDragging = false;
        },
        // Drag-ee
        handleDragEnter () {
            // console.log(`this.index = ${this.index}, type is ${typeof this.index}`);
            // console.log(event.dataTransfer.getData('text/plain'));
            // console.log(`~~event.dataTransfer.getData('text/plain') = ${~~event.dataTransfer.getData('text/plain')}, type is ${typeof ~~event.dataTransfer.getData('text/plain')}`);
            // if (this.index !== ~~event.dataTransfer.getData('text/plain')) {
            //     event.preventDefault();
            // }
            this.isDraggingOver = true;
        },
        handleDragLeave () {
            this.isDraggingOver = false;
        },
        // 必须处理dragover否则drop无效
        handleDragOver (event) {
            event.preventDefault();
        },
        handleDrop (event) {
            event.preventDefault();
            // console.log(`this.index = ${this.index}, type is ${typeof this.index}`);
            // console.log(event.dataTransfer.getData('text/plain'));
            // console.log(`~~event.dataTransfer.getData('text/plain') = ${~~event.dataTransfer.getData('text/plain')}, type is ${typeof ~~event.dataTransfer.getData('text/plain')}`);
            // console.log(this.index === ~~event.dataTransfer.getData('text/plain'));
            this.isDraggingOver = false;
            if (this.index !== ~~event.dataTransfer.getData('text/plain')) {
                this.$emit('drop', {
                    drag: ~~event.dataTransfer.getData('text/plain'),
                    drop: this.index,
                });
            }
        },
    },
    filters: {
        addZero (num) {
            return num >= 10 ? `${num}` : `0${num}`;
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .song-list-item {
        /*display: inline-block;*/
        position : relative;

        &.v-enter-active, &.v-leave-active, &.v-move {
            transition : all .2s;
        }

        &.v-enter-to, &.v-leave {
            max-height : 30px;
        }

        &.v-enter, &.v-leave-to {
            max-height : 0;
        }

        p {
            line-height : 30px;
            font-size   : 12px;
        }

        .header, .entity {
            padding : 0 20px;

            .number, .title, .artist, .album, .duration, .action {
                display    : inline-block;
                padding    : 0 6px;
                box-sizing : border-box;
            }

            .number {
                width      : 6%;
                text-align : center;
            }

            .title {
                width : 29%;

            }

            .artist {
                width : 20%;

            }

            .album {
                width : 25%;

            }

            .duration {
                width : 10%;

            }

            .action {
                width : 10%;
            }

        }

        .header > * + * {
            border-left : 1px solid $gray-3;
        }

        .entity {

            &.white {
                background : white;
            }

            &.gray {
                background : $gray-1;
            }

            &.dark {
                background : $gray-2;
            }

            &:hover, &.focus {
                background : $gray-3;

                .action-icon {
                    color : $gray-5;

                    &:hover {
                        color : $gray-6;
                    }
                }

                .action-icon-cover {
                    color : $theme-invert;
                }

                .handler {
                    color : $gray-4;
                }
            }

            &.dragging {
                opacity : .5;
            }

            &.dragging-over {
                opacity : .1;
            }

            .handler {
                position   : absolute;
                top        : 0;
                bottom     : 0;
                left       : 0;
                width      : 3%;
                padding    : 12px 5px;
                color      : $gray-3;
                text-align : center;
                /*For Browsers not supporting cursor:grab*/
                // noinspection CssOverwrittenProperties
                cursor     : pointer;
                // noinspection CssOverwrittenProperties
                cursor     : grab;

                &:before {
                    content       : '';
                    display       : inline-block;
                    width         : 100%;
                    height        : 2px;
                    border        : solid;
                    border-width  : 2px 0 2px 0;
                    border-radius : 1px;
                    max-width     : 20px;
                }

                &.v-enter-active, &.v-leave-active {
                    transition : all .2s;
                }

                &.v-enter, &.v-leave-to {
                    opacity   : 0;
                    transform : translateX(100%);
                }
            }

            .action {

                p {
                    font-size : 0;
                }

                &-icon {
                    display : inline-block;
                    padding : 0 2px;
                    color   : $gray-4;
                    cursor  : pointer;
                }

                &-icon-cover {
                    margin-left    : 2px;
                    padding        : 0 3px;
                    font-size      : 12px;
                    color          : transparent;
                    border         : 1px solid;
                    border-radius  : 4px;
                    vertical-align : middle;
                    cursor         : pointer;

                    &.active {
                        color : $theme-invert;
                    }
                }
            }
        }
    }
</style>