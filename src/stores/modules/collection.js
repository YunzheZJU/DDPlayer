/**
 * Created by Yunzhe on 2018/10/3.
 */

'use strict';

const inspect = process.env.NODE_ENV !== 'production' && false;

export default {
    namespaced: true,
    state: {
        collections: [],
    },
    getters: {
        collections: ({collections}) => collections,
        collectionsLength: ({collections}) => collections.length,
        collectionOfId: ({collections}) => id => collections.find(item => item['id'] === ~~id),
        collectionIndexOfId: ({collections}) => id => collections.findIndex(item => item['id'] === ~~id),
    },
    mutations: {
        addCollection ({collections}, newCollection) {
            collections.push(newCollection);
        },
        removeCollection ({collections}, id) {
            const index = collections.findIndex(item => ~~item['id'] === ~~id);
            if (index !== -1) {
                collections.splice(index, 1);
            } else {
                if (inspect) {
                    console.error(`Collection id ${id} not found`);
                }
            }
        },
        setCollectionName ({collections}, {index, name}) {
            collections[index].name = name;
        },
        setCollectionDescription ({collections}, {index, description}) {
            collections[index].description = description;
        },
        setCollectionPlaylist ({collections}, {index, playlist}) {
            collections[index].playlist = playlist;
        },
        setCollectionCover ({collections}, {index, cover}) {
            collections[index].cover = cover;
        },
        addSongToCollection ({collections}, {index, songId}) {
            collections[index].playlist.unshift(songId);
        },
        removeSongFromCollection ({collections}, {index, songId}) {
            const songIndex = collections[index].playlist.findIndex(id => id === songId);
            collections[index].playlist.splice(songIndex, 1);
        },
    },
    actions: {
        addCollection: {
            root: true,
            handler: ({commit}, collection) => {
                commit('addCollection', collection);
            },
        },
        deleteCollection: {
            root: true,
            handler: ({commit}, id) => {
                commit('removeCollection', id);
            },
        },
        setCollectionName: {
            root: true,
            handler: ({commit, getters}, {id, name}) => {
                commit('setCollectionName', {index: getters.collectionIndexOfId(id), name});
            },
        },
        setCollectionDescription: {
            root: true,
            handler: ({commit, getters}, {id, description}) => {
                commit('setCollectionDescription', {index: getters.collectionIndexOfId(id), description});
            },
        },
        setCollectionPlaylist: {
            root: true,
            handler: ({commit, getters}, {id, playlist}) => {
                commit('setCollectionPlaylist', {index: getters.collectionIndexOfId(id), playlist});
            },
        },
        setCollectionCover: {
            root: true,
            handler: ({commit, getters}, {id, cover}) => {
                commit('setCollectionCover', {index: getters.collectionIndexOfId(id), cover});
            },
        },
        addSongToCollection: {
            root: true,
            handler: ({commit, getters}, {id, songId}) => {
                const playlist = getters.collectionOfId(id).playlist;
                if (!playlist.includes(songId)) {
                    commit('addSongToCollection', {index: getters.collectionIndexOfId(id), songId: songId});
                    if (getters.collectionOfId(id).playlist.length === 1) {
                        commit('setCollectionCover', {index: getters.collectionIndexOfId(id), cover: 0});
                    }
                }
            },
        },
        removeSongFromCollection: {
            root: true,
            handler: ({commit, getters}, {id, songId}) => {
                const playlist = getters.collectionOfId(id).playlist;
                if (playlist.includes(songId)) {
                    commit('removeSongFromCollection', {index: getters.collectionIndexOfId(id), songId: songId});
                    if (getters.collectionOfId(id).playlist.length < getters.collectionOfId(id).cover + 1) {
                        commit('setCollectionCover', {index: getters.collectionIndexOfId(id), cover: getters.collectionOfId(id).playlist.length - 1});
                    }
                }
            },
        },
        createNewCollection: {
            root: true,
            handler: async ({commit, getters}, {name, description, playlist, cover}) => {
                const newId = getters.collectionsLength + 1;
                commit('addCollection', {
                    id: newId,
                    name,
                    description,
                    playlist,
                    cover,
                });
                return newId;
            },
        },
    },
};