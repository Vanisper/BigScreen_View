<template>
    <div class="headerTab">
        <div style="position: absolute;left: 10px;top: 25px;font-size: x-large;">
            <router-link class="link" to="/home/1" :class="{ active: $route.path == '/home/1' }">高淳固城湖</router-link>
            <router-link class="link" to="/home/2" :class="{ active: $route.path == '/home/2' }">分拣中心</router-link>
            <router-link class="link" to="/home/3" :class="{ active: $route.path == '/home/3' }">溧水洪蓝街道</router-link>
            <router-link class="link" to="/home/4" :class="{ active: $route.path == '/home/4' }">扬州宝应夏集镇</router-link>
        </div>
        <!-- <p>{{ Title || "标题" }}</p> -->
        <slot />
    </div>
</template>

<script lang="ts" setup>
defineProps({
    Title: String
})
</script>

<style lang="less" scoped>
.headerTab {
    width: 100%;
    height: 9%;
    // background-image: url("../../../../assets/images/headerBg.png");
    background-size: cover;
    background-position: center center;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .link {
        color: #93e4fb;
        margin: 0 12px;
        border: 1px solid #93e4fb;
        padding: 5px 10px;
        border-radius: 10px;
    }

    .link.active {
        color: yellowgreen;
        border-color: yellowgreen;
    }

    p {
        font-size: 35px;
        color: #a5ccf2;
    }
}
</style>