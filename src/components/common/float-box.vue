<template>
    <div class="float-box"
         :class="classes" :style="styles">
        <slot>
            <div class="placeholder"></div>
        </slot>
    </div>
</template>

<script>
export default {
    name: 'float-box',
    props: {
        direction: {
            type: String,
            default: 'right',
            validator (value) {
                return ['top', 'bottom', 'left', 'right', 'none'].includes(value);
            },
        },
        drawTriangle: {
            type: Boolean,
            default: true,
        },
        width: {
            type: String,
            default: 'auto',
        },
        height: {
            type: String,
            default: 'auto',
        },
    },
    computed: {
        classes () {
            return [
                `float-box-${this.direction}`,
                this.drawTriangle ? 'tri' : '',
            ];
        },
        styles () {
            return {
                'width': this.width,
                'height': this.height,
            };
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .float-box {
        background    : white;
        border-radius : 5px;
        padding       : 2px;
        border        : 1px solid $gray-3;
        box-shadow    : 0 0 10px 1px $shadow;
        font-size     : 12px;

        &-top, &-bottom, &-left, &-right {
            position : absolute;

            &.tri:after {
                content  : '';
                display  : inline-block;
                position : absolute;
                border   : 5px solid transparent;
            }
        }

        &-top, &-bottom {
            /*以自身尺寸计算*/
            left      : 50%;
            /*以包含块尺寸计算*/
            transform : translateX(-50%, 0, 0);

            &.tri:after {
                left      : 50%;
                transform : translate3d(-50%, 0, 0);
            }
        }

        &-top {
            /*远离父元素*/
            top        : 100%;
            margin-top : 10px;

            &.tri:after {
                bottom              : 100%;
                border-bottom-color : white;
            }
        }

        &-bottom {
            /*远离父元素*/
            bottom        : 100%;
            margin-bottom : 10px;

            &.tri:after {
                top              : 100%;
                border-top-color : white;
            }
        }

        &-left, &-right {
            /*以自身尺寸计算*/
            top       : 50%;
            /*以包含块尺寸计算*/
            transform : translate3d(0, -50%, 0);

            &.tri:after {
                top       : 50%;
                transform : translate3d(0, -50%, 0);
            }
        }

        &-left {
            /*远离父元素*/
            left        : 100%;
            margin-left : 10px;

            &.tri:after {
                right              : 100%;
                border-right-color : white;
            }
        }

        &-right {
            /*远离父元素*/
            right        : 100%;
            margin-right : 10px;

            &.tri:after {
                left              : 100%;
                border-left-color : white;
            }
        }

        .placeholder {
            width  : 60px;
            height : 20px;
        }
    }
</style>