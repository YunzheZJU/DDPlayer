<template>
    <div class="collection">
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    name: 'collection',
};
</script>

<style scoped lang="scss">
    .collection {
        position : absolute;
        top      : 45px;
        bottom   : 0;
        left     : 0;
        right    : 0;
    }
</style>