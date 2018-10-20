/**
 * Created by Yunzhe on 2018/10/5.
 */

'use strict';

import storage from '../libs/storage';
import u from '../libs/util';

const SIZE = {
    artists: {
        full: 1,
        recent: 20,
        search: 20,
    },
    albums: {
        full: 20,
        recent: 20,
        search: 20,
    },
    songs: {
        full: 20,
        recent: 20,
        search: 20,
    },
};
const API = {
    artists: {
        full: 'artist',
        recent: 'artist/recent',
        search: 'artist/search/keyword',
    },
    albums: {
        full: 'album',
        recent: 'album/recent',
        search: 'album/search/keyword',
    },
    songs: {
        full: 'song',
        recent: 'song/recent',
        search: 'song/search/keyword',
    },
};
const FIELD = {
    artists: 'simpleArtistInfos',
    albums: 'simpleAlbumInfos',
    songs: 'simpleSongInfos',
};
const USE_CACHE = true;
const inspect = process.env.NODE_ENV !== 'production' && false;

const cacheStorage = storage.createStorage('AjaxCache');

const cache = {
    artists: {},
    albums: {},
    songs: {},
};

const getInfos = async (type, list) => {
    const fragmentSize = SIZE[type]['full'];
    const api = API[type]['full'];

    list = u.toNewArray(list);

    const fromCache = [];
    let listForNetwork = [];

    if (USE_CACHE) {
        list.forEach(item => {
            if (cache[type][item]) {
                fromCache.push(cache[type][item]);
            } else {
                listForNetwork.push(item);
            }
        });
    } else {
        listForNetwork = list;
    }

    const fromNetwork = listForNetwork.length === 0 ? [] :
        await [...Array(Math.ceil(listForNetwork.length / fragmentSize)).keys()].map(
            i => listForNetwork.slice(i * fragmentSize, (i + 1) * fragmentSize),
        ).map(
            async fragment => await u.ajax.get(api + '?' + fragment.map(item => `id=${item}`).join('&')).catch(
                error => {
                    console.error(error);
                    console.log('从网络获取数据时出错');
                },
            ),
        ).map(
            async response => u.toNewArray(await response),
        ).reduce(
            async (prevArray, nextArray) => (await prevArray).concat(await nextArray), [],
        ).catch(error => {
            console.error(error);
            console.log('处理来自网络的数据时出错');
            return [];
        });

    if (USE_CACHE) {
        fromNetwork.map(
            item => cache[type][item['id']] = item,
        );
        saveCache(type).then(() => {
            if (inspect) {
                console.log('Cache successfully saved');
            }
        });
        if (inspect) {
            console.log(cache);
        }
    }

    return fromNetwork.map(u.filterInfos[type]).concat(fromCache);
};

const getRecent = async (type, size) => {
    const fragmentSize = SIZE[type]['recent'];
    const api = API[type]['recent'];

    return await [...Array(size).keys()].filter(
        i => i % fragmentSize === 0,
    ).map(
        async i => await u.ajax.get(
            api, {params: {from: i + 1, size: Math.min(fragmentSize, size - i)}},
        ).catch(
            error => {
                console.error(error);
                console.log('从网络获取数据时出错');
            },
        ),
    ).reduce(
        async (prevArray, nextArray) => (await prevArray).concat(await nextArray), [],
    ).catch(error => {
        console.error(error);
        console.log('处理来自网络的数据时出错');
        return [];
    });
};

const getSearch = async (type, keyword, size) => {
    const fragmentSize = SIZE[type]['search'];
    const api = API[type]['search'];

    return await [...Array(size).keys()].filter(
        i => i % fragmentSize === 0,
    ).map(
        async i => await u.ajax.get(
            `${api}/${keyword}`, {params: {from: i + 1, size: Math.min(fragmentSize, size - i)}},
        ).catch(
            error => {
                console.error(error);
                console.log('从网络获取数据时出错');
            },
        ),
    ).map(
        async result => (await result)[FIELD[type]],
    ).reduce(
        async (prevArray, nextArray) => (await prevArray).concat(await nextArray), [],
    ).catch(error => {
        console.error(error);
        console.log('处理来自网络的数据时出错');
    });
};

const restoreCache = async type => {
    const result = await cacheStorage.getItem(type) || {};
    // 在刚启动应用时避免与同一时间新存入的异步数据冲突，不可以直接用取出来的数据对象
    Object.keys(result).forEach(key => {
        if (!cache[type][key]) {
            cache[type][key] = result[key];
        }
    });
};

const saveCache = async type => await cacheStorage.setItem(type, cache[type]);

const postTokenAsync = async token => await u.ajax.post('/token', `"${token}"`, {
    headers: {
        'Content-Type': 'application/json',
    },
});

const getUserInfoAsync = async token => await u.ajax.get('/me', {
    headers: {
        // Bearer为token_type的值，这里硬编码进来了
        // https://stackoverflow.com/questions/5925954/what-are-bearer-tokens-and-token-type-in-oauth-2
        'Authorization': `Bearer ${token}`,
    },
});

const getSongsFullAsync = async (songs) => await getInfos('songs', songs);

const getSongsSimpleAsync = async (songs) => await getSongsFullAsync(songs);

const Ajax = {
    postTokenAsync,
    getUserInfoAsync,
    getSongsSimpleAsync,
};

Ajax.install = Vue => {
    Vue.prototype.$ajax = new Vue({
        methods: {
            async getArtistsFullAsync (artists) {
                return await getInfos('artists', artists);
            },
            async getAlbumsFullAsync (albums) {
                return await getInfos('albums', albums);
            },
            async getAlbumSongsSimpleAsync (album) {
                return (await u.ajax.get(`song/album/${album}/simple`)).map(u.filterInfos['songs']);
            },
            async getRecentArtistsFullAsync (size) {
                const artistsInfo = await getRecent('artists', size);
                return await this.getArtistsFullAsync(artistsInfo.map(artistInfo => artistInfo['id']));
            },
            async getRecentAlbumsFullAsync (size) {
                const albumsInfo = await getRecent('albums', size);
                return await this.getAlbumsFullAsync(albumsInfo.map(albumInfo => albumInfo['id']));
            },
            async getRecentSongsFullAsync (size) {
                const songsInfo = await getRecent('songs', size);
                return await this.getSongsFullAsync(songsInfo.map(songInfo => songInfo['id']));
            },
            async getSearchArtistsFullAsync (keyword, size) {
                const artistsInfo = await getSearch('artists', keyword, size);
                return await this.getArtistsFullAsync(artistsInfo.map(artistInfo => artistInfo['id']));
            },
            async getSearchAlbumsFullAsync (keyword, size) {
                const albumsInfo = await getSearch('albums', keyword, size);
                return await this.getAlbumsFullAsync(albumsInfo.map(albumInfo => albumInfo['id']));
            },
            async getSearchSongsFullAsync (keyword, size) {
                const songsInfo = await getSearch('songs', keyword, size);
                return await this.getSongsFullAsync(songsInfo.map(songInfo => songInfo['id']));
            },
            async restoreAllCache () {
                if (USE_CACHE) {
                    await restoreCache('artists');
                    await restoreCache('albums');
                    await restoreCache('songs');
                    return cache;
                } else {
                    return Promise.resolve();
                }
            },
            async clearCacheStorage () {
                console.log('Deleting all key-values in AjaxCache Storage');
                return await cacheStorage.clear();
            },
            postTokenAsync,
            getUserInfoAsync,
            getSongsFullAsync,
            getSongsSimpleAsync,
        },
    });
};

export default Ajax;