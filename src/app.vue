<template>
    <div id="ddmusic" :style="rootStyles">
        <audio
                crossorigin="anonymous"
                id="audio"
                ref="audio"
                :src="noPlaying ? '' : playing.fileUrl"
                @abort="log('abort')"
                @canplay="log('canplay')"
                @canplaythrough="log('canplaythrough')"
                @durationchange="handleDurationChange"
                @emptied="log('emptied')"
                @ended="handleEnded"
                @error="handleError"
                @loadeddata="handleLoadedData"
                @loadedmetadata="log('loadedmetadata')"
                @loadstart="log('loadstart')"
                @pause="log('pause')"
                @play="log('play')"
                @playing="log('playing')"
                @progress="handleProgress"
                @ratechange="log('ratechange')"
                @seeked="handleSeeked"
                @seeking="log('seeking')"
                @stalled="log('stalled')"
                @suspend="log('suspend')"
                @timeupdate="handleTimeUpdate"
                @volumechange="log('volumechange')"
                @waiting="log('waiting')"></audio>
        <div id="content-area" :style="contentStyles">
            <ContentHeader></ContentHeader>
            <!--<transition mode="out-in">-->
            <!--<router-view class="slide"></router-view>-->
            <!--</transition>-->
            <router-view></router-view>
            <MessageBox v-for="msg in message" :theme="msg.type" :key="msg.id">
                {{ msg.content }}
            </MessageBox>
            <AddSongDialog></AddSongDialog>
        </div>
        <div id="list-area" :style="listStyles">
            <div class="list-resize" v-drag="{mousemove: handleListResizeMouseMove}"></div>
            <InfoBoard @single="toggleSingle"></InfoBoard>
            <ButtonBoard></ButtonBoard>
        </div>
        <SongIndicator :current-time="isSeekingTime ? seekTime : currentTime"></SongIndicator>
        <Single
                id="single"
                :time="isSeekingTime ? seekTime : currentTime"
                v-show="showSingle && !noPlaying"
                @focus="handleFocusProgress"
                @seek="handleSeekProgress"
                @commit="handleCommitProgress">
        </Single>
        <LyricsBoard id="lyrics-board" v-show="showLyrics">
            <p>没有找到歌词</p>
        </LyricsBoard>
        <SignDialog id="sign-dialog" v-show="showSignDialog" @close="handleCloseSign"></SignDialog>
        <AboutDialog id="about-dialog" v-show="showAboutDialog" @close="handleCloseAbout"></AboutDialog>
        <div id="control-column" :style="controlStyles">
            <!--<div id="close-single" title="隐藏单曲页">-->
            <!--<Icon type="layout" size="xxl"></Icon>-->
            <!--</div>-->
            <div class="top-group">
                <ControlButton
                        @left="handleVolume('minus')"
                        @right="handleVolume('plus')"
                        @doublemain="handleClickMute">
                    <Icon slot="main" :type="isMuted ? 'mute' : 'volume'" size="lg"
                          title="单击：调出音量面板 | 按住并滑动：快速操作"></Icon>
                    <Icon slot="left" type="minus" size="xs" title="减小音量"></Icon>
                    <Icon slot="right" type="plus" size="xs" title="增大音量"></Icon>
                    <FloatBoxItem slot="setting" :can-hover="false" :icon="true">
                        <Icon
                                slot="icon"
                                :type="isMuted || mutedUI ? 'mute' : 'volume'"
                                size="xs"
                                color="#d1382a"
                                @click.native="handleClickMute"
                                @mouseenter.native="handleHoverMute('enter')"
                                @mouseleave.native="handleHoverMute('leave')"
                        ></Icon>
                        <ProgressBar slot="content"
                                     class="volume-control-bar"
                                     :value="volume"
                                     :total="1"
                                     :extra="false"
                                     :should-hover="false"
                                     @seek="handleSeekVolume"
                                     @commit="handleCommitVolume">
                        </ProgressBar>
                    </FloatBoxItem>
                </ControlButton>
                <ControlButton
                        @left="handleControl('minus')"
                        @right="handleControl('plus')">
                    <Icon slot="main" :type="`mode-${mode}`" size="lg" title="单击：调出模式面板 | 按住并滑动：快速操作"></Icon>
                    <Icon slot="left" type="previous-1" size="xs" title="上一曲"
                          @click.native="handleClickPrevious"></Icon>
                    <Icon slot="right" type="next-1" size="xs" title="下一曲" @click.native="handleClickNext"></Icon>
                    <div slot="setting" class="mode-list">
                        <FloatBoxItem
                                class="mode-list-mode"
                                v-for="m in modeListModes"
                                :can-hover="true"
                                :icon="true"
                                :key="m.key"
                                :class="m.key === mode ? 'active' : ''"
                                @click.native="handleClickMode(m.key)">
                            <Icon slot="icon" :type="`mode-${m.key}`" size="xs"></Icon>
                            <div slot="content">{{ m.name }}</div>
                        </FloatBoxItem>
                    </div>
                </ControlButton>
                <ControlButton
                        @left="handleLyric('minus')"
                        @right="handleLyric('plus')">
                    <Icon slot="main" type="lyric" size="lg" title="单击：显示/隐藏歌词 | 按住并滑动：快速操作"
                          @click.native="handleClickLyrics"></Icon>
                    <Icon slot="left" type="minus" size="xs" title="歌词延后0.1秒"></Icon>
                    <Icon slot="right" type="plus" size="xs" title="歌词提前0.1秒"></Icon>
                    <FloatBoxItem slot="setting" :can-hover="false" :icon="false">
                        <div slot="content">唔...</div>
                    </FloatBoxItem>
                </ControlButton>
            </div>
            <div class="middle-group" @click="togglePlay" :class="{playing: isPlaying}">
                <div class="play-control">
                    <div class="play-control-icon-box" :class="{dragging: dragPlay.isDragging}"
                         :style="playIconBoxStyles">
                        <Icon class="play-control-icon" type="previous-3" size="3xl"></Icon>
                        <Icon class="play-control-icon" :type="isPlaying ? 'pause' : 'play-1'" size="3xl"
                              v-drag="dragPlayHandlers"></Icon>
                        <Icon class="play-control-icon" type="next-3" size="3xl"></Icon>
                    </div>
                </div>
            </div>
            <div class="bottom-group">
                <div class="sign" @click="handleClickSign">
                    <template v-if="isLogged">
                        <Thumbnail class="user-info" :src="userInfo.avatarSrc" :is-round="true" border-color="white"
                                   size="36px">
                        </Thumbnail>
                    </template>
                    <template v-else>
                        <p>登录...</p>
                    </template>
                </div>
                <div class="logo" @click="handleClickAbout">
                    <Icon type="logo" size="5xl"></Icon>
                </div>
                <div class="version">
                    <p>DVER-{{ version.split('.').join('') | addZero(4) }}</p>
                </div>
                <div class="resize" v-drag="{mousemove: handleResizeMouseMove}" v-if="!isElectron"></div>
            </div>
        </div>
        <ProgressBar
                id="progress-bar"
                :value="isSeekingTime ? seekTime : currentTime"
                :total="duration"
                :extra="true"
                :should-hover="true"
                :allow-interaction="!noPlaying"
                @focus="handleFocusProgress"
                @seek="handleSeekProgress"
                @commit="handleCommitProgress">
            <template>
                {{ currentTime | formatTime }}
                /
                <span :class="timeIndicatorClasses">
                    {{ isSeekingTime ? seekTime : duration | formatTime }}
                </span>
            </template>
        </ProgressBar>
        <CoverImage :image-src="noPlaying ? '' : playing.imageUrl" size="5xl" :state="noPlaying ? '' : playing.state"
                    class="cover-img" :class="{'no-playing' : noPlaying}"
                    :title="noPlaying ? '' : '显示单曲页'"
                    @click.native="toggleSingle">
        </CoverImage>
    </div>
</template>

<script>
import u from './libs/util';
import {mapState, mapGetters} from 'vuex';
import Title from './directives/title';
import Drag from './directives/drag';
import LyricsBoard from './components/basic/lyrics-board.vue';
import ButtonBoard from './components/basic/button-board.vue';
import ContentHeader from './components/basic/content-header.vue';
import ControlButton from './components/basic/control-button.vue';
import CoverImage from './components/common/cover-image.vue';
import FloatBoxItem from './components/common/float-box-item.vue';
import Icon from './components/common/icon.vue';
import InfoBoard from './components/basic/info-board.vue';
import MessageBox from './components/common/message-box.vue';
import ProgressBar from './components/common/progress-bar.vue';
import Thumbnail from './components/common/thumbnail.vue';

// 似乎并没有起到延迟加载的作用...应该对每个组件应用v-if
const AddSongDialog = () => import(/* webpackChunkName: "popup" */ './components/popup/add-song-dialog.vue');
const SignDialog = () => import(/* webpackChunkName: "popup" */ './components/popup/sign-dialog.vue');
const AboutDialog = () => import(/* webpackChunkName: "popup" */ './components/popup/about-dialog.vue');
const Single = () => import(/* webpackChunkName: "popup" */ './components/popup/single.vue');
const SongIndicator = () => import(/* webpackChunkName: "popup" */ './components/popup/song-indicator.vue');

// noinspection JSUnresolvedVariable
const isElectron = IS_ELECTRON;

export default {
    name: 'app',
    components: {
        LyricsBoard,
        Thumbnail, CoverImage, MessageBox, SignDialog, AboutDialog, SongIndicator, ProgressBar, ButtonBoard, InfoBoard,
        AddSongDialog, ControlButton, Icon, Single, ContentHeader, FloatBoxItem,
    },
    directives: {Title, Drag},
    data () {
        return {
            audio: undefined,
            currentTime: 0,
            mutedUI: false,
            modeListModes: [
                {key: 1, name: '列表循环'},
                {key: 2, name: '单曲循环'},
                {key: 3, name: '随机播放'},
                {key: 4, name: '顺序播放'},
            ],
            showSignDialog: false,
            showAboutDialog: false,
            showSingle: false,
            minSize: {
                width: 1000,
                height: 618,
                listWidth: 200,
            },
            dragPlay: {
                isDragging: false,
                startX: 0,
            },
            dragPlayHandlers: {
                mousedown: this.handlePlayMousedown,
                mousemove: this.handlePlayMousemove,
                mouseup: this.handlePlayMouseup,
            },
            iconBoxOffset: -70,
            isLoading: true,
            timeSkipStep: 5,
            showLyrics: false,
            isElectron: isElectron,
            inspect: false,
        };
    },
    computed: {
        ...mapState([
            'version',
            'volume',
            'mode',
            'lyric',
            'isPlaying',
            'isMuted',
            'isSeekingTime',
            'seekTime',
            'userInfo',
            'message',
            'autoPlay',
            'replayFlag',
        ]),
        ...mapGetters('playlist', [
            'playing',
            'playlistLength',
            'noPlaying',
            'nextSongIndex',
            'nextSong',
        ]),
        ...mapGetters([
            'isLogged',
            'width',
            'height',
            'contentWidth',
            'listWidth',
            'controlWidth',
        ]),
        duration () {
            return this.noPlaying ? 1 : this.playing.duration / 1000;
        },
        timeIndicatorClasses () {
            return [
                this.isSeekingTime && ~~this.seekTime > ~~this.currentTime ? 'seeking-forward' : '',
                this.isSeekingTime && ~~this.seekTime < ~~this.currentTime ? 'seeking-backward' : '',
            ];
        },
        rootStyles () {
            return {
                height: `${this.height}px`,
            };
        },
        contentStyles () {
            return {
                width: `${this.contentWidth}px`,
            };
        },
        listStyles () {
            return {
                width: `${this.listWidth}px`,
            };
        },
        controlStyles () {
            return {
                width: `${this.controlWidth}px`,
            };
        },
        maxSize () {
            return {
                listWidth: this.width * .3,
            };
        },
        playIconBoxStyles () {
            return {
                left: `${this.iconBoxOffset}px`,
            };
        },
    },
    watch: {
        showSingle (value) {
            if (value) {
                this.$hasher.set('single');
            } else {
                this.$hasher.remove('single');
            }
        },
        showSignDialog (value) {
            if (value) {
                this.$hasher.set('sign');
            } else {
                this.$hasher.remove('sign');
            }
        },
        showAboutDialog (value) {
            if (value) {
                this.$hasher.set('about');
            } else {
                this.$hasher.remove('about');
            }
        },
        playing () {
            // 切换歌曲src后应该load()一次
            console.log('reload');
            this.audio.load();
            if (this.noPlaying) {
                this.audio.pause();
                this.$store.commit('setIsPlaying', false);
            }
        },
        replayFlag () {
            // 用load()来重放当前歌曲
            this.audio.load();
        },
    },
    methods: {
        toggleSingle () {
            // 没有正在播放的歌曲，不允许打开单曲页
            if (this.noPlaying) {
                return;
            }
            this.showSingle = !this.showSingle;
        },
        handleVolume (type) {
            let volume;
            if (type === 'minus') {
                volume = Math.max(0, this.volume - .1);
            } else if (type === 'plus') {
                volume = Math.min(1, this.volume + .1);
            }
            this.handleCommitVolume(volume);
        },
        handleControl (type) {
            if (type === 'minus') {
                console.log('previous song');
            } else if (type === 'plus') {
                console.log('next song');
            }
        },
        handleLyric (type) {
            if (type === 'minus') {
                console.log('postpone lyric');
            } else if (type === 'plus') {
                console.log('fast forward lyric');
            }
        },
        togglePlay () {
            if (this.noPlaying) {
                return;
            }

            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
            this.$store.commit('setIsPlaying', !this.isPlaying);

            if (!this.autoPlay) {
                this.$store.commit('setAutoPlay', true);
            }
        },
        log (msg) {
            console.log(msg);
        },
        handleDurationChange () {
            this.log('durationchange');
        },
        handleEnded () {
            this.log('ended');
            if (this.playlistLength) {
                // if (this.nextSong.id === this.playing.id) {
                //     this.audio.load();
                // } else {
                this.$store.dispatch('playNextSongPassive');
                // this.$store.dispatch('switchPlaylistHead', this.nextSongIndex);
                // }
            } else {
                this.$store.commit('setIsPlaying', false);
            }
        },
        handleError () {
            this.log('error');
            // 因错误而停止
            if (this.isPlaying) {
                this.$store.dispatch('addMessage', {
                    type: 'error',
                    content: '播放出现错误：Error',
                });
                this.audio.pause();
                this.$store.commit('setIsPlaying', false);
            }
        },
        handleProgress () {
            const buffered = this.audio.buffered;
            let msg = 'progress';
            for (let i = 0; i < buffered.length; i++) {
                msg += `\nBuffer part ${i}: from ${buffered.start(i)} to ${buffered.end(i)}`;
            }
            this.log(msg);
        },
        handleTimeUpdate () {
            this.currentTime = this.audio.currentTime;
        },
        handleFocusProgress (bool) {
            // Set flag, reset in handleCommitProgress
            this.$store.commit('setIsSeekingTime', bool);
        },
        handleSeekProgress (time) {
            // Buffer seeking requests until seek-commit
            this.$store.commit('setSeekTime', time);
        },
        handleCommitProgress (time) {
            // this.isSeekingTime is handled in handleFocusProgress
            if (time < 0 || time > this.duration) {
                console.log('Wrong time value!');
                time = Math.min(Math.max(0, time), this.duration);
            }
            // Fix 手动更新this.currentTime，使timeUpdate事件向进度条传入已更新的时间值
            // this.audio.currentTime会被立刻更新，不用担心
            this.currentTime = this.audio.currentTime = time;
            this.log(`currentTime is set to ${time}`);
        },
        handleSeeked () {
            this.log(`seeked: ${this.audio.currentTime}`);
        },
        handleSeekVolume (volume) {
            if (this.audio.volume !== volume) {
                this.audio.volume = volume;
                this.$store.commit('setVolume', volume);
            }
        },
        handleCommitVolume (volume) {
            this.handleSeekVolume(volume);
        },
        handleClickMute () {
            this.audio.muted = !this.isMuted;
            this.$store.commit('setIsMuted', !this.isMuted);
        },
        handleHoverMute (status) {
            this.mutedUI = status === 'enter';
        },
        handleClickMode (mode) {
            this.$store.commit('setMode', mode);
        },
        handleLoadedData () {
            this.log('loadeddata');
            if (this.autoPlay) {
                // this.autoPlay = false;
                this.audio.play();
                this.$store.commit('setIsPlaying', true);
            }
        },
        handleClickSign () {
            if (this.isLogged) {
                this.$store.dispatch('resetUserInfo');
            } else {
                if (!this.showSignDialog) {
                    this.showSignDialog = true;
                }
            }
        },
        handleCloseSign () {
            this.showSignDialog = false;
        },
        handleClickAbout () {
            if (!this.showAboutDialog) {
                this.showAboutDialog = true;
            }
        },
        handleCloseAbout () {
            this.showAboutDialog = false;
        },
        handleClickPrevious () {
            this.$store.dispatch('playPreviousSong');
        },
        handleClickNext () {
            this.$store.dispatch('playNextSong');
        },
        handleClickLyrics () {
            this.showLyrics = !this.showLyrics;
        },
        // 根据hash值同步single和signBox显示状态
        handleHashChange (hash) {
            this.showSignDialog = hash['sign'] === true;
            this.showAboutDialog = hash['about'] === true;
            this.showSingle = hash['single'] === true;
        },
        handleWindowResize () {
            if (this.isElectron) {
                this.$store.commit('setWidth', Math.max(window.innerWidth, this.minSize.width));
                this.$store.commit('setHeight', Math.max(window.innerHeight, this.minSize.height));
            } else {
                const targetWidth = window.innerWidth - 10;
                const targetHeight = window.innerHeight - 10;
                if (targetWidth < this.width || targetHeight < this.height) {
                    const ratio = Math.max(this.width / targetWidth, this.height / targetHeight);
                    this.$store.commit('setWidth', Math.max(this.width / ratio, this.minSize.width));
                    this.$store.commit('setHeight', Math.max(this.height / ratio, this.minSize.height));
                    // this.$store.commit('setListWidth', Math.min(this.minSize.listWidth, this.maxSize.listWidth));
                }
            }
        },
        handleKeyDown (event) {
            if (event.key === ' ') {
                if (!this.noPlaying) {
                    event.preventDefault();
                    this.togglePlay();
                    this.$store.dispatch('addMessage', {
                        type: 'ok',
                        // isPlaying已经发生变化
                        content: this.isPlaying ? '播放' : '暂停',
                    });
                }
            }
            if (event.key === 'ArrowLeft' || event.key === 'Left') {
                event.preventDefault();
                this.handleCommitProgress(u.filterNumber(this.currentTime - this.timeSkipStep, 0, this.duration));
                this.$store.dispatch('addMessage', {
                    type: 'ok',
                    content: `后退${this.timeSkipStep}秒`,
                });
            }
            if (event.key === 'ArrowRight' || event.key === 'Right') {
                event.preventDefault();
                this.handleCommitProgress(u.filterNumber(this.currentTime + this.timeSkipStep, 0, this.duration));
                this.$store.dispatch('addMessage', {
                    type: 'ok',
                    content: `前进${this.timeSkipStep}秒`,
                });
            }
            if (event.key === '/') {
                event.preventDefault();
                this.$hasher.set('search');
            }
        },
        handleResizeMouseMove (event) {
            this.$store.commit('setWidth', Math.max(this.minSize.width, this.width + 2 * event.movementX));
            this.$store.commit('setHeight', Math.max(this.minSize.height, this.height + 2 * event.movementY));
        },
        handleListResizeMouseMove (event) {
            this.$store.commit('setListWidth',
                Math.min(Math.max(this.minSize.listWidth, this.listWidth - event.movementX), this.maxSize.listWidth),
            );
        },
        async restoreAjaxCache () {
            try {
                const data = await this.$ajax.restoreAllCache();
                if (this.inspect) {
                    console.log(data);
                    console.log('Cache successfully restored');
                }
                return data;
            } catch (error) {
                console.error('读取缓存发生错误');
                console.error(error);
            }
        },
        async restoreSettings () {
            try {
                const savedVolume = await this.$store.dispatch('restoreVolume') || this.volume;
                const savedMode = await this.$store.dispatch('restoreMode') || this.mode;
                // const savedLyric = await this.$store.dispatch('restoreLyric') || this.lyric;
                const savedUserInfo = await this.$store.dispatch('restoreUserInfo') || {};
                if (savedVolume !== this.volume) {
                    this.handleCommitVolume(savedVolume);
                }
                if (savedMode !== this.mode) {
                    this.handleClickMode(savedMode);
                }
                // if (savedLyric !== this.lyric) {
                //     this.handleLyric(savedLyric);
                // }
                // console.log(savedUserInfo);
                if (savedUserInfo.token) {
                    try {
                        this.$store.dispatch('setUserInfo', savedUserInfo);
                        const userInfo = await this.$store.dispatch('fetchUserInfo', savedUserInfo.token);
                        this.$store.dispatch('addMessage', {
                            type: 'ok',
                            content: '登录成功',
                        });
                        return userInfo;
                    } catch (error) {
                        console.log(error);
                        this.$store.dispatch('resetUserInfo');
                        this.$store.dispatch('addMessage', {
                            type: 'error',
                            content: '登录失败',
                        });
                    }
                }
            } catch (error) {
                console.error('恢复设置时发生错误');
                console.error(error);
            }
        },
        async handleLogIn () {
            // 如果有access_token值，说明是从第三方登录跳转过来的，需要将access_token以POST方式提交到后端
            if (this.$hash['access_token']) {
                try {
                    const token = await this.$store.dispatch('logIn', this.$hash['access_token']);
                    const userInfo = await this.$store.dispatch('fetchUserInfo', token);
                    this.$store.dispatch('addMessage', {
                        type: 'ok',
                        content: '登录成功',
                    });
                    return userInfo;
                } catch (error) {
                    console.log(error);
                    this.$store.dispatch('resetUserInfo');
                    this.$store.dispatch('addMessage', {
                        type: 'error',
                        content: '登录失败',
                    });
                } finally {
                    // 把hash清空了，不然太难看
                    this.$hasher.remove(
                        ['access_token', 'id_token', 'expires_in', 'scope', 'session_state', 'state', 'token_type'],
                    );
                }
            }
        },
        handlePlayMousedown (event) {
            this.dragPlay.isDragging = true;
            this.dragPlay.startX = event.x;
        },
        handlePlayMousemove (event) {
            this.iconBoxOffset = u.filterInteger(-70 + event.x - this.dragPlay.startX, -140, 0);
        },
        handlePlayMouseup () {
            if (this.iconBoxOffset < -120) {
                this.handleClickNext();
            } else if (this.iconBoxOffset > -20) {
                this.handleClickPrevious();
            }
            this.iconBoxOffset = -70;
            this.dragPlay.isDragging = false;
        },
    },
    filters: {
        formatTime: u.formatTime,
        addZero (string, num) {
            const diff = num - string.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    string = '0' + string;
                }
            }
            return string;
        },
    },
    created () {
        // 绑定一些全局事件
        // 尺寸响应变化
        window.addEventListener('resize', this.handleWindowResize);
        this.handleWindowResize();
        // 监听事件
        document.addEventListener('keydown', this.handleKeyDown);
    },
    async mounted () {
        this.audio = this.$refs.audio;
        // 初始化时，通过Vuex的action请求异步数据
        this.$store.dispatch('getCollections');
        this.$store.dispatch('getFavorite');
        // 全局导航后置钩子，在每一次前端路由生效之后被触发
        // 其灵敏度比window.onhashchange更高
        // 但这时地址栏还未发生变化，应该从to中获得hash然后交给this.$hasher去解析
        this.$router.afterEach(to => {
            this.$hasher.parse(to.hash);
        });
        // afterEach钩子的生效时间似乎不稳定，需要在页面第一次加载完毕之后手动调用一次hash parse
        this.$hasher.parse(window.location.hash);
        this.$hasher.bind(this.handleHashChange);
        // 以下是异步函数，所有步骤完成后将isLoading设置为false
        try {
            // 尝试登录
            const logInPromise = this.handleLogIn();
            // 恢复设置、缓存和播放列表
            const restoreSettingsPromise = this.restoreSettings();
            // 等待ajax缓存恢复
            await this.restoreAjaxCache();
            // 播放列表里的数据经过简化，依赖ajax缓存，尽可能在ajax缓存恢复之后再恢复播放列表
            const restorePlayedPromise = this.$store.dispatch('restorePlayed');
            const restorePlaylistPromise = this.$store.dispatch('restorePlaylist');
            // 剩下四个也都完成
            await Promise.all([restorePlayedPromise, restorePlaylistPromise, logInPromise, restoreSettingsPromise]);
        } catch (error) {
            // 应该不会有报错，因为都在各自的过程中吸收了
            console.log(error);
        } finally {
            this.isLoading = false;
        }
    },
    destroyed () {
        this.$hasher.unbind(this.handleHashChange);
    },
};
</script>

<style scoped lang="scss">
    @import "styles/colors";

    #ddmusic {
        position    : absolute;
        transform   : translate3d(-50%, -50%, 0);
        left        : 50%;
        top         : 50%;
        /*height      : 618px;*/
        box-shadow  : 0 0 10px 1px $shadow;
        white-space : nowrap;
        font-size   : 0;
        overflow    : hidden;
    }

    #content-area {
        display        : inline-block;
        /*为MessageBox提供定位依据*/
        position       : relative;
        /*width          : 730px;*/
        height         : 100%;
        background     : white;
        vertical-align : top;

        /*
        .slide {
            transition : all .2s;

            &.v-enter-active, &.v-leave-active {
            }

            &.v-enter {
                transform : translateX(100%);
            }

            &.v-leave-to {
                transform : translateX(-100%);
            }
        }
        */
    }

    #list-area {
        display        : inline-block;
        /*为MessageBox提供定位依据*/
        position       : relative;
        height         : 100%;
        background     : $gray-1;
        vertical-align : top;

        .list-resize {
            position : absolute;
            top      : 0;
            bottom   : 0;
            left     : -1px;
            width    : 2px;
            cursor   : col-resize;
        }
    }

    #lyrics-board {
        position : absolute;
        bottom   : 8px;
        left     : 35px;
        width    : 660px;
        height   : 50px;
    }

    #sign-dialog, #about-dialog {
        position  : absolute;
        top       : 50%;
        left      : 50%;
        transform : translate3d(-50%, -50%, 0);
    }

    #control-column {
        display        : inline-block;
        position       : relative;
        height         : 100%;
        vertical-align : top;
        text-align     : center;
        background     : $theme;
        writing-mode   : vertical-lr;

        & > * {
            display      : inline-block;
            width        : 100%;
            writing-mode : horizontal-tb;
        }

        .top-group {
            position   : absolute;
            top        : 0;
            left       : 0;
            margin-top : 106px;

            .volume-control-bar {
                height : 3px;
                width  : 60px;
            }
        }

        .middle-group {
            margin-bottom : 40px;

            .play-control {
                padding  : 17px;
                color    : $sakura;
                overflow : hidden;
                cursor   : pointer;

                &:hover {
                    background : hsla(0, 0, 0, .1);
                }

                &-icon-box {
                    position   : relative;
                    width      : 135px;
                    transition : left .4s ease-out;

                    &.dragging {
                        transition : none;
                    }

                    .play-control-icon + .play-control-icon {
                        margin-left : 35px;
                    }
                }
            }
        }

        .bottom-group {
            position : absolute;
            bottom   : 0;
            left     : 0;
            color    : white;

            .sign {
                cursor : pointer;

                p {
                    font-size   : 12px;
                    line-height : 36px;
                }

                &:hover {
                    text-decoration : underline;
                }
            }

            .logo, .version {
                text-align : center;
            }

            .logo {
                margin-top : 20px;
                cursor     : pointer;
            }

            .version p {
                font-size   : 10px;
                line-height : 20px;
            }

            .resize {
                position            : absolute;
                right               : 1px;
                bottom              : 1px;
                width               : 0;
                height              : 0;
                border              : solid transparent;
                border-bottom-color : $gray-1;
                // border-bottom-color : $theme-dark-2;
                border-width        : 0 0 8px 8px;
                cursor              : nwse-resize;
            }
        }
    }

    #close-single {
        color   : hsla(0, 0, 100, .75);
        padding : 25px 20px;
        cursor  : pointer;

        &:hover {
            background : hsla(0, 0, 0, .1);
        }
    }

    .cover-img {
        position   : absolute;
        right      : 0;
        top        : 0;
        width      : 80px;
        height     : 80px;
        box-shadow : 0 0 10px 1px $shadow;
        cursor     : pointer;

        &.no-playing {
            box-shadow : none;
            cursor     : default;
        }
    }

    .seeking-forward {
        color : $theme-light-1;
    }

    .seeking-backward {
        color : $green;
    }

    #progress-bar {
        position : absolute;
        top      : 0;
        left     : 0;
        right    : 80px;
        height   : 5px;
    }

    .mode-list {
        &-mode {
            margin : 4px 0;
        }
    }
</style>