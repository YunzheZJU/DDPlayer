/**
 * Created by Yunzhe on 2018/9/22.
 */

'use strict';
// 将元素文字内容设置到元素的title属性
export default {
    bind (el) {
        el.title = el.innerText;
    },
    update (el) {
        el.title = el.innerText;
    },
};