<template>
    <div class="container">
        <!-- <some-data v-fullscreen :datas="公母养殖模式类型" style="width: 100%;position: relative;"
            class="emoji_font borderOne"></some-data> -->

        <e-stacked-horizontal-bar v-fullscreen.dblclick style="height: 40%;width: 100%;" :datas="水草种植情况_碳汇"
            title="养殖水草（碳汇）"></e-stacked-horizontal-bar>
        <div style="height: 55%;width: 100%;display: flex;flex-direction: column;text-align: center;">
            <h1 style="color: #fff;" :style="{
                fontSize: titleFontSize,
                userSelect: 'none',
                postion: 'absolute',
            }">养殖户规模</h1>
            <g-bubble style="height: 75%;width: 100%;pointer-events: none;" :datas="养殖户规模"></g-bubble>
            <div style="color: #fff;">
                <div style="display: flex;justify-content: space-around;">
                    <span>规模企业(300亩以上)</span>
                    <span>养殖大户(100-300亩)</span>
                </div>
                <div style="display: flex;justify-content: space-around;">
                    <span>中户(30-100亩)</span>
                    <span>散户(30亩以下)</span>
                </div>
            </div>
        </div>
        <!-- <div style="display: flex;width: 100%;">
            <RingChart color="159, 224, 128" chartName="精品率" rate="31" />
            <RingChart color="238, 102, 102" chartName="投保率" rate="80" />
        </div> -->

        <!-- <e-bar v-fullscreen.dblclick ref="dom1" style="height: 33%;width: 100%;" :datas="种苗养殖面积数据" unit="亩" :title="{
            text: '种苗养殖面积',
            isVertical: false
        }" color="#9fe080"></e-bar> -->

    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import EPie from "../../../temp/EPie.vue";
import EStackedHorizontalBar from "../../../temp/EStackedHorizontalBar.vue";
import EBar from "../../../temp/EBar.vue";
import RingChart from "../../../All/includes/contentCenter/commonCharts/ringChart";
import GBubble from "../../../temp/GBubble.vue";
import vFullscreen from "../../../../hooks/fullScreenHook";
import axios from "../../../../api/request"
import { getRealUrl } from '../../../../api/config';
import SomeData from "../../../Infos/SomeData.vue";
import { subTitleFontSize, titleFontSize } from '../../../../assets/style';
import 养殖户规模 from "../../../../datas/接口数据/养殖户规模.json";

const 种苗养殖面积数据 = ref<{
    [key: string]: any;
    name: string;
    value: string;
}[]>([]);

const 水草种植情况_碳汇 = ref<{
    value: any;
    title: string[],
    datas: Record<string, number[]>
}>({
    title: [],
    datas: {},
    value: undefined
});

const 公母养殖模式类型 = ref<{
    title: string[];
    datas: {
        pic: string;
        name: string;
        values: string[];
    }[]
}>({
    title: [],
    datas: []
});

interface I养殖大户Top5 {
    [key: string]: any;
    name: string;
    value: number;
}
const 养殖大户Top5数据 = ref<I养殖大户Top5[]>([]);

onMounted(() => {
    axios.get(getRealUrl("种苗养殖面积")!).then(res => {
        种苗养殖面积数据.value = res.data.data.data;
    })

    axios.get(getRealUrl("水草种植情况_碳汇")!).then(res => {
        水草种植情况_碳汇.value = res.data.data.data;
    })

    axios.get(getRealUrl("公母养殖模式")!).then(res => {
        公母养殖模式类型.value = res.data.data.data;
    })
})
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .waterGrass,
    .intensive,
    .lllegalData {
        position: relative;
        width: 100%;
        height: 33%;
        overflow: unset;
    }
}
</style>