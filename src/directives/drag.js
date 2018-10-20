/**
 * Created by Yunzhe on 2018/8/28.
 */

'use strict';

export default {
    bind: function (el, binding) {
        el.__vueDragHold__ = event => {
            if (binding.value.mousedown) {
                binding.value.mousedown(event);
            }
            document.addEventListener('mousemove', el.__vueDragMoving__);
            document.addEventListener('mouseup', el.__vueDragRelease__);
        };
        el.__vueDragMoving__ = event => {
            if (binding.value.mousemove) {
                binding.value.mousemove(event);
            }
        };
        el.__vueDragRelease__ = () => {
            if (binding.value.mouseup) {
                binding.value.mouseup(event);
            }
            document.removeEventListener('mousemove', el.__vueDragMoving__);
            document.removeEventListener('mouseup', el.__vueDragRelease__);
        };
        el.addEventListener('mousedown', el.__vueDragHold__);
    },
    unbind: function (el) {
        el.removeEventListener('mousedown', el.__vueDragHold__);
        delete el.__vueDragHold__;
        delete el.__vueDragMoving__;
        delete el.__vueDragRelease__;
    },
};