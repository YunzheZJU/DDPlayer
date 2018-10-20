<template>
    <div class="input-box">
        <!--模拟placeholder出来，本身针对::placeholder的样式在IE上也不受支持-->
        <div class="input-box-hint" @click="handleClickHint">
            <Icon class="input-box-icon" :class="iconClasses" :type="iconType" size="sm"></Icon>
            <p v-show="myValue === '' && !isFocusing">{{ placeholder }}</p>
        </div>
        <transition>
            <div class="input-box-extra" @click="handleClickHint" v-if="extra">
                <p>
                    <slot></slot>
                </p>
            </div>
        </transition>
        <label>
            <input :type="inputType" :title="placeholder" :style="inputStyles" v-model="myValue" ref="input"
                   @focus="handleFocus" @blur="handleBlur" @input="handleInput" @change="handleChange"/>
        </label>
    </div>
</template>

<script>
import Icon from './icon.vue';

export default {
    name: 'input-box',
    components: {Icon},
    props: {
        inputType: {
            type: String,
            required: true,
        },
        iconType: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        extra: {
            type: Boolean,
            default: false,
        },
        passed: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            myValue: this.value,
            isFocusing: false,
        };
    },
    watch: {
        myValue (value) {
            this.$emit('update:value', value);
        },
    },
    computed: {
        inputStyles () {
            return this.extra ? {
                // 不严格，得看extra的宽度
                paddingRight: '100px',
            } : {};
        },
        iconClasses () {
            return [
                {passed: this.passed},
            ];
        },
    },
    methods: {
        handleClickHint () {
            this.$refs.input.focus();
        },
        handleFocus () {
            this.isFocusing = true;
        },
        handleBlur () {
            this.isFocusing = false;
        },
        handleInput () {
            this.$emit('input', this.myValue);
        },
        handleChange () {
            this.$emit('change', this.myValue);
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .input-box {
        position : relative;

        &-hint {
            position : absolute;
            top      : 0;
            left     : 0;
            color    : $gray-4;
            cursor   : text;

            .input-box-icon {
                float       : left;
                margin      : 0 6px;
                line-height : 30px;

                &.passed {
                    color : $green;
                }
            }

            p {
                font-size   : 12px;
                line-height : 30px;
            }
        }

        &-extra {
            position    : absolute;
            top         : 0;
            right       : 0;
            padding     : 0 10px;
            color       : $gray-6;
            border-left : 1px solid $gray-3;
            cursor      : text;

            &.v-enter-active, &.v-leave-active {
                transition : all .2s;
            }

            &.v-enter-to, &.v-leave {
                max-width : 100px;
            }

            &.v-enter, &.v-leave-to {
                opacity   : 0;
                max-width : 0;
            }

            p {
                font-size   : 12px;
                line-height : 30px;
            }
        }

        input {
            display       : block;
            width         : 100%;
            height        : 30px;
            padding       : 0 6px 0 26px;
            font-size     : 12px;
            line-height   : 20px;
            border        : 1px solid $gray-3;
            border-radius : 2px;
            box-sizing    : border-box;
        }
    }
</style>