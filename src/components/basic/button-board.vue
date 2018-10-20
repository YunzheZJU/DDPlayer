<template>
    <div class="button-board">
        <ScrollArea class="button-board-scroll" :style="scrollStyles">
            <ButtonList class="button-board-list" v-for="(group, name) in buttonListButtons" :key="name">
                <ButtonListButton class="button-board-button" v-for="item in group" :key="item.key" :to="item.to"
                                  v-title>
                    <Icon slot="icon" slot-scope="props" size="sm"
                          :type="(props.isActive && item.active) ? item.active.icon : item.icon"
                          :color="(props.isActive && item.active) ? item.active.color : item.color"></Icon>
                    <template slot="title">
                        {{ item.name }}
                        <template v-if="item.name === '播放列表' && playlistLength">
                            （{{ playlistLength }}）
                        </template>
                    </template>
                </ButtonListButton>
            </ButtonList>
        </ScrollArea>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Title from '../../directives/title';
import buttonBoardButtons from './button-board-buttons';
import ButtonList from '../common/button-list.vue';
import ButtonListButton from '../common/button-list-button.vue';
import Icon from '../common/icon.vue';
import ScrollArea from '../common/scroll-area.vue';

export default {
    name: 'button-board',
    components: {ScrollArea, ButtonList, ButtonListButton, Icon},
    directives: {Title},
    computed: {
        ...mapGetters([
            'height',
        ]),
        ...mapGetters('playlist', [
            'playlistLength',
        ]),
        ...mapGetters('collection', [
            'collections',
        ]),
        buttonListButtons () {
            buttonBoardButtons.collection = [buttonBoardButtons.collection[buttonBoardButtons.collection.length - 1]];
            buttonBoardButtons.collection.unshift(...this.collections.map(item => {
                item.key = `collection-${item.id}`;
                item.to = {
                    name: 'collection-detail',
                    params: {
                        id: item.id,
                    },
                };
                item.icon = 'playlist-2';
                return item;
            }));
            return buttonBoardButtons;
        },
        scrollStyles () {
            return {
                height: `${this.height - 100}px`,
            };
        },
    },
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .button-board {
        padding : 15px 1px 10px 1px;

        &-list {
            margin : 0 9px;
        }

        &-list + &-list {
            margin-top : 16px;
        }

        &-button + &-button {
            margin-top : 6px;
        }
    }
</style>