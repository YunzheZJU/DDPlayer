/**
 * Created by Yunzhe on 2018/8/30.
 */

'use strict';
export default {
    bind (el, binding) {
        function documentHandler (e) {
            if (el.contains(e.target) || el.style['display'] === 'none') {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }

        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind (el) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete  el.__vueClickOutside__;
    },
};