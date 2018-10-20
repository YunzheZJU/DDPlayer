<template>
    <!--title属性在svg上不起作用，<i>是必需的-->
    <i>
        <svg :class="classes" aria-hidden="true" :style="styles">
            <use :xlink:href="`#ddicon-${this.type}`"></use>
        </svg>
    </i>
</template>

<script>
const prefix = 'ddicon';

export default {
    name: 'icon',
    props: {
        type: {
            type: String,
        },
        size: {
            type: String,
        },
        color: {
            // 应该是一个合法的CSS颜色值
            type: String,
        },
    },
    computed: {
        classes () {
            return [
                prefix,
                // `${prefix}-${this.type}`,
                `${prefix}-${this.size}`,
            ];
        },
        styles () {
            // 无传入color则缺省inherit，有则绑定该color值
            return this.color ? {color: this.color === 'theme' ? '#d1382a' : this.color} : {};
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    $size-3xs : 8px;
    $size-2xs : 10px;
    $size-xs : 12px;
    $size-sm : 14px;
    $size-md : 16px;
    $size-lg : 20px;
    $size-xl : 25px;
    $size-2xl : 30px;
    $size-3xl : 35px;
    $size-4xl : 40px;
    $size-5xl : 45px;
    $size-10xl : 70px;

    .ddicon {
        vertical-align : middle;

        width          : 1em;
        height         : 1em;
        /*Commented because it does not match line-height*/
        /*vertical-align : -0.15em;*/
        fill           : currentColor;
        overflow       : hidden;

        &-3xs {
            font-size   : #{$size-3xs};
            line-height : #{$size-3xs};
        }

        &-2xs {
            font-size   : #{$size-2xs};
            line-height : #{$size-2xs};
        }

        &-xs {
            font-size   : #{$size-xs};
            line-height : #{$size-xs};
        }

        &-sm {
            font-size   : #{$size-sm};
            line-height : #{$size-sm};
        }

        &-md {
            font-size   : #{$size-md};
            line-height : #{$size-md};
        }

        &-lg {
            font-size   : #{$size-lg};
            line-height : #{$size-lg};
        }

        &-xl {
            font-size   : #{$size-xl};
            line-height : #{$size-xl};
        }

        &-2xl {
            font-size   : #{$size-2xl};
            line-height : #{$size-2xl};
        }

        &-3xl {
            font-size   : #{$size-3xl};
            line-height : #{$size-3xl};
        }

        &-4xl {
            font-size   : #{$size-4xl};
            line-height : #{$size-4xl};
        }

        &-5xl {
            font-size   : #{$size-5xl};
            line-height : #{$size-5xl};
        }

        &-10xl {
            font-size   : #{$size-10xl};
            line-height : #{$size-10xl};
        }
    }

</style>