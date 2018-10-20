<template>
    <DialogBox class="sign-dialog" @close="handleClose" @keypress.native.enter="handleConfirm"
               v-click-outside="handleClose">
        <template slot="title" v-if="isSignIn">
            帐号登录
        </template>
        <template slot="title" v-else>
            帐号注册
        </template>
        <template slot="content-top">
            <div class="hint">
                <template v-if="isSignIn">
                    <p>
                        登录您的DD Music帐号。
                    </p>
                    <p>
                        加推列表等信息将在后台与服务器数据同步。
                    </p>
                </template>
                <template v-else>
                    <p>
                        我们将尽最大努力保护您的帐号安全。
                    </p>
                    <p>
                        但仍建议您<span class="warning">使用与其他网站不同的密码</span>。
                    </p>
                </template>
            </div>
            <InputBox class="input" input-type="text" :icon-type="passed.userId && isSignUp ? 'ok' : 'artist'"
                      :value.sync="userId" :placeholder="isSignIn ? '用户名 / 学号 / 邮箱' : '学号'" :extra="isSignUp"
                      :passed="passed.userId && isSignUp" @change="handleChangeUserId">
                <!--非sign up中不起作用-->
                @zju.edu.cn
            </InputBox>
            <InputBox class="input" input-type="password" :icon-type="passed.password && isSignUp ? 'ok' : 'lock-1'"
                      :value.sync="password" placeholder="密码" :passed="passed.password && isSignUp"
                      @input="handleInputPassword"></InputBox>
            <transition>
                <!--只会在sign-up中出现-->
                <!--密码检查是本地的，可以将频率设置得高一些，所以使用了input事件-->
                <InputBox class="input" input-type="password" :icon-type="passed.passwordConfirmed ? 'ok' : 'lock-2'"
                          :value.sync="passwordConfirmed" :passed="passed.passwordConfirmed" placeholder="确认密码"
                          v-show="isSignUp" @change="handleChangePasswordConfirmed"></InputBox>
            </transition>
            <transition>
                <!--只会在sign-up中出现-->
                <InputBox class="input" input-type="text" :icon-type="passed.username ? 'ok' : 'at'"
                          :value.sync="username"
                          :passed="passed.username" placeholder="输入一个用户名" v-show="isSignUp"
                          @change="handleChangeUsername"></InputBox>
            </transition>
        </template>
        <template slot="content-bottom">
            <transition>
                <!--只会在sign-up中出现-->
                <div class="return" @click="toSignIn" v-show="isSignUp">
                    <p>&lt;返回帐号登录</p>
                </div>
            </transition>
            <div class="button-group">
                <transition>
                    <!--只会在sign-in中出现-->
                    <NormalButton class="button" :active="true" @click.native="handleConfirm" v-show="isSignIn">
                        登录
                    </NormalButton>
                </transition>
                <transition>
                    <!--在sign-up中会改变形态-->
                    <NormalButton class="button" :active="isSignUp" @click.native="handleClickSignUp">
                        注册{{ isSignUp ? '新账号' : ''}}
                    </NormalButton>
                </transition>
            </div>
            <transition>
                <div class="third-party" v-show="isSignIn">
                    <div class="name">
                        <p>其他方式登录</p>
                    </div>
                    <div class="link-group">
                        <ThirdPartyLink class="link" :image-src="cc98logo" theme-color="#28a7e1"
                                        :url="cc98url">
                            CC98
                        </ThirdPartyLink>
                    </div>
                </div>
            </transition>
        </template>
    </DialogBox>
</template>

<script>
import CC98LOGO from '../../assets/cc98logo.png';
import ClickOutside from '../../directives/clickoutside';
import InputBox from '../common/input-box.vue';
import NormalButton from '../common/normal-button.vue';
import ThirdPartyLink from '../common/third-party-link.vue';
import DialogBox from '../common/dialog-box.vue';

export default {
    name: 'sign-dialog',
    components: {ThirdPartyLink, NormalButton, InputBox, DialogBox},
    directives: {ClickOutside},
    data () {
        return {
            mode: 'sign-in',
            userId: '',
            password: '',
            passwordConfirmed: '',
            username: '',
            cc98url: 'https://openid.cc98.org/connect/authorize?client_id=81b172e6-6a62-4fee-3a7b-08d571f52ead&scope=openid%20cc98-api&response_type=id_token%20token&redirect_uri=http%3a%2f%2flocalhost:8080&state=abc&nonce=xyz',
            cc98logo: CC98LOGO,
            passed: {
                userId: false,
                password: false,
                passwordConfirmed: false,
                username: false,
            },
            inspect: false,
        };
    },
    computed: {
        isSignIn () {
            return this.mode === 'sign-in';
        },
        isSignUp () {
            return this.mode === 'sign-up';
        },
    },
    methods: {
        handleClose () {
            this.$emit('close');
        },
        handleConfirm () {
            if (this.isSignIn) {
                this.signIn();
            } else {
                this.signUp();
            }
        },
        handleClickSignUp () {
            if (this.isSignIn) {
                this.toSignUp();
            } else {
                this.signUp();
            }
        },
        toSignUp () {
            this.mode = 'sign-up';
        },
        toSignIn () {
            this.mode = 'sign-in';
        },
        signIn () {
            if (this.inspect) {
                console.log(`Ready to submit: userId = ${this.userId}, password = ${this.password}`);
            }
        },
        signUp () {
            if (this.inspect) {
                console.log(`Ready to submit: userId = ${this.userId}, password = ${this.password}, username = ${this.username}`);
            }
        },
        handleChangeUserId (value) {
            if (value) {
                this.passed.userId = true;
            }
        },
        handleInputPassword (value) {
            if (value) {
                this.passed.password = true;
            }
        },
        handleChangePasswordConfirmed (value) {
            if (value) {
                this.passed.passwordConfirmed = true;
            }
        },
        handleChangeUsername (value) {
            if (value) {
                this.passed.username = true;
            }
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .sign-dialog {
        width  : 300px;
        height : 350px;

        .hint {
            margin : 15px 0;

            p {
                font-size   : 12px;
                line-height : 20px;
            }

            .warning {
                color : $theme-light-1;
            }
        }

        .input {

            &.v-enter-active, &.v-leave-active {
                transition : all .2s;
            }

            &.v-enter-to, &.v-leave {
                max-height : 50px;
            }

            &.v-enter, &.v-leave-to {
                opacity    : 0;
                max-height : 0;
                margin-top : 0 !important;
            }
        }

        .input + .input {
            margin-top : 20px;
        }

        .return {
            float  : left;
            color  : $gray-4;
            cursor : pointer;

            &:hover {
                color           : $theme-invert;
                text-decoration : underline;
            }

            &.v-enter-active, &.v-leave-active {
                transition : all .2s;
            }

            &.v-enter, &.v-leave-to {
                opacity : 0;
            }

            p {
                font-size   : 12px;
                line-height : 25px;
            }
        }

        .button-group {
            text-align : right;

            .button {
                &.v-enter-active, &.v-leave-active {
                    transition : all .2s;
                }

                &.v-enter, &.v-leave-to {
                    opacity   : 0;
                    transform : translateX(-200%);
                }
            }

            .button + .button {
                margin-left : 10px;
            }
        }

        .third-party {
            margin-top : 10px;

            &.v-enter-active, &.v-leave-active {
                transition : all .2s;
            }

            &.v-enter-to, &.v-leave {
                max-height : 100px;
            }

            &.v-enter, &.v-leave-to {
                margin-top : 0;
                max-height : 0;
            }

            .name {

                p {
                    color       : $gray-4;
                    font-size   : 12px;
                    line-height : 20px;

                    &:after {
                        content        : '';
                        display        : inline-block;
                        width          : 100%;
                        vertical-align : middle;
                        border-top     : 1px solid $gray-3;
                    }
                }
            }
        }

        .link-group {
            margin-top : 5px;
            text-align : center;

            .link {
                display : inline-block;
            }
        }
    }
</style>