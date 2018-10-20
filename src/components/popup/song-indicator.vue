<template>
    <div class="song-indicator" v-if="nextSong && nextSong.id !== playing.id && timeRemain <= threshold && !closed">
        <CloseButton @close="handleClose"></CloseButton>
        <div class="content">
            <div class="image">
                <img :src="nextSong.imageUrl"/>
            </div>
            <div class="text">
                <p class="first-line">
                    即将播放
                </p>
                <p class="second-line">
                    {{ nextSong.title }} - {{ nextSong.artist.join(' / ') }}
                </p>
            </div>
        </div>
        <ProgressBar class="bar" :total="threshold" :value="timeRemain" :allow-interaction="false" :smooth="true"
                     background-color="transparent"></ProgressBar>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import CloseButton from '../common/close-button.vue';
import ProgressBar from '../common/progress-bar.vue';

export default {
    name: 'song-indicator',
    components: {CloseButton, ProgressBar},
    props: {
        currentTime: {
            type: Number,
            required: true,
        },
    },
    data () {
        return {
            closed: false,
            threshold: 3,
        };
    },
    computed: {
        ...mapGetters('playlist', [
            'playing',
            'playlist',
            'nextSong',
        ]),
        duration () {
            return this.playing.duration;
        },
        timeRemain () {
            return this.playing.duration / 1000 - this.currentTime;
        },
    },
    watch: {
        timeRemain (value) {
            if (value > this.threshold) {
                this.closed = false;
            }
        },
    },
    methods: {
        handleClose () {
            this.closed = true;
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .song-indicator {
        position      : absolute;
        top           : 50px;
        right         : 285px;
        width         : 200px;
        height        : 52px;
        padding       : 5px 5px 5px 7px;
        /*用于设置关闭按钮的颜色*/
        color         : $gray-4;
        background    : $gray-1;
        box-shadow    : 0 0 10px 1px $shadow;
        border-radius : 2px 2px 0 0;
        box-sizing    : border-box;

        .content {

            .image {
                float        : left;
                margin-right : 5px;
                width        : 40px;
                height       : 40px;
            }

            .text {

                p {
                    font-size   : 12px;
                    line-height : 20px;
                }

                .first-line {
                    color : $gray-5;

                }

                .second-line {
                    color : $gray-6;
                }
            }
        }

        .bar {
            position : absolute;
            bottom   : 0;
            left     : 0;
            right    : 0;
            height   : 2px;
        }
    }
</style>