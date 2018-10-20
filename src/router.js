/**
 * Created by Yunzhe on 2018/8/22.
 */

'use strict';
// 首屏组件不拆分，减少请求数
import Discover from './components/views/discover.vue';

// 其他组件异步延迟加载
const Artist = () => import(/* webpackChunkName: "artist" */ './components/views/artist/artist.vue');
const ArtistDetail = () => import(/* webpackChunkName: "artist" */ './components/views/artist/artist-detail.vue');
const FavArtist = () => import(/* webpackChunkName: "artist" */ './components/views/artist/fav-artist.vue');
const ArtistFilter = () => import(/* webpackChunkName: "artist" */ './components/views/artist/artist-filter.vue');

const Album = () => import(/* webpackChunkName: "album" */ './components/views/album/album.vue');
const AlbumDetail = () => import(/* webpackChunkName: "album" */ './components/views/album/album-detail.vue');
const FavAlbum = () => import(/* webpackChunkName: "album" */ './components/views/album/fav-album.vue');
const AlbumFilter = () => import(/* webpackChunkName: "album" */ './components/views/album/album-filter.vue');

const Collection = () => import(/* webpackChunkName: "collection" */ './components/views/collection/collection.vue');
const CollectionDetail = () => import(/* webpackChunkName: "collection" */ './components/views/collection/collection-detail.vue');
const Playlist = () => import(/* webpackChunkName: "collection" */ './components/views/collection/playlist.vue');
const FavSong = () => import(/* webpackChunkName: "collection" */ './components/views/collection/fav-song.vue');
const CollectionHome = () => import(/* webpackChunkName: "collection" */ './components/views/collection/collection-home.vue');

const Search = () => import(/* webpackChunkName: "search" */ './components/views/search/search.vue');
const SearchArtist = () => import(/* webpackChunkName: "search" */ './components/views/search/search-artist.vue');
const SearchAlbum = () => import(/* webpackChunkName: "search" */ './components/views/search/search-album.vue');
const SearchSong = () => import(/* webpackChunkName: "search" */ './components/views/search/search-song.vue');
const SearchCollection = () => import(/* webpackChunkName: "search" */ './components/views/search/search-collection.vue');

const routers = [
    {
        path: '/discover',
        name: 'discover',
        meta: {
            title: '首页：发现音乐',
        },
        component: Discover,
    },
    {
        path: '/artist',
        meta: {
            title: '歌手页',
        },
        component: Artist,
        children: [
            {
                path: '/myArtists',
                name: 'fav-artist',
                meta: {
                    title: '我加推的歌手',
                },
                component: FavArtist,
            },
            {
                path: ':id',
                name: 'artist-detail',
                meta: {
                    title: '歌手详情',
                },
                component: ArtistDetail,
                props: true,
            },
            {
                path: '',
                name: 'artist',
                meta: {
                    title: '歌手检索',
                },
                component: ArtistFilter,
                // Temp
                redirect: {
                    name: 'fav-artist',
                },
            },
        ],
    },
    {
        path: '/album',
        meta: {
            title: '专辑页',
        },
        component: Album,
        children: [
            {
                path: '/myAlbums',
                name: 'fav-album',
                meta: {
                    title: '我收藏的专辑',
                },
                component: FavAlbum,
            },
            {
                path: ':id',
                name: 'album-detail',
                meta: {
                    title: '专辑详情',
                },
                component: AlbumDetail,
                props: true,
            },
            {
                path: '',
                name: 'album',
                meta: {
                    title: '专辑检索',
                },
                component: AlbumFilter,
                // Temp
                redirect: {
                    name: 'fav-album',
                },
            },
        ],
    },
    {
        path: '/collection',
        meta: {
            title: '歌单页',
        },
        component: Collection,
        children: [
            {
                path: '/mySongs',
                name: 'fav-song',
                meta: {
                    title: '我喜欢的歌曲',
                },
                component: FavSong,
            },
            {
                path: '/playlist',
                name: 'playlist',
                meta: {
                    title: '播放列表',
                },
                component: Playlist,
            },
            // 要是太早了会影响前面俩的判断
            {
                path: ':id',
                name: 'collection-detail',
                meta: {
                    title: '歌单详情',
                },
                component: CollectionDetail,
                props: true,
            },
            {
                path: '',
                name: 'collection',
                meta: {
                    title: '歌单主页',
                },
                component: CollectionHome,
            },
        ],
    },
    {
        path: '/search',
        // 这个name与content-header中的路由判断有关，谨慎修改
        name: 'search',
        meta: {
            title: '搜索页',
        },
        component: Search,
        children: [
            {
                path: 'artist/:keywords',
                name: 'search-artist',
                meta: {
                    title: '搜索结果：歌手',
                },
                component: SearchArtist,
                props: true,
            },
            {
                path: 'album/:keywords',
                name: 'search-album',
                meta: {
                    title: '搜索结果：专辑',
                },
                component: SearchAlbum,
                props: true,
            },
            {
                path: 'song/:keywords',
                name: 'search-song',
                meta: {
                    title: '搜索结果：歌曲',
                },
                component: SearchSong,
                props: true,
            },
            {
                path: 'collection/:keywords',
                name: 'search-collection',
                meta: {
                    title: '搜索结果：歌单',
                },
                component: SearchCollection,
                props: true,
            },
        ],
    },
    {
        path: '*',
        redirect: {
            name: 'discover',
        },
    },
];

const beforeEnter = (to, from, next) => {
    window.document.title = to.meta.title;
    next();
};

const addBeforeEnter = router => {
    router.beforeEnter = beforeEnter;
};

(function addBeforeEnterR (routers) {
    routers.forEach(route => {
        if (route.children) {
            addBeforeEnterR(route.children);
        }
        addBeforeEnter(route);
    });
})(routers);

// 路由配置
export default {
    // 使用HTML 5的History模式
    mode: window.history && history.pushState ? 'history' : 'hash',
    routes: routers,
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {x: 0, y: 0};
        }
    },
};