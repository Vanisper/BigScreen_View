<template>
    <div style="color: #fff;font-size: 20px;display: flex;align-items: center;">
        <span>{{ currentDate }}</span>
        <span style="margin-left: 10px;" ref="dom"></span>
    </div>
</template>


<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const currentDate = computed(() => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
});
const dom = ref<HTMLElement>()
let timer: NodeJS.Timeout | null = null;

function updateTime() {
    dom.value!.innerText = new Date().toLocaleTimeString();
}
onMounted(() => {
    // 每秒钟更新一次时间
    timer = setInterval(updateTime, 1000);
})
onUnmounted(() => {
    // 在组件卸载时清除定时器
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
});
</script>