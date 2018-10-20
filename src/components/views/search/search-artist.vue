<template>
    <div class="search-artist">
        <div class="result-count">
            <p v-if="loading">
                <img id="loading" src=""/>正在搜索...
            </p>
            <p v-else-if="error">
                {{ error }}
            </p>
            <p v-else>
                找到 {{ result.length }} 位与“<span class="highlight">{{ keywords }}</span>”有关的歌手
            </p>
        </div>
        <ArtistList class="result-list" :style="listStyles">
            <ArtistListItem class="result-list-item" v-for="(artist, index) in result" :key="index"
                            :artist="artist" :highlight="keywords" :index="index">
            </ArtistListItem>
        </ArtistList>
    </div>
</template>

<script>
import Loading from '../../../assets/loading.svg';
import {mapGetters} from 'vuex';
import ArtistListItem from '../../common/artist-list-item.vue';
import ArtistList from '../../common/artist-list.vue';

export default {
    name: 'search-artist',
    components: {ArtistListItem, ArtistList},
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
            this.result = await this.$ajax.getSearchArtistsFullAsync(this.keywords, this.size);
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
};
</script>

<style scoped lang="scss">
    .search-artist {
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
                margin : 5px 30px 0 0;
            }
        }
    }
</style>