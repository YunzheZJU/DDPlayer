<template>
    <transition>
        <router-link :to="to" tag="li" class="list-button" :title="title">
            <a>
                <div class="icon">
                    <slot name="icon" :isActive="isActive"></slot>
                </div>
                <div class="list-button-name">
                    <p>
                        <slot name="title"></slot>
                    </p>
                </div>
            </a>
        </router-link>
    </transition>
</template>

<script>
export default {
    name: 'button-list-button',
    props: {
        to: [String, Object],
        title: {
            type: String,
            default: '',
        },
    },
    data () {
        return {
            isActive: false,
        };
    },
    computed: {
        playlist () {
            return this.$store.state.playlist;
        },
    },
    watch: {
        $route () {
            this.$nextTick(() => {
                this.isActive = this.matchActiveRoute();
            });
        },
    },
    methods: {
        matchActiveRoute () {
            return this.$el.classList.contains('router-link-active');
        },
    },
    mounted () {
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .list-button {
        border-radius : 3px;
        color         : $gray-5;
        /*line-height + padding的组合会影响<a>的范围：content-box*/
        line-height   : 30px;
        box-sizing    : border-box;
        /*transition : all .4s;*/

        &:hover {
            background : $gray-3;
            color      : black;
        }

        &.router-link-active {
            background : $theme;
            color      : white;
        }

        &.v-enter-active, &.v-leave-active {
            transition : all .2s;
        }

        &.v-enter-to, &.v-leave {
            /*max-height: 30px;*/
            transform : translateX(0);
            opacity   : 1;
        }

        &.v-enter, &.v-leave-to {
            /*transform: scaleY(.01);*/
            /*max-height: 0;*/
            transform : translateX(100%);
            opacity   : 0;
        }

        .icon {
            display : inline-block;
            margin  : 0 10px;
            float   : left;
        }

        &-name {
            /*在浮动元素上设置margin即可*/
            /*margin-left   : 34px;*/
            /*overflow为内部提供BFC，与外界隔离*/
            overflow      : hidden;
            padding-right : 5px;
            font-size     : 12px;
        }
    }
</style>