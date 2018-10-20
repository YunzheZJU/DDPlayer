/**
 * Created by Yunzhe on 2018/9/27.
 */

'use strict';

import u from '../../libs/util';

const inspect = process.env.NODE_ENV !== 'production' && false;

export default {
    namespaced: true,
    state: {
        songs: [],
        albums: [],
        artists: [],
        bestArtist: 0,
    },
    getters: {
        // 第一个参数为当前模块state
        favSongs: ({songs}) => songs,
        favAlbums: ({albums}) => albums,
        favArtists: ({artists}) => artists,
        bestArtist: ({bestArtist}) => bestArtist,
    },
    mutations: {
        // 第一个参数为当前模块state，可以使用解构赋值
        setBestArtist (state, id) {
            // id应在favArtists中，或为0
            if (state.artists.includes(id) || id === 0) {
                state.bestArtist = id;
            } else {
                if (inspect) {
                    console.error(`bestArtist id '${id}' is not in favArtists!`);
                }
            }
        },
        addFavArtist ({artists}, list) {
            artists.push(...u.toNewArray(list).filter(id => !artists.includes(id)));
        },
        removeFavArtist ({artists}, id) {
            const index = artists.indexOf(id);
            if (index !== -1) {
                artists.splice(index, 1);
            }
        },
        addFavAlbum ({albums}, list) {
            albums.push(...u.toNewArray(list).filter(id => !albums.includes(id)));
        },
        removeFavAlbum ({albums}, id) {
            const index = albums.indexOf(id);
            if (index !== -1) {
                albums.splice(index, 1);
            }
        },
        addFavSong ({songs}, list) {
            songs.push(...u.toNewArray(list).filter(id => !songs.includes(id)));
        },
        removeFavSong ({songs}, id) {
            const index = songs.indexOf(id);
            if (index !== -1) {
                songs.splice(index, 1);
            }
        },
    },
    actions: {
        addFavArtist: {
            root: true,
            handler ({commit}, list) {
                setTimeout(() => {
                    commit('addFavArtist', list);
                }, 500);
            },
        },
        removeFavArtist: {
            root: true,
            handler ({commit}, id) {
                setTimeout(() => {
                    commit('removeFavArtist', id);
                }, 500);
            },
        },
        setBestArtist: {
            root: true,
            handler ({commit}, id) {
                setTimeout(() => {
                    commit('setBestArtist', id);
                }, 500);
            },
        },
        addFavAlbum: {
            root: true,
            handler ({commit}, list) {
                setTimeout(() => {
                    commit('addFavAlbum', list);
                }, 500);
            },
        },
        removeFavAlbum: {
            root: true,
            handler ({commit}, id) {
                setTimeout(() => {
                    commit('removeFavAlbum', id);
                }, 500);
            },
        },
        addFavSong: {
            root: true,
            handler ({commit}, list) {
                setTimeout(() => {
                    commit('addFavSong', list);
                }, 500);
            },
        },
        removeFavSong: {
            root: true,
            handler ({commit}, id) {
                setTimeout(() => {
                    commit('removeFavSong', id);
                }, 500);
            },
        },
    },
};
