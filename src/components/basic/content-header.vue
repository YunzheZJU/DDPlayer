<template>
    <div class="content-header">
        <div class="foreground">
            <!--将仅在桌面端提供-->
            <div class="foreground-browsing-buttons">
                <div class="previous" :class="previousClasses" @click="handleClickPrevious" title="后退">
                    <Icon type="previous-2" size="xs"></Icon>
                </div>
                <div class="next" :class="nextClasses" @click="handleClickNext" title="前进">
                    <Icon type="next-2" size="xs"></Icon>
                </div>
                <div class="refresh" :class="refreshClasses" @click="handleClickRefresh" title="刷新">
                    <Icon type="refresh" size="xs"></Icon>
                </div>
            </div>
            <SearchBox class="foreground-search-box" :keywords.sync="keywords" :is-search-active="isSearchActive"
                       :class="searchBoxClasses" @submit="handleSubmit">
            </SearchBox>
            <transition>
                <ul class="foreground-page-tags" v-show="!isSearchActive">
                    <PageTag :to="{name: 'discover'}"
                             title="发现">
                        发现
                    </PageTag>
                    <PageTag :to="{name: 'artist'}"
                             title="歌手">
                        歌手
                    </PageTag>
                    <PageTag :to="{name: 'album'}"
                             title="专辑">
                        专辑
                    </PageTag>
                    <PageTag :to="{name: 'collection'}"
                             title="歌单">
                        歌单
                    </PageTag>
                </ul>
            </transition>
            <div class="foreground-return-button" v-show="isSearchActive" @click="handleClickPrevious" title="返回">
                <p>返回</p>
            </div>
        </div>
        <div class="background" :class="backgroundClasses">
            <ul class="background-page-tags">
                <!--使用router-link会出现参数滞后的问题-->
                <PageTag :is-link="false" @click.native="handleClickPageTag('search-artist')"
                         :is-active="searchType === 'search-artist'" title="按歌手搜索">
                    歌手
                </PageTag>
                <PageTag :is-link="false" @click.native="handleClickPageTag('search-album')"
                         :is-active="searchType === 'search-album'" title="按专辑搜索">
                    专辑
                </PageTag>
                <PageTag :is-link="false" @click.native="handleClickPageTag('search-song')"
                         :is-active="searchType === 'search-song'" title="按歌曲搜索">
                    歌曲
                </PageTag>
                <PageTag :is-link="false" @click.native="handleClickPageTag('search-collection')"
                         :is-active="searchType === 'search-collection'" title="按歌单搜索">
                    歌单
                </PageTag>
            </ul>
        </div>
    </div>
</template>

<script>
import SearchBox from './search-box.vue';
import PageTag from '../common/page-tag.vue';
import Icon from '../common/icon.vue';

export default {
    name: 'content-header',
    components: {Icon, PageTag, SearchBox},
    props: {},
    data () {
        return {
            keywords: '',
            isSearchActive: false,
            searchType: '',
            defaultSearchType: 'search-artist',
            omitOnce: false,
            // Zero based index
            historyHead: 0,
            historyStack: [1],
            inspect: false,
        };
    },
    computed: {
        isPreviousActive () {
            return this.historyHead > 0;
        },
        isNextActive () {
            return this.historyHead + 1 < this.historyStack.length;
        },
        isRefreshActive () {
            return window.location.reload !== undefined;
        },
        previousClasses () {
            return {
                active: this.isPreviousActive,
            };
        },
        nextClasses () {
            return {
                active: this.isNextActive,
            };
        },
        refreshClasses () {
            return {
                active: this.isRefreshActive,
            };
        },
        backgroundClasses () {
            return {
                active: this.isSearchActive,
            };
        },
        searchBoxClasses () {
            return {
                active: this.isSearchActive,
            };
        },
    },
    watch: {
        // 不考虑鼠标侧键
        // 将仅在桌面端提供，不考虑浏览器自带的前进后退功能，这样可以排除浏览器自带的前进后退功能
        // $route会因$router.go()触发而变化，因此用omitOnce来跳过
        // $route的监听器无法分辨变化的源头是前进/后退还是新路由
        // 即网页端提供最基础的前进后退（通过浏览器按钮），桌面端提供自制的前进后退按钮并折叠相同页面的跳转
        '$route' (newValue, oldValue) {
            if (this.omitOnce) {
                this.omitOnce = false;
            } else {
                // 判断是否是在同一页面上变化hash（不知道hash模式的情况，考虑排除IE9支持？）
                if (newValue.path === oldValue.path) {
                    this.historyStack[this.historyHead] += 1;
                    // 用this.historyStack.length = this.historyHead + 1的方式修改，无法触发computed
                    while (this.historyStack.length > this.historyHead + 1) {
                        this.historyStack.pop();
                    }
                } else {
                    this.historyHead += 1;
                    this.historyStack[this.historyHead] = 1;
                    // 用this.historyStack.length = this.historyHead + 1的方式修改，无法触发computed
                    while (this.historyStack.length > this.historyHead + 1) {
                        this.historyStack.pop();
                    }
                }
            }
            // 意味着一次history的变化
            if (this.inspect) {
                console.log('route changed!');
                console.log('oldValue:');
                console.log(oldValue);
                console.log('newValue:');
                console.log(newValue);
            }
            // 接下来判断是否是Search页，这个信息已经存储在路由信息的matched字段中
            this.isSearchActive = newValue.matched.some(item => item.name === 'search');
            if (this.isSearchActive) {
                this.keywords = newValue.params.keywords;
                if (newValue.matched.some(item => item.name === 'search-artist')) {
                    this.searchType = 'search-artist';
                } else if (newValue.matched.some(item => item.name === 'search-album')) {
                    this.searchType = 'search-album';
                } else if (newValue.matched.some(item => item.name === 'search-song')) {
                    this.searchType = 'search-song';
                } else if (newValue.matched.some(item => item.name === 'search-collection')) {
                    this.searchType = 'search-collection';
                }
            }
        },
        keywords (newValue, oldValue) {
            if (this.inspect) {
                console.log(`keywords is changing from ${oldValue} to ${newValue}`);
            }
        },
    },
    methods: {
        handleClickPrevious () {
            if (!this.isPreviousActive) {
                return;
            }
            this.omitOnce = true;
            this.$router.go(-this.historyStack[this.historyHead]);
            this.historyHead -= 1;
        },
        handleClickNext () {
            if (!this.isNextActive) {
                return;
            }
            this.omitOnce = true;
            this.historyHead += 1;
            this.$router.go(this.historyStack[this.historyHead]);
        },
        handleClickRefresh () {
            if (!this.isRefreshActive) {
                return;
            }
            // 页面重载，整个app会初始化
            window.location.reload();
        },
        handleSubmit () {
            const searchType = this.searchType || this.defaultSearchType;
            if (this.inspect) {
                console.log(`Go to /${searchType.replace('-', '/')}/${this.keywords}`);
            }
            this.$router.push({name: searchType, params: {keywords: this.keywords}});
        },
        handleClickPageTag (routerName) {
            this.$router.replace({
                name: routerName,
                params: {
                    keywords: this.keywords,
                },
            });
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .content-header {

        .foreground {
            margin-top  : 5px;
            /*relative是为了提高层叠顺序，盖在background上面*/
            position    : relative;
            background  : white;
            /*防止.foreground-page-tags隐藏后高度塌陷*/
            height      : 35px;
            padding-top : 5px;

            &-browsing-buttons {
                position  : absolute;
                top       : 50%;
                left      : 15px;
                transform : translate3d(0, -50%, 0);
                color     : $gray-3;

                .previous, .next, .refresh {
                    float         : left;
                    width         : 18px;
                    height        : 18px;
                    line-height   : 18px;
                    text-align    : center;
                    border        : 1px solid $gray-3;
                    border-radius : 2px;
                }

                .previous {
                    &.active {
                        cursor : pointer;
                        color  : $gray-5;
                    }
                }

                .next {
                    margin-left : -1px;

                    &.active {
                        cursor : pointer;
                        color  : $gray-5;
                    }
                }

                .refresh {
                    margin-left : 5px;

                    &.active {
                        cursor : pointer;
                        color  : $gray-5;
                    }
                }
            }

            &-search-box {
                position   : absolute;
                top        : 50%;
                right      : 15px;
                transform  : translate3d(0, -50%, 0);
                transition : all .2s;

                &.active {
                    left      : 50%;
                    right     : unset;
                    transform : translate3d(-50%, -50%, 0);
                }
            }

            &-page-tags {
                text-align : center;

                &.v-enter-active, &.v-leave-active {
                    transition : all .2s;
                }

                &.v-enter, &.v-leave-to {
                    opacity   : 0;
                    transform : translateX(-25%);
                }
            }

            &-return-button {
                position      : absolute;
                top           : 50%;
                right         : 25px;
                transform     : translate3d(0, -50%, 0);
                border        : 1px solid $gray-3;
                border-radius : 3px;
                cursor        : pointer;

                p {
                    padding     : 3px 6px;
                    color       : $gray-5;
                    font-size   : 12px;
                    line-height : 12px;
                }

                &:hover {
                    background : $gray-1
                }
            }
        }

        .background {
            margin-top    : -35px;
            background    : $gray-1;
            /*background默认会延伸到border盒*/
            border-bottom : 1px solid transparent;
            transition    : all .2s ease-out;

            &-page-tags {
                text-align : center;
            }

            &.active {
                margin-top    : 0;
                border-bottom : none;
            }
        }
    }
</style>