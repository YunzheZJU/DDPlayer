/**
 * Created by Yunzhe on 2018/8/24.
 */

'use strict';
export default {
    playlist: [
        {
            key: 'playlist',
            name: '播放列表',
            to: {
                name: 'playlist',
            },
            icon: 'playlist-1',
        },
    ],
    shortcut: [
        {
            key: 'discover',
            name: '发现新音乐',
            to: {
                name: 'discover',
            },
            icon: 'home',
        },
        {
            key: 'fav-artist',
            name: '我加推的歌手',
            to: {
                name: 'fav-artist',
            },
            icon: 'light-1',
            color: 'theme',
            active: {
                icon: 'light-2',
                color: 'inherit',
            },
        },
        {
            key: 'fav-album',
            name: '我收藏的专辑',
            to: {
                name: 'fav-album',
            },
            icon: 'disk-1',
        },
        {
            key: 'fav-song',
            name: '我喜欢的音乐',
            to: {
                name: 'fav-song',
            },
            icon: 'favorite-1',
        },
    ],
    collection: [
        {
            key: 'collection-create',
            name: '创建新歌单',
            to: {
                name: 'collection-detail',
                params: {
                    id: 'newPlaylist',
                },
            },
            icon: 'plus',
        },
    ],
};