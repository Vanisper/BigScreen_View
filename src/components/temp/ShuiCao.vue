<template>
    <div v-fullscreen class="borderOne"
        style="color: azure;width: 100%;--theme-color: #5470c68f;position: relative;padding: 10px;display: flex;flex-direction: column;justify-content: center;">
        <!-- <h1 :style="{ fontSize: titleFontSize }">头部养殖企业</h1> -->
        <div style="display: flex;justify-content: space-around;background-color: var(--theme-color);padding: 10px 0;text-align: center;"
            :style="{ fontSize: '18px' }">
            <span style="width: 52%;">头部养殖主体</span><span style="width: 48%;">养殖面积（亩）</span>
        </div>
        <div v-for="(item, index) in 养殖大户Top5数据" style="display: flex;justify-content: space-around;text-align: center;">
            <span style="width: 52%;border: 1px var(--theme-color) solid;padding: 10px 0;">{{ item.name }}</span><span
                style="width: 48%;border: 1px var(--theme-color) solid;padding: 10px 0;">{{
                    item.value
                }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { subTitleFontSize } from "../../assets/style";
import { getRealUrl } from "../../api/config";
import axios from "../../api/request";

interface I养殖大户Top5 {
    [key: string]: any;
    name: string;
    value: number;
}
const 养殖大户Top5数据 = ref<I养殖大户Top5[]>([]);

onMounted(() => {
    axios.get<{
        data: I养殖大户Top5[]
    }>(getRealUrl("养殖大户Top5")!).then((res) => {
        养殖大户Top5数据.value = res.data.data.data;
    })
})
</script>