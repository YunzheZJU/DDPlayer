<template>
    <DialogBox class="about-box" @close="handleClose" v-click-outside="handleClose">
        <Icon slot="title-icon" type="information" size="sm"></Icon>
        <template slot="title">
            <span>关于</span>
        </template>
        <template slot="content-top">
            <div class="title">
                <p>产品信息</p>
            </div>
            <div class="logo">
                <img id="logo-with-text" src=""/>
            </div>
            <ScrollArea class="scroll">
                <div class="product">
                    <p>DD Player</p>
                </div>
                <div class="version">
                    <p>版本：{{ version }} build {{isElectron ? 'Electron' : 'Web'}}</p>
                </div>
                <div class="contributors">
                    <p>贡献者：
                        <a class="highlight" href="mailto:tsukiko@outlook.com">Tsukiko15</a>
                        <a class="highlight" href="mailto:zjubank@gmail.com">zjubank</a>
                        <a class="highlight" href="mailto:yunzhe@zju.edu.cn">Yunzhe</a>
                    </p>
                </div>
                <div class="homepage">
                    <p>项目主页：
                        <a class="highlight" href="https://github.com/Tsukiko15/NAP.Api">
                            NAP.Api
                        </a>
                        <a class="highlight" href="https://github.com/YunzheZJU/DDPlayer">
                            DDPlayer
                        </a>
                    </p>
                </div>
                <div class="rights">
                    <p>Anisong Project</p>
                </div>
                <div class="suggestions">
                    <p><a class="highlight" href="mailto:yunzhe@zju.edu.cn">帮助我们做得更好</a></p>
                </div>
                <div class="button-group">
                    <NormalButton @click.native="handleClearCache">
                        清除缓存
                    </NormalButton>
                    <NormalButton @click.native="handleClearSettings">
                        重置设置
                    </NormalButton>
                </div>
            </ScrollArea>
        </template>
        <template slot="content-bottom">
            <div class="button-close">
                <NormalButton :active="true" @click.native="handleClose">
                    关闭
                </NormalButton>
            </div>
        </template>
    </DialogBox>
</template>

<script>
import {mapState} from 'vuex';
import ClickOutside from '../../directives/clickoutside';
import Icon from '../common/icon.vue';
import LogoWithText from '../../assets/logo-with-text.png';
import NormalButton from '../common/normal-button.vue';
import ScrollArea from '../common/scroll-area.vue';
import DialogBox from '../common/dialog-box.vue';

// noinspection JSUnresolvedVariable
const isElectron = IS_ELECTRON;

export default {
    name: 'about-dialog',
    components: {ScrollArea, DialogBox, Icon, NormalButton},
    directives: {ClickOutside},
    data () {
        return {
            isElectron: isElectron,
        };
    },
    computed: {
        ...mapState([
            'version',
        ]),
    },
    methods: {
        handleClose () {
            this.$emit('close');
        },
        handleClearCache () {
            this.$ajax.clearCacheStorage().then(() => {
                this.$store.dispatch('addMessage', {
                    type: 'ok',
                    content: '数据缓存已清除，刷新后生效',
                });
            });
        },
        handleClearSettings () {
            this.$store.dispatch('clearSettingsStorage').then(() => {
                this.$store.dispatch('addMessage', {
                    type: 'ok',
                    content: '设置已重置，登录信息已清除，刷新后生效',
                });
            });
        },
    },
    mounted () {
        document.getElementById('logo-with-text').src = LogoWithText;
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .about-box {
        width  : 300px;
        height : 350px;

        .title {
            margin-top : 5px;

            p {
                color       : $theme;
                font-size   : 18px;
                line-height : 30px;
            }
        }

        .logo {
            margin : 10px 0;

            img {
                width : 200px;
            }
        }

        .scroll {
            height : 160px;

            .product {
                p {
                    font-size   : 16px;
                    line-height : 30px;
                }
            }

            .version, .contributors, .homepage, .rights, .suggestions {
                p {
                    font-size   : 12px;
                    line-height : 25px;
                }
            }

            .contributors, .homepage {
                a + a {
                    margin-left : 5px;
                }
            }

            .suggestions {
                margin-top : 10px;
            }

            .button-group {
                margin-top : 10px;
                /*text-align : justify;*/
            }
        }

        .button-close {
            text-align : right;
        }
    }
</style>