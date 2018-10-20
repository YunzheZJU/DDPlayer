/**
 * Created by Yunzhe on 2018/8/28.
 */

'use strict';
import u from '../libs/util';
import storage from '../libs/storage';
import ajax from '../plugins/ajax';
import {favArtists, favAlbums, favSongs} from './favorite';
import favorite from './modules/favorite';
import Collections from './collections';
import collection from './modules/collection';
import playlist from './modules/playlist';

// noinspection JSUnresolvedVariable
const version = VERSION;
const isProduction = process.env.NODE_ENV === 'production';

const MESSAGE_TIMEOUT = 3000;
const inspect = !isProduction && true;
const settingsStorage = storage.createStorage('Settings');

export default {
    strict: !isProduction,
    modules: {
        favorite,
        playlist,
        collection,
    },
    state: {
        version: version,
        volume: 1,
        mode: 1,
        lyric: false,
        isPlaying: false,
        // 在首次播放操作之后保持为true
        autoPlay: false,
        isMuted: false,
        isSeekingTime: false,
        seekTime: 0,
        userInfo: {
            token: '',
            username: '正在获取',
            avatarSrc: '',
        },
        size: {
            width: 1000,
            height: 618,
            listWidth: 200,
            controlWidth: 70,
        },
        message: [],
        replayFlag: 1,
    },
    // 对state的一层简单包装
    getters: {
        isLogged: state => state.userInfo.token !== '',
        // 返回正在播放的歌曲是否已收藏，不要用在非特定歌曲和专辑页面中！
        isFavorite: (state, getters) => getters['favorite/favSongs'].includes(getters['playlist/playing'].id),
        width: ({size}) => size.width,
        height: ({size}) => size.height,
        listWidth: ({size}) => size.listWidth,
        controlWidth: ({size}) => size.controlWidth,
        contentWidth: ({size}) => size.width - size.listWidth - size.controlWidth,
    },
    // 对state的原始修改
    mutations: {
        // togglePlay和switchPlaylistHead中会用到，一般设置为true后就不再改变
        setAutoPlay (state, value) {
            state.autoPlay = value;
        },
        setWidth ({size}, value) {
            size.width = value;
        },
        setHeight ({size}, value) {
            size.height = value;
        },
        setListWidth ({size}, value) {
            size.listWidth = value;
        },
        setVolume (state, value) {
            state.volume = u.filterNumber(value, 0, 1);
            if (inspect) {
                console.log(`volume is set to ${state.volume}`);
            }
        },
        setMode (state, int) {
            state.mode = u.filterInteger(int, 1, 4);
            if (inspect) {
                console.log(`mode is set to ${state.mode}`);
            }
        },
        setLyric (state, bool) {
            state.lyric = bool;
            if (inspect) {
                console.log(`lyric is set to ${state.lyric}`);
            }
        },
        setIsPlaying (state, isPlaying) {
            state.isPlaying = isPlaying;
            if (inspect) {
                console.log(`isPlaying is set to ${state.isPlaying}`);
            }
        },
        setIsMuted (state, isMuted) {
            state.isMuted = isMuted;
            if (inspect) {
                console.log(`isMuted is set to ${state.isMuted}`);
            }
        },
        setIsSeekingTime (state, isSeekingTime) {
            state.isSeekingTime = isSeekingTime;
            if (inspect) {
                console.log(`isSeekingTime is set to ${state.isSeekingTime}`);
            }
        },
        setSeekTime (state, seekTime) {
            state.seekTime = seekTime;
            if (inspect) {
                console.log(`seekTime is set to ${state.seekTime}`);
            }
        },
        addMessage ({message}, msg) {
            message.push(msg);
        },
        removeMessage ({message}, index) {
            message.splice(index, 1);
        },
        setUserInfoToken (state, token) {
            state.userInfo.token = token;
        },
        setUserInfoUsername (state, username) {
            state.userInfo.username = username;
        },
        setUserInfoAvatarSrc (state, avatarSrc) {
            state.userInfo.avatarSrc = avatarSrc;
        },
        increaseReplayFlag (state) {
            state.replayFlag += 1;
        },
    },
    // 基于mutations的复杂逻辑和异步逻辑
    actions: {
        // 应从网络获取数据
        getFavorite ({dispatch}) {
            if (!isProduction) {
                dispatch('addFavArtist', favArtists.body);
                dispatch('setBestArtist', favArtists.main);
                dispatch('addFavAlbum', favAlbums.body);
                dispatch('addFavSong', favSongs.body);
            }
        },
        getCollections ({dispatch}) {
            if (!isProduction) {
                Collections.forEach(item => {
                    dispatch('addCollection', item);
                });
            }
        },
        addMessage ({state, commit}, msg) {
            const id = u.counter();
            msg.id = id;
            if (inspect) {
                console.log(msg.content);
            }
            commit('addMessage', msg);
            setTimeout(() => {
                const index = state.message.findIndex(msg => msg.id === id);
                if (inspect) {
                    console.log(`Removing message with id ${index}`);
                }
                commit('removeMessage', index);
            }, MESSAGE_TIMEOUT);
        },
        setUserInfo ({commit}, userInfo) {
            commit('setUserInfoToken', userInfo.token);
            commit('setUserInfoUsername', userInfo.username);
            commit('setUserInfoAvatarSrc', userInfo.avatarSrc);
        },
        resetUserInfo ({dispatch}) {
            dispatch('setUserInfo', {
                token: '',
                username: '',
                avatarSrc: '',
            });
        },
        // token的保存放在fetchUserInfo中去做
        async logIn (context, accessToken) {
            const token = await ajax.postTokenAsync(accessToken);
            if (inspect) {
                console.log('换取token成功');
            }
            return token;
        },
        async fetchUserInfo ({commit}, token) {
            const userInfo = await ajax.getUserInfoAsync(token);
            commit('setUserInfoToken', token);
            commit('setUserInfoUsername', userInfo['name']);
            commit('setUserInfoAvatarSrc', userInfo['portraitUrl']);
            if (inspect) {
                console.log('成功获取了用户信息');
                console.log(userInfo);
            }
            return userInfo;
        },
        async restoreVolume () {
            return await settingsStorage.getItem('volume');
        },
        async restoreMode () {
            return await settingsStorage.getItem('mode');
        },
        async restoreLyric () {
            return await settingsStorage.getItem('lyric');
        },
        async restoreUserInfo () {
            return {
                token: await settingsStorage.getItem('userInfoToken'.toLowerCase()) || '',
                username: await settingsStorage.getItem('userInfoUsername'.toLowerCase()) || '',
                avatarSrc: await settingsStorage.getItem('userInfoAvatarSrc'.toLowerCase()) || '',
            };
        },
        async clearSettingsStorage () {
            console.log('Deleting all key-values in Settings Storage');
            return await settingsStorage.clear();
        },
    },
    plugins: [
        store => {
            store.subscribe(({type, payload}) => {
                if (
                    [
                        'setVolume',
                        'setMode',
                        'setLyric',
                        'setUserInfoToken',
                        'setUserInfoUsername',
                        'setUserInfoAvatarSrc',
                    ].includes(type)
                ) {
                    settingsStorage.setItem(type.slice(3).toLowerCase(), payload);
                }
            });
        },
    ],
};