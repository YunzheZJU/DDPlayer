<template>
    <!--横向的进度条组件
    组件自己不知道自己是时间进度条还是音量进度条，事件处理和内容交由父级处理和填充。
    前景色和背景色可以自定义，需要传入的数据是total和value，可选允许交互、额外数据和常显播放头。
    宽度和高度由外部定义，组件内部从DOM元素获取宽高。-->
    <div class="progress-bar"
         :style="barStyles"
         :class="barClasses"
         @mouseenter="handleMouseEnter"
         @mouseleave="handleMouseLeave"
         v-drag="dragHandlers">
        <div class="progress-bar-main"
             :style="mainStyles"></div>
        <transition>
            <FloatBox
                    class="progress-bar-float-box"
                    direction="none"
                    :draw-triangle="false"
                    :style="floatBoxStyles"
                    width="80px"
                    v-if="extra"
                    v-show="hover.isHovering"
                    @mousedown.native.stop="'Ugly fix for excluding from v-drag'">
                <FloatBoxItem
                        :can-hover="false"
                        :icon="false">
                    <slot slot="content"></slot>
                </FloatBoxItem>
            </FloatBox>
        </transition>
    </div>
</template>

<script>
import Drag from '../../directives/drag';
import FloatBox from './float-box.vue';
import FloatBoxItem from './float-box-item.vue';
import u from '../../libs/util';

export default {
    name: 'progress-bar',
    components: {FloatBox, FloatBoxItem},
    directives: {Drag},
    props: {
        // Current value
        value: {
            type: Number,
            required: true,
        },
        // Total value
        total: {
            type: Number,
            required: true,
        },
        extra: {
            type: Boolean,
            default: false,
        },
        shouldHover: {
            type: Boolean,
            default: false,
        },
        allowInteraction: {
            type: Boolean,
            default: true,
        },
        smooth: {
            type: Boolean,
            default: false,
        },
        foregroundColor: {
            type: String,
        },
        backgroundColor: {
            type: String,
        },
    },
    data () {
        return {
            width: 1,
            height: 1,
            drag: {
                isDragging: false,
                refLeft: 0,
                seekingWidth: 0,
                updateWidth (x) {
                    this.seekingWidth = x - this.refLeft;
                },
            },
            dragHandlers: {
                mousedown: this.handleMouseDown,
                mousemove: this.handleMouseMove,
                mouseup: this.handleMouseUp,
            },
            hover: {
                isHovering: false,
                needUpdate: false,
            },
            inspect: false,
        };
    },
    computed: {
        // 与传入的value值匹配的基本宽度
        basicWidthFloat () {
            // Why does it not work? Why does it work?
            return Math.floor(this.value / this.total * this.width * 10) / 10;
        },
        // drag过程中，使用按下时保存的basic width作为基本宽度，在此基础上包含drag偏移量的宽度
        dragWidthFloat () {
            return u.filterNumber(this.drag.seekingWidth, 0, this.width);
        },
        visualWidth () {
            const width = this.drag.isDragging ? this.dragWidthFloat : this.basicWidthFloat;
            if (this.inspect) {
                console.log(`${width} : ${this.value} / ${this.total} / ${this.width} / ${this.drag.isDragging} / ${this.drag.seekingWidth}`);
            }
            return width;
        },
        dragValue () {
            return this.dragWidthFloat / this.width * this.total;
        },
        barStyles () {
            const style = {};
            if (this.backgroundColor) {
                style.background = this.backgroundColor;
            }
            return style;
        },
        mainStyles () {
            const style = {
                width: `${this.visualWidth}px`,
            };
            if (this.foregroundColor) {
                style.background = this.foregroundColor;
            }
            if (this.smooth) {
                style.transition = 'all .3s';
            }
            return style;
        },
        floatBoxStyles () {
            return {
                // 86 = 80 + 6，是floatBox的宽度，6包含2px的padding和1px的border
                // 4是为阴影留出的空间
                marginLeft: `${u.filterNumber(this.visualWidth - 86 / 2, 4, this.width - 86 - 4)}px`,
            };
        },
        barClasses () {
            return [
                this.shouldHover ? 'with-hover' : 'without-hover',
                {dynamic: this.allowInteraction},
                {hover: this.hover.isHovering},
            ];
        },
    },
    methods: {
        handleMouseDown (event) {
            if (!this.allowInteraction) {
                return;
            }
            if (this.inspect) {
                console.log('handleMousedown ' + event.x);
                console.log(event);
            }
            this.drag.isDragging = true;
            // 计算拖拽时的进度条动态宽度
            // offsetX在Firefox上不受支持
            // this.drag.savedWidth = event.offsetX;
            // 于是使用getBoundingClientRect()来代替，若只需left等四项值，它的兼容性很好
            // 但是处于性能上的考虑，保存它的结果以重复使用
            this.drag.refLeft = event.target.getBoundingClientRect().left;
            this.drag.updateWidth(event.x);
            if (this.inspect) {
                console.log(`event.offsetX: ${event.offsetX} / event.x: ${event.x} / rect.left: ${this.drag.refLeft}`);
            }

            this.$emit('focus', true);
        },
        handleMouseMove (event) {
            if (!this.allowInteraction) {
                return;
            }
            if (this.inspect) {
                console.log('handleMouseMove ' + event.x);
            }
            this.drag.updateWidth(event.x);
            if (this.inspect) {
                console.log('seeking width: ' + this.drag.seekingWidth);
            }
            this.$emit('seek', this.dragValue);
        },
        handleMouseUp (event) {
            if (!this.allowInteraction) {
                return;
            }
            if (this.inspect) {
                console.log('handleMouseUp ' + event.x);
            }
            this.drag.updateWidth(event.x);
            if (this.inspect) {
                console.log('seeking width: ' + this.drag.seekingWidth);
            }
            // 可能会出现播放头闪烁（跳回seek前位置）的情况，属正常，因为$emit后数据更新下来需要时间
            // 于是使用懒更新，用isDragging作为标志，在下一次计算style时才重置delta，这会引入副作用
            // 从根本上解决问题：在上层及时更新currentTime，别传进来一个错误的值
            this.$emit('commit', this.dragValue);
            this.$emit('focus', false);
            // Reset
            this.drag.isDragging = false;
            // 以下值的使用与isDragging直接相关，不重置也行
            this.drag.refLeft = 0;
            this.drag.seekingWidth = 0;
            // Reset isHovering，这是和UI有关的
            if (this.hover.needUpdate) {
                this.hover.isHovering = false;
                this.hover.needUpdate = false;
            }
        },
        handleMouseEnter () {
            if (!this.allowInteraction) {
                return;
            }
            this.hover.needUpdate = false;
            this.hover.isHovering = true;
        },
        handleMouseLeave () {
            if (!this.allowInteraction) {
                return;
            }
            if (!this.drag.isDragging) {
                this.hover.isHovering = false;
            } else {
                this.hover.needUpdate = true;
            }
        },
    },
    mounted () {
        this.width = this.$el.clientWidth;
        this.height = this.$el.clientHeight;
    },
    updated () {
        this.width = this.$el.clientWidth;
        this.height = this.$el.clientHeight;
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .progress-bar {
        /*创建自身BFC*/
        position   : relative;
        background : $theme;

        &.dynamic:before {
            content   : '';
            position  : absolute;
            top       : 50%;
            left      : 0;
            width     : 100%;
            height    : 20px;
            transform : translate3d(0, -50%, 0);
        }

        &-main {
            position   : relative;
            background : $sakura;
            height     : 100%;
            transition : padding-bottom .1s;

            &:after {
                position        : absolute;
                top             : 50%;
                right           : 0;
                transform       : translate3d(50%, -50%, 0);
                width           : 10px;
                height          : 10px;
                border-radius   : 50%;
                /*透明背景会露出下层颜色*/
                background      : $sakura;
                background-clip : padding-box;
                border          : 8px solid transparent;
                box-shadow      : -1px 0 1px 0 $theme inset, 1px 0 1px 0 $sakura inset, 0 0 0 3px white inset;
                cursor          : pointer;
            }
        }

        &-float-box {
            /*覆盖在.progress-bar:before之上*/
            /*修复点击子组件FloatBox的一部分也能触发父组件的v-drag指令的问题*/
            position   : absolute;
            margin-top : 7px;
            transition : all .2s;
            /*
            transition-delay: .3s;

            &.v-leave-active {
                transition-delay: 0s;
            }
            */

            &.v-enter, &.v-leave-to {
                opacity   : 0;
                transform : translateY(-25%);
            }
        }

        /*嵌套写法不方便，还不如分开*/
        &.dynamic.hover:before {
            height : 50px;
        }

        &.with-hover.hover &-main {
            padding-bottom : 3px;

            &:after {
                content : '';
            }
        }

        &.dynamic.without-hover &-main:after {
            content : '';
        }
    }

</style>