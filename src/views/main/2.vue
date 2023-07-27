<template>
    <div
        style="color: #fff;font-size: 25px;display: flex;flex-direction: column;flex-grow: 1;justify-content: space-around;overflow: hidden;">
        <div style="display: flex;justify-content: space-around;" ref="topDoms">
            <!-- 天气 -->
            <div v-fullscreen
                style="display:flex;align-items: center;justify-content: center;width: calc(100% - 38% - 33%);">
                <div style="display: flex;flex-direction: column;align-items: center;">
                    <div style="width: 100%;display: flex;align-items: center;">
                        <div style="width: 100%;">
                            <h1 :style="{
                                fontSize: titleFontSize,
                                width: '100%',
                                textAlign: 'center',
                            }">
                                <a class="link_out" style="color: #fff;"
                                    href="https://mp.weixin.qq.com/s/Mlw3Gvpf0L3ttHJNp3BWCg" target="_blank"
                                    title="前往数据来源">小龙虾产地价格</a>
                            </h1>
                            <scrollable-table :datas="今日小龙虾价格" :show="5" :duration="2000" style="font-size: medium;" />
                        </div>
                    </div>
                    <iframe style="width: 450px;height: 150px;margin-top: 10px;pointer-events: none;user-select: none;"
                        src="/weather/nanjing.html" frameborder="0"></iframe>
                    <iframe style="width: 450px;height: 150px;margin-top: 10px;pointer-events: none;user-select: none;"
                        src="/weather/xinghua.html" frameborder="0"></iframe>
                    <iframe style="width: 450px;height: 150px;margin-top: 10px;pointer-events: none;user-select: none;"
                        src="/weather/wuhu.html" frameborder="0"></iframe>
                    <!-- <iframe style="width: 450px;height: 150px;margin-top: 10px;pointer-events: none;user-select: none;"
                        src="/weather/hefei.html" frameborder="0"></iframe> -->
                    <!-- <iframe style="width: 450px;height: 150px;margin-top: 10px;pointer-events: none;user-select: none;"
                        src="/weather/ezhou.html" frameborder="0"></iframe> -->
                    <iframe style="width: 450px;height: 150px;margin-top: 10px;pointer-events: none;user-select: none;"
                        src="/weather/qianjiang.html" frameborder="0"></iframe>
                </div>
            </div>
            <div style="height: 100%;width: 38%;display: flex;justify-content: space-between;flex-direction: column;">
                <e-bar v-fullscreen style="height: 400px;" :datas="各规格发货量" unit="单位：斤" :title="{
                    text: '分拣中心库存',
                    isVertical: false,
                }" color="#04b49c" bar-width="50%"></e-bar>
                <e-pie v-fullscreen style="height: 500px;margin-top: 30px;" :show-legend="false" :title="{
                    text: '采购规格占比',
                    top: 'top',
                }" :datas="发货规格分布" :radius="['0', '60%']" label-position="outer"></e-pie>
                <!-- <e-bar-and-line v-fullscreen style="height: 400px;" :datas="{
                    titles: ['title1', 'title2'],
                    bar: [
                        {
                            label: 'label1',
                            name: 'name1',
                            values: [1, 2],
                        },
                        {
                            label: 'label2',
                            name: 'name2',
                            values: [4, 5],
                        },
                    ],
                    line: [
                        {
                            label: 'label3',
                            name: 'name3',
                            values: [4, 5],
                        }, {
                            label: 'label4',
                            name: 'name4',
                            values: [8, 1],
                        }, {
                            label: 'label4',
                            name: 'name5',
                            values: [8, 1],
                        }, {
                            label: 'label4',
                            name: 'name6',
                            values: [8, 1],
                        },
                    ],
                }"></e-bar-and-line> -->

            </div>
            <div
                style="display: flex;flex-direction: column;align-items: center;justify-content: space-around;height: 100%;width: 33%;">
                <historical-prices style="width: 100%;" v-fullscreen class="historicalPrices borderOne"></historical-prices>
                <div style="text-align: center;width: 100%;">
                    <h1 :style="{
                        fontSize: titleFontSize,
                    }">销地市场</h1>
                    <div
                        style="position: relative;;display: flex;flex-wrap: wrap;justify-content:space-evenly;align-items: center;">
                        <span v-for="(item, index) in 主要市场" :title="item.name"
                            style="display: flex;align-items: center;justify-content: center;height: fit-content;user-select: none;">
                            <img style="background-color: transparent;" :style="{
                                width: 100 + 'px',
                            }" :src=item.image :alt=item.name>
                        </span>
                    </div>
                </div>
                <div style="text-align: center;width: 100%;">
                    <h1 :style="{
                        fontSize: titleFontSize,
                    }">主要消费品牌</h1>
                    <div style="display: flex;justify-content: space-around;" :style="{
                        fontSize: subTitleFontSize,
                    }">
                        <span
                            style="margin: 10px;display: flex;flex-direction: column;align-items: center;justify-content: space-between;"
                            v-for="(item, index) in 主要消费品牌">
                            <img :src="item.image" alt="" style="height: auto;width: 100px;">
                            <span>{{ item.name }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onActivated, onMounted, onUnmounted, ref } from 'vue';
import HistoricalPrices from '../../components/HistoricalPrices/index.vue';
import ScrollableTable from '../../components/temp/ScrollableTable.vue';
import EBar from '../../components/temp/EBar.vue';
import EPie from '../../components/temp/EPie.vue';
import EBarAndLine from '../../components/temp/EBarAndLine.vue';
import axios from "../../api/request"
import { getRealUrl } from '../../api/config';
import { subTitleFontSize, titleFontSize } from '../../assets/style';
import vFullscreen from '../../hooks/fullScreenHook';

const topDoms = ref<HTMLElement>()
const 主要市场 = ref<{
    name: string;
    image: string;
}[]>([])
const 主要消费品牌 = ref<
    {
        name: string;
        image: string;
        url: string;
    }[]
>([])

const 今日小龙虾价格 = ref({
    title: ["湖北", "安徽", "江苏", "湖南",],
    data: [
        {
            label: "炮头",
            value: [36, 37, 38, 37, 37, 38, 38, 38, 38]
        }, {
            label: "789",
            value: [30, 31, 32, 30, 32, 32, 32, 32, 32]
        }, {
            label: "大青",
            value: [24, 25, 27, 26, 27, 28, 27, 27, 27]
        }, {
            label: "中青",
            value: [19, 19, 20, 20, 20, 21, 21, 21, 21]
        }, {
            label: "小青",
            value: [13, 13, 13, 13, 13, 14, 14, 14, 14]
        },
    ]
})

const 各规格发货量 = ref<{
    [key: string]: any;
    name: string;
    value: string | number;
}[]>([])

const 发货规格分布 = ref<{
    name: string;
    value: number;
}[]>([
    {
        name: "45-60",
        value: 0.4561
    }, {
        name: "79虾",
        value: 0.2737
    }, {
        name: "46虾",
        value: 0.1083
    }, {
        name: "单6",
        value: 0.0867
    }, {
        name: "60以上",
        value: 0.0753
    }
])


onMounted(() => {
    // 接口请求
    axios.get(getRealUrl("主要市场")!).then(res => {
        主要市场.value = res.data.data.data
    })

    axios.get(getRealUrl("主要消费品牌")!).then(res => {
        主要消费品牌.value = res.data.data.data
    })

    axios.get(getRealUrl("各规格发货量")!).then(res => {
        各规格发货量.value = res.data.data.data
    })
})

onActivated(() => {

})

</script>
<style>
/* .wv-lt-refresh {
    display: none;
} */
</style>
<style lang="less" scoped>
.historicalPrices {
    height: 400px;
    width: 800px;
}
</style>