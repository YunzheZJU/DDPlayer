<template>
    <div class="lyrics-board">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'lyrics-board',
};
</script>

<style scoped lang="scss">
    @import "../../styles/colors";

    .lyrics-board {
        font-size   : 30px;
        line-height : 50px;
        text-align  : center;
        color       : $green;
        text-shadow : 0 0 2px $theme-invert;
        font-weight : 600;
        background  : hsla(0, 0, 0, .1);
    }
</style>