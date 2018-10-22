/**
 * Created by Yunzhe on 2018/8/23.
 */

'use strict';
import axios from 'axios';
import API from '../api';

// noinspection JSUnresolvedVariable
const isPublic = IS_PUBLIC;

// 基本配置
const Util = {
    apiPath: API[isPublic ? 'public' : 'private'].api,
};

// Ajax通用配置
Util.ajax = axios.create({
    baseURL: Util.apiPath + '/',
});

// 添加响应拦截器
Util.ajax.interceptors.response.use(res => res.data);

Util.filterNumber = (value, min, max) => {
    if (typeof value !== 'number') {
        return undefined;
    }

    if (value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }

    return value;
};

Util.filterInteger = (value, min, max) => {
    value = Util.filterNumber(value, min, max);
    return ~~value;
};

Util.formatTime = time => {
    time = Util.filterInteger(time, 0, 6000 - 1);
    const minute = Math.floor(time / 60);
    const second = time % 60;
    return `${minute}:${(second < 10 ? '0' : '') + second}`;
};

const filterArtistInfo = info => {
    // 图片Url，63号歌手imageUrl怎么为null
    info.imageUrl = `${Util.apiPath}${info.imageUrl}`;

    return info;
};

const filterAlbumInfo = info => {
    // 封面Url
    info.imageUrl = `${Util.apiPath}${info.imageUrl}`;
    // 歌手
    info.artist = [];
    if (info['simpleArtistInfos']) {
        info.artist = info['simpleArtistInfos'].map(infoA => infoA.name);
    }
    // 作品
    info.work = '';
    if (info['simpleWorkInfo']) {
        info.work = info['simpleWorkInfo'].title;
    }
    // 发行时间
    info.releaseDate = info['releaseDate'].split('T')[0];

    return info;
};

const filterSongInfo = info => {
    // 为每个条目整理信息
    // 封面Url
    info.imageUrl = `${Util.apiPath}${info.imageUrl}`;
    // 文件Url
    info.fileUrl = `${Util.apiPath}${info.fileUrl}`;
    // 时长
    info.durationFmt = Util.formatTime(info.duration / 1000);
    // 音质
    info.state = {
        1: 'HQ',
        2: 'SQ',
    }[info.state];
    // 歌手
    info.artist = [];
    if (info['simpleArtistInfos']) {
        info.artist = info['simpleArtistInfos'].map(infoA => infoA.name);
    }
    // 专辑
    info.album = '';
    if (info['simpleAlbumInfo']) {
        info.album = info['simpleAlbumInfo'].title;
    }
    // 作品
    info.work = '';
    if (info['simpleWorkInfo']) {
        info.work = info['simpleWorkInfo'].title;
    }

    return info;
};

Util.filterInfos = {
    'artists': filterArtistInfo,
    'albums': filterAlbumInfo,
    'songs': filterSongInfo,
};

Util.counter = (initialValue => {
    let count = initialValue;
    return () => {
        count += 1;
        return count;
    };
})(1);

// 构造一个随机自循环的类链表结构
Util.shuffle = arr => {
    const candidates = [...arr];
    const initial = 0;
    candidates.splice(initial, 1);

    let current = initial;
    while (candidates.length) {
        const next = Math.floor(Math.random() * candidates.length);
        current = arr[current] = candidates[next];
        // 从候选中去掉自身
        candidates.splice(next, 1);
    }

    arr[current] = initial;

    return arr;
};

Util.toNewArray = x => x instanceof Array ? [...x] : [x];

// 对函数进行装饰
Util.threshold = (fn, interval) => {
    let timeStamp = 0;
    let timeoutHandler = -1;
    return (...args) => {
        const newTime = Date.now();
        // 将前一个延时函数清除
        clearTimeout(timeoutHandler);
        timeoutHandler = -1;
        if (newTime - timeStamp > interval) {
            timeStamp = newTime;
            return fn(...args);
        } else {
            timeoutHandler = setTimeout(() => {
                timeStamp = Date.now();
                resolve(fn(...args));
            }, interval);
        }
    };
};

// 新的顶替旧的
Util.thresholdAsync = (fnAsync, interval) => {
    let timeStamp = 0;
    let timeoutHandler = -1;
    return async (...args) => {
        const newTime = Date.now();
        // 将前一个延时函数清除，需要注意的是那个函数所在的Promise将永远是pending状态，会产生内存问题吗？
        clearTimeout(timeoutHandler);
        timeoutHandler = -1;
        if (newTime - timeStamp > interval) {
            timeStamp = newTime;
            return await fnAsync(...args);
        } else {
            return new Promise(resolve => {
                timeoutHandler = setTimeout(async () => {
                    timeStamp = Date.now();
                    resolve(await fnAsync(...args));
                }, interval);
            });
        }
    };
};

export default Util;