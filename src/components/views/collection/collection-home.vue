<template>
    <div class="collection-home">
        <div class="wrapper">
            <ul>
                <li class="entrance-board valid" @click="handleClickLink('playlist')" v-title>
                    <div class="icon-title">
                        <div class="icon-playlist">
                            <Icon type="playlist-1" size="xl"></Icon>
                        </div>
                        <div class="title">
                            播放列表
                        </div>
                    </div>
                    <div class="description">即将播放、正在播放和播放过的歌曲</div>
                </li>
                <li class="entrance-board valid" @click="handleClickLink('fav-song')" v-title>
                    <div class="icon-title">
                        <div class="icon-favorite">
                            <Icon type="favorite-1" size="xl"></Icon>
                        </div>
                        <div class="title">
                            我喜欢的音乐
                        </div>
                    </div>
                    <div class="description">大家都很好听，要选一个出来很困难啊</div>
                </li>
                <li class="entrance-board" v-title>
                    <div class="icon-title">
                        <div class="icon-collection">
                            <Icon type="playlist-2" size="xl"></Icon>
                        </div>
                        <div class="title">
                            我创建的歌单
                        </div>
                    </div>
                    <div class="description">从右侧歌单区选择一个我创建的歌单</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Icon from '../../common/icon.vue';
import Title from '../../../directives/title.js';

export default {
    name: 'collection-home',
    components: {Icon},
    directives: {Title},
    methods: {
        handleClickLink (routeName) {
            this.$router.push({name: routeName});
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../../styles/colors";

    .collection-home {
        width        : 100%;
        height       : 100%;
        text-align   : center;
        writing-mode : vertical-lr;

        .wrapper {
            display      : inline-block;
            width        : 100%;
            text-align   : center;
            writing-mode : horizontal-tb;
            white-space  : normal;

            ul {
                display : inline-block;

                li {
                    display       : block;
                    margin-left   : auto;
                    margin-right  : auto;
                    width         : 415px;
                    height        : 55px;
                    padding       : 10px;
                    border-radius : 4px;
                    text-align    : left;
                    white-space   : nowrap;

                    .icon-title {
                        display        : inline-block;
                        width          : 100px;
                        vertical-align : middle;
                        text-align     : center;

                        .icon-playlist {
                            color : $green;
                        }

                        .icon-favorite {
                            color : $theme;
                        }

                        .icon-collection {
                            color : $theme-invert;
                        }

                        .title {
                            margin-top  : 15px;
                            font-size   : 15px;
                            line-height : 15px;
                        }
                    }

                    .description {
                        display        : inline-block;
                        margin-left    : 35px;
                        width          : 300px;
                        font-size      : 15px;
                        line-height    : 55px;
                        vertical-align : middle;
                        text-align     : left;
                        color          : $gray-4;
                    }

                    &.valid {
                        cursor : pointer;

                        &:hover {
                            background : $gray-1;
                        }
                    }
                }

                .entrance-board + .entrance-board {
                    margin-top : 45px;
                }
            }
        }
    }
</style>