<template>
    <div class="search-album">
        <div class="result-count">
            <p v-if="loading">
                <img id="loading" src=""/>正在搜索...
            </p>
            <p v-else-if="error">
                {{ error }}
            </p>
            <p v-else>
                找到 {{ result.length }} 首与“<span class="highlight">{{ keywords }}</span>”有关的专辑
            </p>
        </div>
        <AlbumList class="result-list" :style="listStyles">
            <AlbumListItem class="result-list-item" v-for="(album, index) in result" :key="index"
                           :album="album" :highlight="keywords" :index="index">
            </AlbumListItem>
        </AlbumList>
    </div>
</template>

<script>
import Loading from '../../../assets/loading.svg';
import {mapGetters} from 'vuex';
import AlbumList from '../../common/album-list.vue';
import AlbumListItem from '../../common/album-list-item.vue';

export default {
    name: 'search-album',
    components: {AlbumListItem, AlbumList},
    props: {
        keywords: String,
    },
    data () {
        return {
            inspect: false,
            // 获取一定数量，只获取一次
            size: 20,
            result: [],
            error: '',
            loading: true,
        };
    },
    watch: {
        keywords () {
            this.getResult();
        },
    },
    computed: {
        ...mapGetters([
            'height',
        ]),
        listStyles () {
            return {
                height: `${this.height - 160}px`,
            };
        },
    },
    methods: {
        async getResult () {
            this.result = await this.$ajax.getSearchAlbumsFullAsync(this.keywords, this.size);
            this.loading = false;
            if (this.inspect) {
                console.log(this.result);
            }
        },
    },
    mounted () {
        document.getElementById('loading').src = Loading;
        this.getResult();
    },
    // beforeRouteUpdate (to, from, next) {
    //     console.log(to);
    //     console.log(from);
    //     // this.getResult();
    //     next();
    // },
};
</script>

<style scoped lang="scss">
    .search-album {
        padding : 20px 15px 0 15px;

        .result-count {
            padding-left : 20px;

            p {
                font-size   : 12px;
                line-height : 30px;
            }

            #loading {
                width          : 20px;
                height         : 20px;
                vertical-align : middle;
            }
        }

        .result-list {
            margin-left : 20px;

            &-item {
                margin : 15px 15px 0 0;
            }
        }
    }
</style>