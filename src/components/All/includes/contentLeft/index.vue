<template>
    <div class="container" style="position: relative;">
        <some-data v-fullscreen :datas="公母养殖模式类型" style="width: 100%;position: relative;"
            class="emoji_font borderOne"></some-data>
        <!-- <h1 style="color: #fff;" :style="{
            fontSize: titleFontSize,
            userSelect: 'none',
        }">养殖户规模</h1>
        <g-bubble style="height: 45%;width: 100%;pointer-events: none;" :datas="养殖户规模"></g-bubble> -->
        <!-- <e-bar v-fullscreen.dblclick style="height: 33%;width: 100%;position: relative;" :datas="养殖户规模数据" unit="户" :title="{
            text: '养殖户规模',
            isVertical: true
        }" color="#fac858">
            <div
                style="color: aliceblue;display: flex;flex-direction: column;position: absolute;width: 100%;font-weight: bold;font-size: 18px;">
                <div style="display: flex;justify-content: space-evenly;">
                    <span style="margin-left: 50px;">规模企业(500亩以上)</span>
                    <span>养殖大户(200-500亩)</span>
                </div>
                <div style="display: flex;justify-content: space-evenly;">
                    <span style="margin-left: 50px;">中户(50-200亩)</span>
                    <span>散户(50亩以下)</span>
                </div>
            </div>
        </e-bar> -->
        <!-- <e-bar v-fullscreen.dblclick style="height: 33%;width: 100%;" :datas="养殖大户Top5数据" unit="亩" :title="{
            text: '头部养殖大户',
            isVertical: true
        }"></e-bar> -->
        <e-pie v-fullscreen.dblclick ref="dom2" style="height: 50%;width: 100%;" :datas="塘口类型数据" :title="{
            text: '塘\n口\n类\n型',
            left: '10%',
        }" :radius="['0%', '70%']" :borderRadius="0" unit="个"></e-pie>
    </div>
</template>

<script lang="ts" setup>
import EBar from "../../../temp/EBar.vue";
import EPie from "../../../temp/EPie.vue";
import GBubble from "../../../temp/GBubble.vue";
import SomeData from "../../../Infos/SomeData.vue";
import 养殖户规模 from "../../../../datas/接口数据/养殖户规模.json";
import axios from "../../../../api/request"
import { getRealUrl, getRuleUrl } from "../../../../api/config";
import { onMounted, ref } from "vue";
import vFullscreen from "../../../../hooks/fullScreenHook";
import { subTitleFontSize, titleFontSize } from "../../../../assets/style";
import { use } from "echarts";

const 养殖户规模数据 = ref<{
    [key: string]: any;
    name: string;
    value: string;
}[]>([]);

const 公母养殖模式数据 = ref<{
    title: string[],
    datas: {
        pic: string,
        name: string,
        values: string[]
    }[]
}>({
    title: [],
    datas: []
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

interface I养殖大户Top5_多指标 {
    titles: string[],
    datas: {
        label: string,
        name: string,
        values: number[],
        type: 'bar' | 'line'
    }[]
}

interface I养殖大户Top5 {
    [key: string]: any;
    name: string;
    value: number;
}
const 养殖大户Top5数据 = ref<I养殖大户Top5[]>([]);

const 塘口类型数据 = ref<{
    name: string,
    value: number
}[]>([]);

onMounted(() => {
    axios.get<{
        data: {
            [x: string]: any;
            name: string;
            value: string;
        }[]
    }>(getRealUrl("养殖户规模")!).then((res) => {
        养殖户规模数据.value = res.data.data.data;
    })

    axios.get(getRealUrl("公母养殖模式")!).then((res) => {
        公母养殖模式数据.value = res.data.data.data;
    })
    axios.get(getRealUrl("公母养殖模式")!).then(res => {
        公母养殖模式类型.value = res.data.data.data;
    })
    axios.get<{
        data: I养殖大户Top5[]
    }>(getRealUrl("养殖大户Top5")!).then((res) => {
        养殖大户Top5数据.value = res.data.data.data;
    })

    axios.get(getRealUrl("塘口类型")!).then(res => {
        塘口类型数据.value = res.data.data.data;
    })

})
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .someData {
        position: relative;
        width: 100%;
        height: 33%;
        overflow: unset;
        flex-grow: 1;
    }
}
</style>