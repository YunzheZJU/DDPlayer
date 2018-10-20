/**
 * Created by Yunzhe on 2018/10/4.
 */

'use strict';
const inspect = process.env.NODE_ENV !== 'production' && false;

export default function (Vue) {
    const hash = {};
    const hashChangeListeners = [];

    const hasher = {
        clear () {
            Object.keys(hash).forEach(key => {
                delete hash[key];
            });

            this.upload();
        },
        set (key, value = true) {
            hash[key] = value;

            this.upload();
        },
        remove (keys) {
            keys = keys instanceof Array ? [...keys] : [keys];

            keys.forEach(key => {
                delete hash[key];
            });

            this.upload();
        },
        upload () {
            const hashStringList = [];

            for (const key in hash) {
                if (!hash.hasOwnProperty(key) || typeof hash[key] === 'function') {
                    continue;
                }
                hashStringList.push(`${key}${hash[key] === true ? '' : `=${hash[key]}`}`);
            }

            document.location.hash = hashStringList.join('&');
        },
        parse (hashString) {
            // Reset hash to {}
            for (const key in hash) {
                if (hash.hasOwnProperty(key)) {
                    delete hash[key];
                }
            }

            if (hashString !== '') {
                // 按照规范是一定会有一个#的
                if (hashString[0] === '#') {
                    hashString = hashString.slice(1);
                }

                // 分解hash中的查询参数为对象形式，字符串值，非键值对的参数设置值为布尔true
                hashString.split('&').forEach(fragment => {
                    if (fragment.split('=')[1] === 'true' || fragment.split('=')[1] === undefined) {
                        hash[fragment.split('=')[0]] = true;
                    } else {
                        hash[fragment.split('=')[0]] = fragment.split('=')[1];
                    }
                });
            }

            // 执行所有监听hash的回调函数，第一个参数为hash
            hashChangeListeners.forEach(fn => fn(hash));

            if (inspect) {
                console.log(hash);
            }
        },
        bind (fn) {
            hashChangeListeners.push(fn);
        },
        unbind (fn) {
            const index = hashChangeListeners.indexOf(fn);
            if (index !== -1) {
                hashChangeListeners.splice(index, 1);
            }
        },
    };

    Vue.prototype.$hash = hash;
    Vue.prototype.$hasher = hasher;

    // 即使嵌入了mixin也不能用$watch来监听$hash，而且混入之后也不能在mounted中获取...不得已创建了bind和unbind
    // Vue.mixin({
    //     data () {
    //         return {
    //             $hash: hash,
    //         };
    //     },
    // });
}