<template>
    <div class="search-box" @keypress.enter="handleSubmit">
        <!--受blur的影响，click无法完成，所以监听mousedown-->
        <div class="search-box-icon" @mousedown="handleSubmit">
            <Icon v-if="isFocusing" class="icon-search" type="search" size="xs" title="搜索"></Icon>
            <p v-else>/</p>
        </div>
        <input type="text" id="search-box" class="search-box-input" :class="inputClasses" v-model="kws" ref="input"
               @focus="handleFocus"
               @blur="handleBlur"
               title="搜索内容"/>
        <div class="search-box-hint" v-show="kws === '' && !isFocusing">
            <Icon class="icon-search" type="search" size="xs"></Icon>
            <p>搜索</p>
        </div>
        <label v-show="!isFocusing" class="search-box-label" for="search-box" title="按“/”搜索">搜索</label>
    </div>
</template>

<script>
import Icon from '../common/icon.vue';

export default {
    name: 'search-box',
    components: {Icon},
    props: {
        isSearchActive: {
            type: Boolean,
            default: false,
        },
        keywords: {
            type: String,
            default: '',
        },
    },
    data () {
        return {
            // 将父级传来的keywords拷贝一份，避免直接修改
            kws: this.keywords,
            isFocusing: false,
        };
    },
    watch: {
        // 还要监听父级的keywords变化，相当于手动绑定kws和keywords
        keywords () {
            this.kws = this.keywords;
        },
        kws () {
            this.$emit('update:keywords', this.kws);
        },
        isFocusing (value) {
            if (value) {
                this.$refs.input.focus();
                this.$hasher.set('search');
            } else {
                this.$refs.input.blur();
                this.$hasher.remove('search');
            }
        },
    },
    computed: {
        inputClasses () {
            return {
                active: this.isSearchActive,
            };
        },
    },
    methods: {
        handleFocus () {
            this.isFocusing = true;
        },
        handleBlur () {
            this.isFocusing = false;
        },
        handleSubmit () {
            if (this.kws !== '') {
                this.$emit('submit');
            }
        },
        // 根据hash值同步single和signBox显示状态
        handleHashChange (hash) {
            this.isFocusing = hash['search'] === true;
        },
    },
    mounted () {
        this.$hasher.bind(this.handleHashChange);
    },
    destroyed () {
        this.$hasher.unbind(this.handleHashChange);
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .search-box {
        height        : 20px;
        padding       : 0 0 0 8px;
        border-radius : 8px;
        color         : black;
        background    : $gray-1;

        &-icon {
            float         : right;
            padding-right : 8px;
            cursor        : pointer;

            p {
                display        : inline-block;
                margin         : 3px 2px;
                width          : 12px;
                text-align     : center;
                vertical-align : middle;
                font-size      : 10px;
                line-height    : 12px;
                color          : $gray-4;
                border-radius  : 2px;
                border         : 1px solid #cdd0d1;
            }

            .icon-search {
                margin      : 0 2px;
                line-height : 20px;
            }
        }

        &-input {
            display     : block;
            margin      : 0 18px 0 4px;
            font-size   : 12px;
            line-height : 20px;
            box-sizing  : border-box;
            /*Reset*/
            width       : 82px;
            border      : none;
            background  : inherit;
            outline     : none;

            transition: all .2s;

            &:focus, &.active {
                width : 142px;
            }
        }

        &-hint, &-label {
            position : absolute;
            top      : 0;
            bottom   : 0;
            left     : 0;
            right    : 0;
        }

        &-hint {
            color   : $gray-4;
            padding : 0 26px 0 8px;
            cursor  : text;

            & > * {
                display : inline-block;
            }

            .icon-search {
                margin : 0 1px;
            }

            p {
                vertical-align : middle;
                font-size      : 12px;
                line-height    : 20px;
                margin-left    : 8px;
            }

        }

        &-label {
            cursor : text;
        }
    }
</style>