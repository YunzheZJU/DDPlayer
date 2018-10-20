<template>
    <transition>
        <!--v-if会让Star里的数据变得奇怪-->
        <div class="single">
            <div class="bg">
                <img :src="noPlaying ? '' : playing.imageUrl"/>
            </div>
            <div class="content">
                <div class="best">
                    <div class="paint" :style="topLeftStyles">
                        <Star class="paint-star" :points="points" :time="time"
                              @focus="handleFocusProgress"
                              @seek="handleSeekProgress"
                              @commit="handleCommitProgress"></Star>
                        <!--<img>垫在<svg>上，阻止drag事件在图片上触发-->
                        <div class="paint-img">
                            <img :src="noPlaying ? '' : playing.imageUrl"/>
                        </div>
                    </div>
                    <div class="text" :style="rightStyles">
                        <div class="info">
                            <p class="title" :title="noPlaying ? '' : playing.title">
                                {{ noPlaying ? '' : playing.title }}
                            </p>
                            <p class="work" :title="noPlaying ? '' : playing.work">
                                {{ noPlaying ? '' : playing.work }}
                            </p>
                            <p class="artist">
                                歌手：
                                <template v-for="(artist, index) in playing['simpleArtistInfos'] || []">
                                    <router-link :to="{name: 'artist-detail', params: {id: artist.id}}" :key="index"
                                                 :title="artist.name" class="highlight">
                                        {{ artist.name }}
                                    </router-link>
                                    <template v-if="index !== playing['simpleArtistInfos'].length - 1">
                                        /
                                    </template>
                                </template>
                            </p>
                            <p class="album" :title="noPlaying ? '' : playing.album">
                                专辑：
                                <router-link :to="{name: 'album-detail', params: {id:  playing['simpleAlbumInfo'].id}}"
                                             :title="playing.album" v-if="playing['simpleAlbumInfo']" class="highlight">
                                    {{ playing.album }}
                                </router-link>
                            </p>
                            <p class="from">
                                来源：
                                <router-link v-if="playing.from" :to="playing.from.url" :title="playing.from.name"
                                             class="highlight">
                                    {{ playing.from.name }}
                                </router-link>
                            </p>
                        </div>
                        <div class="action">
                            <ActionButton class="action-btn" title="喜欢" :type="`favorite-${isFavorite ? '2' : '1'}`"
                                          color="#d1382a" @click.native="handleClickFav">
                                喜欢
                            </ActionButton>
                            <ActionButton class="action-btn" title="添加" type="addto">添加</ActionButton>
                            <ActionButton class="action-btn" title="下载" type="dl">下载</ActionButton>
                            <ActionButton class="action-btn" title="分享" type="share">分享</ActionButton>
                        </div>
                    </div>
                </div>
                <div class="rcmb" :style="bottomStyles">
                    <RcmBoard class="rcmb-song" :style="bottomLeftStyles">
                        <template slot="title">
                            相关歌曲
                        </template>
                        <!--两首假歌-->
                        <router-link slot="content" to="#">
                            <RcmSong :image-src="cover1">
                                <template slot="title">コレカラ</template>
                                <template slot="artist">Machico</template>
                                <template slot="count">1234</template>
                            </RcmSong>
                            <RcmSong :image-src="cover3">
                                <template slot="title">これからのSomeday</template>
                                <template slot="artist">μ's</template>
                                <template slot="count">8</template>
                            </RcmSong>
                        </router-link>
                    </RcmBoard>
                    <RcmBoard class="rcmb-user" :style="rightStyles">
                        <template slot="title">
                            喜欢这首歌的人
                        </template>
                        <!--12张假图-->
                        <router-link slot="content" :to="{name: 'artist-detail', params: {id: 10 + i}}" v-for="i in 12" :key="i">
                            <RcmUser :image-src="artistList[i % 6]"></RcmUser>
                        </router-link>
                        <div slot="content" class="rcmb-user-count">
                            <p>
                                ...等
                                <span>
                                <!--假数字-->
                                {{ 150 }}
                            </span>
                                人
                            </p>
                        </div>
                    </RcmBoard>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import u from '../../libs/util';
import {mapGetters} from 'vuex';
import points from './single-points';
import Cover1 from '../../assets/cover_1.jpg';
import Cover3 from '../../assets/cover_3.jpg';
import Artist0 from '../../assets/artist_0.jpg';
import Artist1 from '../../assets/artist_1.jpg';
import Artist2 from '../../assets/artist_2.jpg';
import Artist3 from '../../assets/artist_3.jpg';
import Artist4 from '../../assets/artist_4.jpg';
import Artist5 from '../../assets/artist_5.jpg';
import ActionButton from '../common/action-button.vue';
import RcmBoard from '../common/rcm-board.vue';
import RcmSong from '../common/rcm-song.vue';
import RcmUser from '../common/rcm-user.vue';
import Star from './single-star.vue';

export default {
    name: 'single',
    components: {Star, RcmUser, RcmSong, RcmBoard, ActionButton},
    props: {
        // Current time
        time: {
            type: Number,
            default: 0,
        },
        // columnWidth: {
        //     type: Number,
        //     default: 320,
        // },
    },
    data () {
        return {
            points: points.map(
                (pvs, index) =>
                    pvs.scale(index % 2 === 0 ? 320 / 2 - Math.random() * 15 : 115 + Math.random() * 15),
            ),
            cover1: Cover1,
            cover3: Cover3,
            artistList: [Artist0, Artist1, Artist2, Artist3, Artist4, Artist5],
        };
    },
    watch: {
        playing (value) {
            if (this.noPlaying) {
                return;
            }
            const playing = value;
            if (playing.work === '') {
                this.$ajax.getSongsFullAsync(this.playing.id).then(res => {
                    // 部分歌曲无workInfo如75号
                    if (res[0]['simpleWorkInfo']) {
                        // Vuex 严格模式下会出现警告
                        playing.work = res[0]['simpleWorkInfo'].title;
                    }
                });
            }
        },
    },
    computed: {
        ...mapGetters('playlist', [
            'playing',
            'noPlaying',
        ]),
        ...mapGetters([
            'isFavorite',
            'width',
            'height',
        ]),
        topLeftStyles () {
            return {
                width: `${this.columnWidth}px`,
                height: `${this.columnWidth}px`,
            };
        },
        rightStyles () {
            return {
                width: `${this.columnWidth}px`,
                marginLeft: `${this.columnGapWidth}px`,
            };
        },
        bottomStyles () {
            return {
                marginTop: `${this.columnGapHeight}px`,
            };
        },
        bottomLeftStyles () {
            return {
                width: `${this.columnWidth}px`,
            };
        },
        columnGapHeight () {
            const height = u.filterInteger(this.height, 618, 818);
            return (height - 18) / 20;
        },
        columnGapWidth () {
            const width = u.filterInteger(this.width, 1000, 1600);
            return width / 20;
        },
        columnWidth () {
            const height = u.filterInteger(this.height, 618, 818);
            return ~~((height + 22) / 2);
        },
    },
    methods: {
        handleSeekProgress (payload) {
            this.$emit('seek', payload);
        },
        handleCommitProgress (payload) {
            this.$emit('commit', payload);
        },
        handleFocusProgress (payload) {
            this.$emit('focus', payload);
        },
        handleClickFav () {
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

    .single {
        position         : absolute;
        top              : 0;
        bottom           : 0;
        left             : 0;
        right            : 70px;
        background-color : white;
        transform-origin : top right;

        .bg {
            /*即使IE9不支持，也有opacity撑着*/
            filter  : blur(20px);
            opacity : .3;
        }

        .content {
            position  : absolute;
            left      : 50%;
            top       : 50%;
            transform : translate3d(-50%, -50%, 0);

            .best {
                .paint, .text {
                    display        : inline-block;
                    vertical-align : top;
                }

                .paint {
                    position : relative;

                    &-star {
                        position   : absolute;
                        left       : 50%;
                        top        : 50%;
                        transform  : translate3d(-50%, -50%, 0);
                    }

                    &-img {
                        position   : absolute;
                        left       : 50%;
                        top        : 50%;
                        transform  : translate3d(-50%, -50%, 0);
                        width      : 140px;
                        height     : 140px;
                        border     : 1px solid $gray-3;
                        box-sizing : border-box;
                    }
                }

                .text {
                    margin-left : 50px;
                    color       : $gray-6;

                    .info {
                        margin-top : 47px;
                        /*避免没有数据的时候下面的内容顶上来，有必要设置一个固定的高度*/
                        height     : 160px;

                        a {
                            color : $theme-invert;
                        }

                        .title {
                            font-size   : 25px;
                            line-height : 40px;
                        }

                        .work, .artist, .album, .from {
                            font-size   : 15px;
                            line-height : 30px;
                        }
                    }

                    .action {
                        margin : 40px 10px 0 0;

                        &-btn {
                            display : inline-block;
                            margin  : 0 20px 0 0;
                        }
                    }
                }
            }

            .rcmb {

                &-song, &-user {
                    display        : inline-block;
                    vertical-align : top;
                }

                &-song {
                    margin-bottom : 15px;

                }

                &-user {

                    &-count {
                        float         : right;
                        padding-right : 10px;
                        font-size     : 12px;
                        line-height   : 46px;
                    }
                }
            }
        }

        &.v-enter-active, &.v-leave-active {
            transition : all .3s;
        }

        &.v-enter, &.v-leave-to {
            opacity   : 0;
            transform : scale(.1);
        }
    }
</style>