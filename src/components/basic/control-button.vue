<template>
    <div class="control-button" v-click-outside="handleClickOutside">
        <div class="control-button-static" title="按住并滑动">
            <div class="control-button-left" :class="{active: isLeftActive}" @click="handleClickLeft"
                 @mousedown="isLeftActive = true" @mouseleave="isLeftActive = false" @mouseup="isLeftActive = false">
                <slot name="left"></slot>
            </div>
            <div class="control-button-main" :class="{active: isMainActive}"
                 v-drag="dragHandlers" @dblclick="handleDblClickMain">
                <slot name="main"></slot>
            </div>
            <div class="control-button-right" :class="{active: isRightActive}" @click="handleClickRight"
                 @mousedown="isRightActive = true" @mouseleave="isRightActive = false" @mouseup="isRightActive = false">
                <slot name="right"></slot>
            </div>
        </div>
        <FloatBox v-if="showFloat" title="">
            <slot name="setting"></slot>
        </FloatBox>
    </div>
</template>

<script>
import Drag from '../../directives/drag';
import FloatBox from '../common/float-box.vue';
import ClickOutside from '../../directives/clickoutside';

export default {
    name: 'control-button',
    components: {FloatBox},
    directives: {ClickOutside, Drag},
    data () {
        return {
            showFloat: false,
            isLeftActive: false,
            isMainActive: false,
            isRightActive: false,
            drag: {
                startX: 0,
            },
            dragHandlers: {
                mousedown: this.handleMouseDown,
                mousemove: this.handleMouseMove,
                mouseup: this.handleMouseUp,
            },
        };
    },
    methods: {
        handleClickMain () {
            this.showFloat = !this.showFloat;
        },
        handleClickLeft () {
            this.$emit('left');
        },
        handleClickRight () {
            this.$emit('right');
        },
        handleClickOutside () {
            if (this.showFloat) {
                this.showFloat = false;
            }
        },
        handleDblClickMain () {
            this.$emit('doublemain');
        },
        handleMouseDown (event) {
            this.drag.startX = event.x;
        },
        handleMouseMove (event) {
            if (event.x - this.drag.startX > 20) {
                this.isLeftActive = false;
                this.isMainActive = false;
                this.isRightActive = true;
            } else if (this.drag.startX - event.x > 20) {
                this.isLeftActive = true;
                this.isMainActive = false;
                this.isRightActive = false;
            } else {
                this.isLeftActive = false;
                this.isMainActive = true;
                this.isRightActive = false;
            }
        },
        handleMouseUp () {
            if (this.isLeftActive) {
                this.handleClickLeft();
            } else if (this.isRightActive) {
                this.handleClickRight();
            } else {
                this.handleClickMain();
            }
            this.isLeftActive = false;
            this.isMainActive = false;
            this.isRightActive = false;
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .control-button {
        position : relative;

        &-static {
            padding    : 8px 0;
            text-align : center;
        }

        &-main {
            padding : 4px 2px;
            display : inline-block;
            color   : $sakura;
        }

        &-left, &-right {
            display : inline-block;
            padding : 4px 3px;
            color   : hsla(0, 0, 0, .25);
        }

        &-main, &-left, &-right {
            vertical-align : middle;
            border-radius  : 3px;

            &:hover {
                color      : $sakura;
                background : hsla(0, 0, 0, .15);
            }

            &.active {
                color      : $sakura;
                background : hsla(0, 0, 0, .25);
            }
        }
    }
</style>