<template>
    <recordNumberTab v-if="datas" style="margin: 10px 0;" :datas="datas['头部数据']" />
    <div v-if="datas" class="content">
        <div class="contentLeft">
            <div class="container">
                <some-data height="150px" v-fullscreen :datas="datas['养殖模式']" style="width: 100%;position: relative;"
                    class="emoji_font borderOne"></some-data>
                <!-- <e-pie v-fullscreen.dblclick style="height: calc(100% - 250px);width: 100%;" :datas="datas['养殖基地']" :title="{
                    text: '养\n殖\n基\n地',
                    left: '10%',
                }" :radius="['0%', '65%']" unit="亩" :borderRadius="0" labelPosition="inner"></e-pie> -->
                <e-bar v-fullscreen style="height: calc(100% - 250px);width: 100%;" :datas="datas['养殖基地']" unit="单位：亩"
                    :title="{
                        text: '养殖基地',
                        isVertical: false,
                    }" 
                    
                    :grid="{
                        left: '15%',
                    }"
                    color="#04b49c" bar-width="50%"></e-bar>
            </div>

        </div>
        <div class="contentCenter">
            <e-pie v-fullscreen.dblclick style="height: 50%;width: 100%;" :datas="datas['混养品类']" :title="{
                text: '混养品类',
                // left: '10%',
            }" :radius="['30%', '70%']" unit="亩" labelPosition="outer"></e-pie>
            <e-pie v-fullscreen.dblclick style="height: 50%;width: 100%;" :datas="datas['精养品类']" :title="{
                text: '精养品类',
                // left: '10%',
            }" :radius="['30%', '70%']" unit="亩" labelPosition="outer"></e-pie>
        </div>
        <div class="contentRight" style="justify-content: space-between;display: flex;flex-direction: column;">
            <e-stacked-horizontal-bar v-fullscreen.dblclick style="height: 40%;width: 100%;" :datas="datas['渔药品种使用情况']"
                title="渔药品种使用情况"></e-stacked-horizontal-bar>
            <div style="height: 60%;width: 100%;display: flex;flex-direction: column;text-align: center;">
                <h1 style="color: #fff;" :style="{
                    fontSize: titleFontSize,
                    userSelect: 'none',
                    postion: 'absolute',
                }">主要供应地</h1>
                <g-bubble style="height: calc(100% - 20px);width: 100%;pointer-events: none;" :datas="datas['主要供应区域']"></g-bubble>
                <div style="color: #ccc;font-size: large;padding-bottom: 20px;">
                    <p>根据养殖面积(亩)展示供应权重</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from "../../api/request";
import { onMounted, ref } from "vue";
import { getRealUrl } from "../../api/config";
import recordNumberTab from "../../components/All/includes/contentCenter/recordNumberTab";
import EStackedHorizontalBar from "../../components/temp/EStackedHorizontalBar.vue";
import GBubble from "../../components/temp/GBubble.vue";
import EPie from "../../components/temp/EPie.vue";
import EBar from "../../components/temp/EBar.vue";
import SomeData from "../../components/Infos/SomeData.vue";
import vFullscreen from "../../hooks/fullScreenHook";
import { titleFontSize } from '../../assets/style';

const datas = ref()
onMounted(() => {
    axios.get(getRealUrl("洪蓝街道数据")!).then((res) => {
        datas.value = res.data.data.data
    })
})
</script>

<style lang="less" scoped>
.content {
    display: flex;
    justify-content: space-between;
    height: 90%;
    padding: 10px;

    .contentLeft {
        width: 28%;

        .container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            position: relative;
            height: 100%;
        }
    }

    .contentCenter {
        width: 42%;
    }

    .contentRight {
        width: 28%;
    }
}
</style>