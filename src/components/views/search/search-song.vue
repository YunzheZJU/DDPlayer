<template>
    <div class="search-song">
        <div class="result-count">
            <p v-if="loading">
                <img id="loading" src=""/>正在搜索...
            </p>
            <p v-else-if="error">
                {{ error }}
            </p>
            <p v-else>
                找到 {{ result.length }} 首与“<span class="highlight">{{ keywords }}</span>”有关的歌曲
            </p>
        </div>
        <!--尽可能少地显示列表项，最大13行高度-->
        <SongList class="result-list" :can-delete="false" :item-count="result.length" height-type="fit"
                  :max-visible-item-count="Math.floor((height -  190) / 30)">
            <SongListItem v-for="(song, index) in result" :key="index"
                          type="entity" :song="song" :theme="index % 2 === 0 ? 'white' : 'gray'" :highlight="keywords"
                          :index="index">
            </SongListItem>
            <template slot="empty-text">
                这里，空的
            </template>
        </SongList>
    </div>
</template>

<script>
import Loading from '../../../assets/loading.svg';
import {mapGetters} from 'vuex';
import SongListItem from '../../common/song-list-item.vue';
import SongList from '../../common/song-list.vue';

export default {
    name: 'search-song',
    components: {SongListItem, SongList},
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
    },
    methods: {
        async getResult () {
            this.result = (await this.$ajax.getSearchSongsFullAsync(this.keywords, this.size)).map(info => ({
                ...info,
                from: {
                    name: `搜索结果：${this.keywords}`,
                    url: this.$route.path,
                },
            }));
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
    @import "../../../styles/colors";

    .search-song {
        padding : 20px 15px 0 15px;

        .result-count {
            padding-left : 20px;

            .highlight {
                color : $theme-invert;
            }

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
    }

</style>