<template>
    <!--有没有用到2.1的内容？-->
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
         :width="columnWidth" :height="columnWidth" :viewBox="`0 0 ${columnWidth} ${columnWidth}`">
        <defs>
            <!--从播放头指向中点，偏黄的颜色到红黄中间色-->
            <linearGradient id="grad-1" :x1="headPositionNormal.a" :y1="headPositionNormal.b"
                            :x2="headPositionHalfDegNormal.a" :y2="headPositionHalfDegNormal.b">
                <stop offset="0" stop-color="#f5e371"></stop>
                <stop offset="1" stop-color="#f67b48"></stop>
            </linearGradient>
            <!--从起点指向中点，偏红的颜色到红黄中间色-->
            <linearGradient id="grad-2" x1="1" y1="0"
                            :x2="headPositionHalfDegNormal.a" :y2="headPositionHalfDegNormal.b">
                <stop offset="0" stop-color="#f74231"></stop>
                <stop offset="1" stop-color="#f67b48"></stop>
            </linearGradient>
            <!--从下侧指向上侧，偏红的颜色到偏黄的颜色-->
            <linearGradient id="grad-3" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stop-color="#f74231"></stop>
                <stop offset="1" stop-color="#f5e371"></stop>
            </linearGradient>
            <filter id="shine" x="-1" y="-1" width="3" height="3">
                <!--四行分别为rgba，前四列为rgba，最后一列为常数偏移
                这里的目的是将颜色置白，并保留不透明度，前面三列用于保留原色，置0也行-->
                <feColorMatrix result="matrixOut" in="SourceGraphic" type="matrix"
                               values="1 0 0 0 1
                                       0 1 0 0 1
                                       0 0 1 0 1
                                       0 0 0 1 0"></feColorMatrix>
                <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>
                <feBlend result="blendOut" in="blurOut" in2="blurOut" mode="normal"></feBlend>
                <!--要更强烈一点的话就再叠一次，记得改in2为blendOut2-->
                <!--<feBlend result="blendOut2" in="blendOut" in2="blendOut" mode="normal"></feBlend>-->
                <feBlend in="SourceGraphic" in2="blendOut" mode="normal"></feBlend>
            </filter>
        </defs>
        <!--偏移一半宽度和一半高度，这样内部的数据以原点为参照点即可；
        逆时针旋转90度，使stroke的起点转到上侧，副作用是使用的渐变要以旋转前的状态来绘制-->
        <g :transform="`translate(${outerRadius}, ${outerRadius}), rotate(-90, 0, 0)`">
            <!--在最初几秒会出现颜色丢失的问题，为什么？-->
            <!--进度条底色（渐变），显示长度占总长度的百分比与播放进度相关联，半径向外偏移1px防止与图片重合-->
            <circle cx="0" cy="0" :r="innerRadius + 1" stroke="url(#grad-1)" stroke-width="3" fill="none"
                    :stroke-dasharray="`${basicLengthFloat} 630`" stroke-linecap="round"
                    v-show="time !== 0 || isPlaying || drag.isDragging"></circle>
            <!--用另一层渐变覆盖在进度条底色上，长度为进度条显示长度的一半-->
            <circle cx="0" cy="0" :r="innerRadius + 1" stroke="url(#grad-2)" stroke-width="3" fill="none"
                    :stroke-dasharray="`${basicLengthFloat / 2} 630`" stroke-linecap="round"
                    v-show="time !== 0 || isPlaying || drag.isDragging"></circle>
            <!--播放头，随时间运动-->
            <circle :cx="headPosition.a" :cy="headPosition.b" r="3.5"
                    stroke="white" stroke-width="1" fill="#f5e371" filter="url(#shine)"></circle>
            <!--先用三次贝塞尔曲线绘制外框，再移动到内部，画一个顺时针的圆（由两条椭圆弧组成）用于剔除；
            fill-rule要设置为evenodd来指定判断内部的方式，最后应用线性渐变填充。
            Reference:
            https://www.zhangxinxu.com/wordpress/2015/07/svg-circle-loading/
            https://www.zhangxinxu.com/wordpress/2014/06/deep-understand-svg-path-bezier-curves-command/
            https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Path_commands
            http://www.runoob.com/svg/svg-polygon.html
            -->
            <path :d="`
                M ${points[0].main.output()}
                C ${points.map(
                    (anchor, index, pts) => `
                        ${anchor.right.output()}
                        ${pts[index + 1 === pts.length ? 0 : index + 1].left.output()}
                        ${pts[index + 1 === pts.length ? 0 : index + 1].main.output()}
                    `
                )}
                M 110,0
                A 110 110 0 1 1 -110,0
                  110 110 0 1 1 110,0
            `" fill-rule="evenodd" fill="url(#grad-3)">
            </path>
            <!--用做事件接收器，没有子元素所以用起来非常便利！-->
            <circle cx="0" cy="0" :r="outerRadius" fill="white" fill-opacity="0" class="event-receiver"
                    v-drag="dragHandlers"></circle>
            <!--调试用，画出锚点的位置-->
            <!--<g>-->
            <!--<circle v-for="point in points" :cx="point.left.a"-->
            <!--:cy="point.left.b" r="3" fill="red"></circle>-->
            <!--<circle v-for="point in points" :cx="point.main.a"-->
            <!--:cy="point.main.b" r="3" fill="black"></circle>-->
            <!--<circle v-for="point in points" :cx="point.right.a"-->
            <!--:cy="point.right.b" r="3" fill="blue"></circle>-->
            <!--</g>-->
        </g>
    </svg>
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import Drag from '../../directives/drag';
import {Vector} from './single-points';

export default {
    name: 'star',
    directives: {Drag},
    props: {
        columnWidth: {
            type: Number,
            default: 320,
        },
        points: {
            type: Array,
            required: true,
        },
        // Current time
        time: {
            type: Number,
            default: 0,
        },
    },
    data () {
        return {
            innerRadius: 100,
            drag: {
                isDragging: false,
                refRect: undefined,
                seekingReg: 0,
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
        ...mapState([
            'isPlaying',
        ]),
        ...mapGetters('playlist', [
            'playing',
            'isFavorite',
            'noPlaying',
        ]),
        duration () {
            return this.noPlaying ? 1 : this.playing.duration / 1000;
        },
        // 使用和ProgressBar类似的逻辑来处理拖动
        progress () {
            return this.drag.isDragging ? this.drag.seekingReg / (Math.PI * 2) : this.time / this.duration;
        },
        outerRadius () {
            return this.columnWidth / 2;
        },
        // 相当于basicWidthFloat
        basicLengthFloat () {
            return this.innerRadius * 2 * Math.PI * this.progress;
        },
        headPositionNormal () {
            const reg = this.progress * 2 * Math.PI;
            return this.getPointNormal(reg);
        },
        headPositionHalfDegNormal () {
            const reg = this.progress * Math.PI;
            return this.getPointNormal(reg);
        },
        headPosition () {
            // From [0, 1] to [-1, 1]
            return this.headPositionNormal.copy().multiply(2).minus(1).multiply(this.innerRadius);
        },
        dragValue () {
            return this.drag.seekingReg / (Math.PI * 2) * this.duration;
        },
    },
    methods: {
        getPointNormal (reg) {
            // From [-1, 1] to [0, 1]
            return new Vector(Math.cos(reg), Math.sin(reg)).add(1).divide(2);
        },
        getReg (point) {
            const center = new Vector(160, 160);
            const {a, b} = point.minus(center).normalize();
            // 简化成了这个样子
            let reg = b < 0 ? Math.PI * 2 - Math.acos(a) : Math.acos(a);
            reg = reg <= Math.PI * 3 / 2 ? reg + Math.PI / 2 : reg - Math.PI * 3 / 2;
            if (this.inspect) {
                console.log(point);
                console.log(`a: ${a}, b: ${b}`);
                console.log(reg);
            }
            return reg;
        },
        handleMouseDown (event) {
            if (this.inspect) {
                console.log('handleMousedown ' + event.x);
                console.log(event);
            }

            this.drag.isDragging = true;

            const rect = event.target.getBoundingClientRect();
            this.drag.refRect = new Vector(rect.left, rect.top);

            const eventPoint = new Vector(event.x, event.y);
            this.drag.seekingReg = this.getReg(eventPoint.minus(this.drag.refRect));

            if (this.inspect) {
                console.log('start reg ' + this.drag.seekingReg);
            }

            this.$emit('focus', true);
        },
        handleMouseMove (event) {
            if (this.inspect) {
                console.log('handleMouseMove ' + event.x);
            }

            const eventPoint = new Vector(event.x, event.y);
            this.drag.seekingReg = this.getReg(eventPoint.minus(this.drag.refRect));

            if (this.inspect) {
                console.log('start reg ' + this.drag.seekingReg);
            }
            this.$emit('seek', this.dragValue);
        },
        handleMouseUp (event) {
            if (this.inspect) {
                console.log('handleMouseUp ' + event.x);
            }

            const eventPoint = new Vector(event.x, event.y);
            this.drag.seekingReg = this.getReg(eventPoint.minus(this.drag.refRect));

            if (this.inspect) {
                console.log('start reg ' + this.drag.seekingReg);
            }
            // 可能会出现播放头闪烁（跳回seek前位置）的情况，属正常，因为$emit后数据更新下来需要时间
            // 于是使用懒更新，用isDragging作为标志，在下一次计算style时才重置delta，这会引入副作用
            // 从根本上解决问题：在上层及时更新currentTime，别传进来一个错误的值
            this.$emit('commit', this.dragValue);
            this.$emit('focus', false);
            // Reset
            this.drag.isDragging = false;
            // 以下值的使用与isDragging相关，不重置也行
            this.drag.refRect = undefined;
            this.drag.seekingReg = 0;
        },
    },
};
</script>

<style scoped lang="scss">
    svg {
        transform : rotate(.05deg);

        .event-receiver {
            cursor : pointer;
        }
    }
</style>