/**
 * Created by Yunzhe on 2018/9/27.
 */

'use strict';

import storage from '../../libs/storage';
import u from '../../libs/util';
import ajax from '../../plugins/ajax';

const REPLAY_MYSELF = 'REPLAY_MYSELF';
const MAX_PLAYED = 50;
const SAVE_INTERVAL = 5000;
const inspect = process.env.NODE_ENV !== 'production' && false;

const playlistStorage = storage.createStorage('Playlist');
export default {
    namespaced: true,
    state: {
        // played.body是允许在任意位置删除，但只能在末尾添加的结构
        played: {
            maxLength: MAX_PLAYED,
            body: [],
        },
        // playlist.body是允许在任意位置删除和在head + 1和末尾添加的结构
        playlist: {
            head: -1,
            body: [],
        },
    },
    getters: {
        noPlaying: (state, getters) => getters.playlistHead === -1,
        played: state => state.played.body,
        playedLength: (state, getters) => getters.played.length,
        playlist: state => state.playlist.body,
        playlistHead: state => state.playlist.head,
        playlistLength: (state, getters) => getters.playlist.length,
        // 使用playlist和head来提供正在播放的歌曲信息
        playing: (state, getters) => getters.playlist[getters.playlistHead] || {},
        nextSong: (state, getters) => getters.playlist[getters.nextSongIndex],
        nextSongIndex: (state, getters) => {
            let next = getters.playlistOrder[getters.playlistHead];
            if (next === REPLAY_MYSELF) {
                next = getters.playlistHead;
            }
            return next;
        },
        playlistOrderMode1: (state, getters) => {
            const order = [];
            for (let i = 0; i < getters.playlistLength; i++) {
                order[i] = i + 1;
            }
            if (getters.playlistLength) {
                order[getters.playlistLength - 1] = 0;
            }

            return order;
        },
        playlistOrderMode2: (state, getters) => {
            const order = [];
            for (let i = 0; i < getters.playlistLength; i++) {
                // 表示使用Head的当前值
                order[i] = REPLAY_MYSELF;
            }

            return order;
        },
        playlistOrderMode3: (state, getters) => {
            const order = [];
            for (let i = 0; i < getters.playlistLength; i++) {
                order[i] = i;
            }
            u.shuffle(order);

            return order;
        },
        playlistOrderMode4: (state, getters) => {
            const order = [];
            for (let i = 0; i < getters.playlistLength; i++) {
                order[i] = i + 1;
            }
            if (getters.playlistLength) {
                // 表示一轮循环之后停止播放
                order[getters.playlistLength - 1] = -1;
            }

            return order;
        },
        playlistOrder: (state, getters, rootState) => {
            // 注意每个都会构造一个新数组，但有对playlistLength的依赖
            if (rootState.mode === 1) {
                return getters.playlistOrderMode1;
            } else if (rootState.mode === 2) {
                return getters.playlistOrderMode2;
            } else if (rootState.mode === 3) {
                return getters.playlistOrderMode3;
            } else if (rootState.mode === 4) {
                return getters.playlistOrderMode4;
            }
        },
    },
    mutations: {
        // 对于播放历史，仅提供选定删除和追加操作即可满足所有需求
        // 从播放历史中删除
        deleteFromPlayed (state, index) {
            return state.played.body.splice(index, 1);
        },
        // 听过的歌会被添加到播放历史
        appendToPlayed (state, song) {
            return state.played.body.push(song);
        },
        // 初始化时会用到
        setPlayed (state, played) {
            state.played.body = played;
        },
        // 从播放队列中删除
        deleteFromPlaylist (state, index) {
            return state.playlist.body.splice(index, 1);
        },
        // 添加到播放队列，“下一首播放”时添加到head之后一首，“加入队列”时在尾部添加
        insertIntoPlaylist (state, {index, song}) {
            // 不能直接传数组进去，要展开一下
            state.playlist.body.splice(index, 0, ...song);
        },
        // 切歌时频繁用到，必须和setPlaying共同使用，所以仅允许由switchPlaylistHead调用
        setPlaylistHead (state, head) {
            if (inspect) {
                console.log(`head is set to ${head} / ${state.playlist.body.length}`);
            }
            state.playlist.head = head;
        },
        // 初始化时会用到
        setPlaylist (state, playlist) {
            state.playlist = playlist;
        },
        setPlaylistBody (state, playlistBody) {
            state.playlist.body = [...playlistBody];
        },
    },
    actions: {
        // 模拟异步操作
        addToPlayed ({state, getters, commit, dispatch}, song) {
            // 如果完全一致就删除重复记录，参照网易云音乐的做法
            for (let i = 0; i < getters.playedLength; i++) {
                if (getters.played[i].id === song.id) {
                    dispatch('removeFromPlayed', i, {root: true});
                    // 照理来说只会有一首重复的，保险起见还是都检查一遍吧
                    // break;
                }
            }
            // 如果播放历史数量达到上限了，删除一首
            if (getters.playedLength === state.played.maxLength) {
                commit('deleteFromPlayed', 0);
            }
            commit('appendToPlayed', song);
            dispatch('savePlayed');
            // FIXME 出现了迷之空项被添加进played
            // console.log('add to played():');
            // console.log(song);
        },
        removeFromPlayed: {
            root: true,
            handler ({getters, commit, dispatch}, index) {
                if (index < 0 || index > getters.playedLength) {
                    if (inspect) {
                        console.log('removeFromPlayed: OverBounding!');
                    }
                }
                commit('deleteFromPlayed', index);
                dispatch('savePlayed');
            },
        },
        clearPlayed: {
            root: true,
            handler ({commit, getters, dispatch}) {
                const length = getters.playedLength;
                for (let i = 0; i < length; i++) {
                    commit('deleteFromPlayed', 0);
                }
                dispatch('savePlayed');
            },
        },
        // 2-in-1
        addToPlaylist: {
            root: true,
            handler ({getters, commit, dispatch}, {position, song}) {
                // 做一个新数组
                song = u.toNewArray(song);
                if (!song.length) {
                    return;
                }
                // 这里需要检查加入播放列表的歌曲是否与播放列表中已有歌曲重复
                // 若与正在播放的歌曲重复则保留正在播放的歌曲
                // 否则删去播放列表中的重复歌曲
                // 检查到与正在播放的歌曲一致时song.length会变化
                for (let i = 0; i < song.length; i++) {
                    // 检查是否与正在播放的歌曲一致
                    if (song[i].id === getters.playing.id) {
                        song.splice(i, 1);
                        i--;
                        continue;
                    }
                    for (let j = 0; j < getters.playlistLength; j++) {
                        // 如果完全一致就删除重复记录，参照网易云音乐的做法
                        if (getters.playlist[j].id === song[i].id) {
                            // 其中包含head位置的处理
                            dispatch('removeFromPlaylist', j, {root: true});
                            // 照理来说只会有一首重复的，保险起见还是都检查一遍吧
                            // break;
                        }
                    }
                }

                if (position === 'head') {
                    commit('insertIntoPlaylist', {index: getters.playlistHead + 1, song});
                } else if (position === 'tail') {
                    commit('insertIntoPlaylist', {index: getters.playlistLength, song});
                }
                dispatch('savePlaylist');
                // 调整播放头
                if (getters.playlistHead === -1) {
                    dispatch('switchPlaylistHead', 0, {root: true});
                }
            },
        },
        removeFromPlaylist: {
            root: true,
            handler ({getters, commit, dispatch}, index) {
                if (index < 0 || index > getters.playlistLength) {
                    if (inspect) {
                        console.log('removeFromPlayed: OverBounding!');
                        return;
                    }
                }
                commit('deleteFromPlaylist', index);
                dispatch('savePlaylist');
                // 调整播放头
                if (inspect) {
                    console.log(`Removing from playlist: ${index}, head is at ${getters.playlistHead}`);
                }
                if (getters.playlistHead >= index) {
                    dispatch('switchPlaylistHead', getters.playlistHead - 1, {root: true});
                }
            },
        },
        clearPlaylist: {
            root: true,
            handler ({commit, getters, dispatch}) {
                // 复位播放头，若不在删除之前先复位，在删除最后一首歌时由于noPlaying为false，会添加一首空歌
                dispatch('switchPlaylistHead', -1, {root: true});
                const length = getters.playlistLength;
                for (let i = 0; i < length; i++) {
                    commit('deleteFromPlaylist', 0);
                }
                dispatch('savePlaylist');
            },
        },
        playNewPlaylist: {
            root: true,
            handler ({commit, dispatch}, playlist) {
                if (!playlist.length) {
                    return;
                }
                // 将播放头设置为-1
                dispatch('switchPlaylistHead', -1, {root: true});
                // 用playlist替换播放队列
                commit('setPlaylistBody', playlist);
                dispatch('savePlaylist');
                // 将播放头设置为0
                dispatch('switchPlaylistHead', 0, {root: true});
            },
        },
        // “立即播放”按钮
        playNewSong: {
            root: true,
            handler ({dispatch}, song) {
                // 将播放头设置为-1
                dispatch('switchPlaylistHead', -1, {root: true});
                // 将song作为下一首插入播放队列
                dispatch('addToPlaylist', {position: 'head', song}, {root: true});
                // 将播放头设置为0
                dispatch('switchPlaylistHead', 0, {root: true});
            },
        },
        // 自然切歌，根据模式选择
        playNextSongPassive: {
            root: true,
            handler ({getters, dispatch}) {
                dispatch('switchPlaylistHead', getters.nextSongIndex, {root: true});
            },
        },
        // “下一首”按钮
        playNextSong: {
            root: true,
            handler ({getters, dispatch, rootState}) {
                let next;
                if ([1, 2, 4].includes(rootState.mode)) {
                    next = getters.playlistOrderMode1[getters.playlistHead];
                } else {
                    next = getters.playlistOrderMode3[getters.playlistHead];
                }
                // 播放列表为空的情况
                if (next === undefined) {
                    next = -1;
                }
                dispatch('switchPlaylistHead', next, {root: true});
            },
        },
        // “上一首”按钮
        playPreviousSong: {
            root: true,
            handler ({getters, dispatch, rootState}) {
                if (getters.playlistLength <= 1) {
                    // 若播放列表的长度小于等于1：等于1的情况为播放列表只有正在播放的歌曲，小于1的情况为空播放列表
                    if (getters.playedLength) {
                        // 若存在播放历史
                        // 将播放历史的最后一首添加在播放列表头部并播放
                        dispatch('playNewSong', getters.played[getters.playedLength - 1], {root: true});
                    } else {
                        // 若不存在播放历史：重复播放自身（有正在播放的歌曲）/什么都不做（没有正在播放的歌曲）
                        if (getters.playlistLength === 1) {
                            dispatch('switchPlaylistHead', getters.playlistHead, {root: true});
                        }
                    }
                } else {
                    if ([1, 2, 4].includes(rootState.mode)) {
                        if (getters.playlistHead === 0) {
                            dispatch('switchPlaylistHead', getters.playedLength - 1, {root: true});
                        } else {
                            dispatch('switchPlaylistHead', getters.playlistHead - 1, {root: true});
                        }
                    } else {
                        dispatch('switchPlaylistHead', getters.playlistOrderMode3.indexOf(getters.playlistHead),
                            {root: true});
                    }
                }
            },
        },
        switchPlaylistHead: {
            root: true,
            handler ({getters, commit, dispatch, rootState}, head) {
                if (head === getters.playlistHead) {
                    // 若与当前head一致
                    // 从头播放
                    commit('increaseReplayFlag', null, {root: true});
                } else {
                    // 否则修改head
                    if (!getters.noPlaying) {
                        dispatch('addToPlayed', getters.playing);
                    }
                    commit('setPlaylistHead', head);
                    dispatch('savePlaylist');
                }
                if (!rootState.autoPlay) {
                    commit('setAutoPlay', true, {root: true});
                }
            },
        },
        savePlayed: u.thresholdAsync(async ({getters}) => {
            // 其实只存了played.body
            await playlistStorage.setItem('Played', getters.played.map(item => item['id']));
            console.log('Played saved');
        }, SAVE_INTERVAL),
        restorePlayed: {
            root: true,
            handler: async ({commit}) => {
                const playedSongs = await playlistStorage.getItem('Played');
                if (playedSongs && playedSongs.length) {
                    const played = await ajax.getSongsSimpleAsync(playedSongs);
                    commit('setPlayed', played);
                }
            },
        },
        savePlaylist: u.thresholdAsync(async ({state}) => {
            const playlistBody = {};
            state.playlist.body.forEach(item => {
                playlistBody[item.id] = item.from;
            });
            await playlistStorage.setItem('Playlist', {
                head: state.playlist.head,
                body: playlistBody,
            });
            console.log('Playlist saved');
        }, SAVE_INTERVAL),
        restorePlaylist: {
            root: true,
            handler: async ({commit}) => {
                const playlist = await playlistStorage.getItem('Playlist');
                if (playlist && Object.keys(playlist.body).length) {
                    const playlistBody = (await ajax.getSongsSimpleAsync(Object.keys(playlist.body))).map(item => ({
                        ...item,
                        from: playlist.body[item.id],
                    }));
                    if (inspect) {
                        console.log('Restored playlist from storage:');
                        console.log(playlistBody);
                    }
                    commit('setPlaylist', {
                        head: playlist.head,
                        body: playlistBody,
                    });
                }
            },
        },
        async clearSettingsStorage () {
            console.log('Deleting all key-values in Playlist Storage');
            return await playlistStorage.clear();
        },
    },
};