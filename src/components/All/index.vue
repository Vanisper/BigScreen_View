<template>
    <div ref="appRef" class="home" :style="{
        height: !isAutoResetScale ? '100%' : '',
        width: !isAutoResetScale ? '100%' : ''
    }">
        <!-- <Teleport to="#app > div > div > div.headerTa">
            <span @click="isAutoResetScale = !isAutoResetScale">自适应比例</span>
        </Teleport> -->
        <div class="bigScreen">
            <header-tab :Title="$route.meta.title as (string | undefined)">
                <div @click="toggle"
                    style="display: flex;justify-content: center ;align-items: center;overflow: hidden;position: absolute;right: 10px;top: 25px;cursor: pointer;">
                    <svg t="1687580220747" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="1596" width="32" height="32">
                        <path
                            d="M368.896 192H224a32 32 0 0 0-32 32v137.888a32 32 0 0 0 64 0V256h112.896a32 32 0 0 0 0-64zM784.864 192H640a32 32 0 1 0 0 64h112.864v105.888a32 32 0 1 0 64 0V224a32 32 0 0 0-32-32zM368.896 777.92H256V672a32 32 0 1 0-64 0v137.92a32 32 0 0 0 32 32h144.896a32 32 0 1 0 0-64zM784.864 640a32 32 0 0 0-32 32v105.92H640a32 32 0 1 0 0 64h144.864a32 32 0 0 0 32-32V672a32 32 0 0 0-32-32z"
                            fill="#FFF" p-id="1597"></path>
                        <path
                            d="M912 48h-800c-35.296 0-64 28.704-64 64v800c0 35.296 28.704 64 64 64h800c35.296 0 64-28.704 64-64v-800c0-35.296-28.704-64-64-64z m-800 864v-800h800l0.064 800H112z"
                            fill="#FFF" p-id="1598"></path>
                    </svg>
                </div>
                <CurrTime style="margin-left: 10px;position: absolute;right: 60px;top: 25px;font-weight: 900;z-index: 1;">
                    <n-dropdown v-if="!isIFrame" :options="options" placement="bottom-start" trigger="hover" @select="handleSelect">
                        <n-button class="select" text-color="#fff">{{ select.label }}</n-button>
                    </n-dropdown>
                </CurrTime>
            </header-tab>
            <router-view>
                <!-- 缓存处理 -->
                <template #default="{ Component, route }">
                    <component v-if='!route.meta.keepAlive' :is="Component" :key="route.fullPath"></component>
                    <keep-alive v-else>
                        <component :is="Component" :key="route.fullPath"></component>
                    </keep-alive>
                </template>
            </router-view>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref, onUnmounted } from "vue";
import { useMessage, NDropdown, NButton } from 'naive-ui';
import { useFullscreen } from '@vueuse/core';
import { HeaderTab } from "./includes/headerTab";
import CurrTime from "../temp/CurrTime.vue";
import useIndex, { ScaleModeType } from "./utils/useDraw";

import { IGeoJSON } from "../../types";

// * 适配处理
const options = [
    {
        label: "拉伸模式",
        key: "0"
    },
    {
        label: "等比模式",
        key: "1"
    }
];
const select = ref<ISelect>(localStorage.getItem("AppScaleMode") ? (options.find((v) => v.key == localStorage.getItem("AppScaleMode")) || options[0]) as ISelect : options[0] as ISelect);
const { appRef, calcRate, windowDraw, setScaleMode, style, isIFrame } = useIndex(select.value.key);
// ** 屏幕适配缩放模式
interface ISelect {
    label: string;
    key: ScaleModeType
}
const handleSelect = (key: ScaleModeType) => {
    setScaleMode(key);
    select.value = options.find(v=>v.key==key) as ISelect;
    localStorage.setItem("AppScaleMode", key);
}

const isAutoResetScale = ref(true);
const fullscreenToggle = ref<() => Promise<void>>()
onMounted(() => {
    fullscreenToggle.value = useFullscreen(appRef.value?.parentElement).toggle;
    if (isAutoResetScale.value) {
        // todo 屏幕适应
        windowDraw()
        calcRate()
    }
})
const toggle = async (_event: MouseEvent) => {
    await fullscreenToggle.value!()
}

</script>

<style lang="less" scoped>
.home {
    width: v-bind("!isAutoResetScale ? '1920px' : `${style.baseWidth.value}px`");
    height: v-bind("!isAutoResetScale ? '1080px' : `${style.baseHeight.value}px`");
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transform-origin: left top;

    .bigScreen {
        width: 100%;
        height: 100%;
        background-image: url('../../assets/images/bg.png');
        background-size: cover;
        background-position: center center;
        display: flex;
        flex-direction: column;
    }
}
</style>