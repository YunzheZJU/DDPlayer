<template>
    <!--为了兼容IE，需要自己实现一个滚动条-->
    <div class="scroll-area" @wheel="handleWheel">
        <div class="scroll-content" :class="[direction]" ref="content" @scroll.passive="handleScroll">
            <slot></slot>
        </div>
        <div class="scroll-bar" :class="[barClasses, direction]" v-show="showBar">
            <div class="scroll-thumb" :style="thumbStyles" v-drag="dragHandlers"></div>
        </div>
    </div>
</template>

<script>
import u from '../../libs/util';
import Drag from '../../directives/drag';

export default {
    name: 'scroll-area',
    directives: {Drag},
    props: {
        direction: {
            type: String,
            default: 'vertical',
        },
        initialScroll: {
            type: Number,
            default: 0,
        },
    },
    data () {
        return {
            scroll: {
                // 和this.$refs.content.scrollHeight绑定，在updated中持续更新
                scrollHeight: 1,
                // 和this.$refs.content.clientHeight绑定，等于可视区/滚动槽高度，在updated中持续更新
                visibleHeight: 0,
                // 和this.$refs.content.scrollTop绑定，在updated中持续更新
                scrollTop: 0,

                // 横向
                scrollWidth: 1,
                visibleWidth: 0,
                scrollLeft: 0,
            },
            drag: {
                isDragging: false,
                startY: 0,
                startTop: 0,

                // 横向
                startX: 0,
                startLeft: 0,
            },
            dragHandlers: {
                mousedown: this.handleMouseDown,
                mousemove: this.handleMouseMove,
                mouseup: this.handleMouseUp,
            },
            inspect: false,
        };
    },
    computed: {
        thumbLength () {
            if (this.direction === 'vertical') {
                return this.scroll.visibleHeight * this.scroll.visibleHeight / this.scroll.scrollHeight;
            } else {
                return this.scroll.visibleWidth * this.scroll.visibleWidth / this.scroll.scrollWidth;
            }
        },
        // 和thumb的marginTop绑定，marginTop / visibleHeight = scrollTop / scrollHeight
        marginTop () {
            return this.scroll.scrollTop / this.scroll.scrollHeight * this.scroll.visibleHeight;
        },
        marginLeft () {
            return this.scroll.scrollLeft / this.scroll.scrollWidth * this.scroll.visibleWidth;
        },
        barClasses () {
            return {
                focus: this.drag.isDragging,
            };
        },
        showBar () {
            if (this.direction === 'vertical') {
                return this.scroll.scrollHeight !== this.scroll.visibleHeight;
            } else {
                return this.scroll.scrollWidth !== this.scroll.visibleWidth;
            }
        },
        thumbStyles () {
            if (this.direction === 'vertical') {
                return {
                    // 滚动条长度
                    height: `${this.thumbLength}px`,
                    marginTop: `${this.marginTop}px`,
                };
            } else {
                return {
                    // 滚动条长度
                    width: `${this.thumbLength}px`,
                    height: '100%',
                    marginLeft: `${this.marginLeft}px`,
                };
            }
        },
    },
    methods: {
        handleMouseDown (event) {
            if (this.direction === 'vertical') {
                if (this.inspect) {
                    console.log(event.y);
                }
                this.drag.startY = event.y;
                this.drag.startTop = this.scroll.scrollTop;
            } else {
                if (this.inspect) {
                    console.log(event.x);
                }
                this.drag.startX = event.x;
                this.drag.startLeft = this.scroll.scrollLeft;
            }
            this.drag.isDragging = true;
        },
        handleMouseMove (event) {
            if (this.direction === 'vertical') {
                this.scroll.scrollTop =
                    (event.y - this.drag.startY) / this.scroll.visibleHeight * this.scroll.scrollHeight
                    + this.drag.startTop;
                this.$refs.content.scrollTop = this.scroll.scrollTop
                    = u.filterInteger(this.scroll.scrollTop, 0, this.scroll.scrollHeight - this.scroll.visibleHeight);
                if (this.inspect) {
                    console.log(this.scroll.scrollTop);
                }

            } else {
                this.scroll.scrollLeft =
                    (event.x - this.drag.startX) / this.scroll.visibleWidth * this.scroll.scrollWidth
                    + this.drag.startLeft;
                this.$refs.content.scrollLeft = this.scroll.scrollLeft
                    = u.filterInteger(this.scroll.scrollLeft, 0, this.scroll.scrollWidth - this.scroll.visibleWidth);
                if (this.inspect) {
                    console.log(this.scroll.scrollLeft);
                }
            }
        },
        handleMouseUp (event) {
            if (this.direction === 'vertical') {
                this.scroll.scrollTop =
                    (event.y - this.drag.startY) / this.scroll.visibleHeight * this.scroll.scrollHeight
                    + this.drag.startTop;
                this.$refs.content.scrollTop = this.scroll.scrollTop
                    = u.filterInteger(this.scroll.scrollTop, 0, this.scroll.scrollHeight - this.scroll.visibleHeight);
                if (this.inspect) {
                    console.log(this.scroll.scrollTop);
                }
            } else {
                this.scroll.scrollLeft =
                    (event.x - this.drag.startX) / this.scroll.visibleWidth * this.scroll.scrollWidth
                    + this.drag.startLeft;
                this.$refs.content.scrollLeft = this.scroll.scrollLeft
                    = u.filterInteger(this.scroll.scrollLeft, 0, this.scroll.scrollWidth - this.scroll.visibleWidth);
                if (this.inspect) {
                    console.log(this.scroll.scrollLeft);
                }
            }
            this.drag.isDragging = false;
        },
        handleScroll () {
            // 监听原生滚动事件
            if (this.direction === 'vertical') {
                this.scroll.scrollTop = this.$refs.content.scrollTop;
            }
        },
        handleWheel (event) {
            if (this.direction === 'horizontal') {
                if (this.inspect) {
                    console.log(event);
                }
                if (event.deltaY > 0) {
                    if (this.scroll.scrollLeft >= this.scroll.scrollWidth - this.scroll.visibleWidth) {
                        // 如果不满足可滚动条件，不吸收这个滚动事件，直接返回，由别人去继续处理事件
                        return;
                    }
                    this.scroll.scrollLeft = this.$refs.content.scrollLeft = this.$refs.content.scrollLeft + 50;
                } else {
                    if (this.scroll.scrollLeft <= 0) {
                        return;
                    }
                    this.scroll.scrollLeft = this.$refs.content.scrollLeft = this.$refs.content.scrollLeft - 50;
                }
                event.preventDefault();
                event.stopPropagation();
            }
        },
    },
    watch: {
        initialScroll (newValue, oldValue) {
            if (newValue < oldValue) {
                // 正在删除播放历史的情况，可能产生问题
                return;
            }
            this.$nextTick(() => {
                if (this.direction === 'vertical') {
                    this.scroll.scrollTop = this.$refs.content.scrollTop = newValue;
                } else {
                    this.scroll.scrollLeft = this.$refs.content.scrollLeft = newValue;
                }
            });
        },
    },
    mounted () {
        if (this.direction === 'vertical') {
            this.scroll.scrollHeight = this.$refs.content.scrollHeight;
            this.scroll.visibleHeight = this.$refs.content.clientHeight;
            this.scroll.scrollTop = this.$refs.content.scrollTop = this.initialScroll;
        } else {
            this.scroll.scrollWidth = this.$refs.content.scrollWidth;
            this.scroll.visibleWidth = this.$refs.content.clientWidth;
            this.scroll.scrollLeft = this.$refs.content.scrollLeft = this.initialScroll;
        }
    },
    updated () {
        // Ugly fix
        if (!this.$refs.content) {
            console.error('我的content呢？？？');
            return;
        }
        // 在updated钩子里更新了状态，会导致多一次updated，但不至于产生无限循环——没有别的办法来监听DOM元素属性变化了
        {
            if (this.direction === 'vertical') {
                this.scroll.scrollHeight = this.$refs.content.scrollHeight;
                this.scroll.visibleHeight = this.$refs.content.clientHeight;
                this.scroll.scrollTop = this.$refs.content.scrollTop;
                if (this.inspect) {
                    console.log(`updated: this.scroll.scrollHeight = ${this.scroll.scrollHeight}, this.scroll.visibleHeight = ${this.scroll.visibleHeight}, this.scroll.scrollTop = ${this.scroll.scrollTop}`);
                }
            } else {
                this.scroll.scrollWidth = this.$refs.content.scrollWidth;
                this.scroll.visibleWidth = this.$refs.content.clientWidth;
                this.scroll.scrollLeft = this.$refs.content.scrollLeft;
                if (this.inspect) {
                    console.log(`updated: this.scroll.scrollWidth = ${this.scroll.scrollWidth}, this.scroll.visibleWidth = ${this.scroll.visibleWidth}, this.scroll.scrollLeft = ${this.scroll.scrollLeft}`);
                }
            }
        }
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .scroll-area {
        /*为滚动条提供定位依据*/
        position : relative;
        /*由外部确定尺寸*/

        & > .scroll-content {

            &.vertical {
                /*撑满父元素空间*/
                position    : absolute;
                top         : 0;
                bottom      : 0;
                left        : 0;
                right       : 0;
                /*提供滚轮支持*/
                overflow-y  : scroll;
                /*允许换行*/
                white-space : normal;
            }

            &.horizontal {
                /*提供滚轮支持*/
                overflow-x  : scroll;
                white-space : nowrap;
            }

            /*需要实现悬浮效果，自己模拟一个出来好了*/
            &::-webkit-scrollbar {
                display : none;
            }
        }

        & > .scroll-bar {
            position   : absolute;
            background : transparent;
            opacity    : 0;
            transition : all .3s;

            &.vertical {
                top    : 0;
                bottom : 0;
                right  : 0;
                width  : 8px;
            }

            &.horizontal {
                bottom : 0;
                left   : 0;
                right  : 0;
                height : 8px;
            }

            .scroll-thumb {
                background    : $gray-4;
                border-radius : 4px;
            }

            &.focus {
                /*阻止拖动过程中的透明度变化*/
                opacity : 1;
            }
        }

        &:hover > .scroll-bar {
            opacity : 1;
            transition-delay: .2s;
        }
    }
</style>