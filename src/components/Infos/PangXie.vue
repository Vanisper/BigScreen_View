<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from "echarts/core";
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
} from 'echarts/components';
import { BarChart, BarSeriesOption, PictorialBarChart, PictorialBarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
const crabList = import.meta.glob<{
    default: string
}>('/src/assets/images/crab/*.png', { eager: true })

const symbols: {
    name: string,
    default: string
}[] = []
Object.keys(crabList).forEach((key) => {
    symbols.push({
        name: key.split("/").pop()?.split(".")[0] || "",
        default: 'image://' + crabList[key].default
    })
})

echarts.use([
    TooltipComponent,
    GridComponent,
    BarChart,
    PictorialBarChart,
    CanvasRenderer,
]);

type EChartsOption = echarts.ComposeOption<
    | TooltipComponentOption
    | GridComponentOption
    | BarSeriesOption | PictorialBarSeriesOption
>;

const props = defineProps({
    datas: {
        type: Array as () => {
            name: string,
            value: number,
            [key: string]: any
        }[],
        required: true
    },
    bodyMax: {
        type: Number,
        required: true
    }
})

const chartDom = ref<HTMLElement>()
var myChart: echarts.ECharts
let chartObserver: ResizeObserver
const option: EChartsOption = {
    tooltip: {},
    grid: {
        // top: 'center',
        // left: "50",
        // right: "50",
        // bottom: "50"
    },
    xAxis: {
        data: props.datas.map(v => v.name),
        axisLabel: {
            //坐标轴刻度标签的相关设置。
            interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
            margin: 15,
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 15
        },
        axisTick: {
            //坐标轴刻度相关设置。
            show: false
        },
        axisLine: {
            //坐标轴轴线相关设置
            lineStyle: {
                color: '#fff',
                opacity: 0.2
            }
        },
        splitLine: {
            //坐标轴在 grid 区域中的分隔线。
            show: false
        }
    },
    yAxis: {
        type: 'value',
        splitNumber: 5,
        max: props.bodyMax,
        axisLabel: {
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 14
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: ['#fff'],
                opacity: 0.06
            }
        }
    },
    series: [
        {
            name: "item",
            data: props.datas.map(value => ({
                ...value,
                symbol: symbols.filter(v => v.name == value.name)[0].default
            })),
            type: "pictorialBar",
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbolClip: true,
            symbolSize: 30,
            symbolBoundingData: props.bodyMax,
            tooltip: {
                formatter: (params) => {
                    const datas = (params.data as any)
                    return `<div style="font-size: 18px;">${datas["name"]}
                    <br />养殖户数：${datas["value"]}
                    <br />总塘口数量：${datas["pondNum"]}
                    <br />预期产量：${datas["expectedProductionVolume"]}斤                    
                    <br />预期存活率：${datas["expectedSurvivalRate"] * 100}%</div>`
                }
            },
            label: {
                show: true,
                position: 'top',
                offset: [0, -20],
                formatter: function (param: any) {
                    return ((param.data.value / props.bodyMax) * 100).toFixed(0) + '%';
                },
                fontSize: 18,
                fontFamily: 'Arial'
            },
            z: 10
        },
        {
            name: "full",
            data: props.datas.map(value => ({
                value: props.bodyMax,
                symbol: symbols.filter(v => v.name == value.name)[0].default
            })),
            itemStyle: {
                opacity: 0.2
            },
            symbolBoundingData: props.bodyMax,
            animationDuration: 0,
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbolSize: 30,
            type: "pictorialBar",
            tooltip: {
                show: false,
                formatter: (params) => {
                    const datas = (params.data as any)
                    return `<div style="font-size: 18px;">${datas["value"]}</div>`
                }
            },
            // barWidth: 10,
            // barGap: 0, //柱间距离
            label: {
                //图形上的文本标签
                show: false,
            },
            z: 5
        }
    ]
}

onMounted(() => {
    myChart = echarts.init(chartDom.value!);
    myChart.showLoading();
    myChart.resize();

    myChart.hideLoading();
    myChart.setOption(option);
    chartObserver = new ResizeObserver(() => {
        myChart.resize();
    });
    chartObserver.observe(chartDom.value!);
})
onUnmounted(() => {
    chartObserver.disconnect()
})

</script>