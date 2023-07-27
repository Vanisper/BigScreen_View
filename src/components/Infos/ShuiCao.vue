<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    MarkLineComponent,
    MarkLineComponentOption
} from 'echarts/components';
import { PictorialBarChart, PictorialBarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    TooltipComponent,
    GridComponent,
    MarkLineComponent,
    PictorialBarChart,
    CanvasRenderer
]);

type EChartsOption = echarts.ComposeOption<
    | TooltipComponentOption
    | GridComponentOption
    | MarkLineComponentOption
    | PictorialBarSeriesOption
>;
const grassList = import.meta.glob<{
    default: string
}>('/src/assets/images/grass/*.png', { eager: true })

const props = defineProps({
    datas: {
        type: Array as () => {
            name: string,
            value: number,
            [key: string]: any
        }[],
        required: true
    },
    maxData: {
        type: Number,
        required: true
    }
})

let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
// !!! 此图表较为复杂，这里必须这样使用；如果用vue的响应式包裹的话会出现问题
// https://github.com/apache/echarts/issues/16642
var myChart: echarts.ECharts

const spiritList: string[] = []
Object.keys(grassList).forEach((key) => {
    spiritList.push('image://' + grassList[key].default)
})

const maxData = props.maxData;
const option: EChartsOption = ({
    tooltip: {},
    title: {
        text: `水草类型（碳汇）         选择种植的农户数`,
        top: '10',
        left: '5',
        textStyle: {
            color: '#d8dee0'
        }
    },
    xAxis: {
        max: maxData,
        show: true,
        splitLine: { show: false },
        offset: 10,
        axisLine: {
            lineStyle: {
                color: '#ccc'
            }
        },
        axisLabel: {
            margin: 5
        }
    },
    yAxis: {
        data: props.datas.map(v => v.name),
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
            margin: 10,
            color: '#d8dee0',
            fontSize: 16
        }
    },
    grid: {
        top: 'center',
        height: 200,
        left: 90,
        right: 80
    },
    series: [
        {
            // current data
            type: 'pictorialBar',
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbolClip: true,
            symbolSize: 30,
            symbolBoundingData: maxData,
            data: spiritList.map((v, i) => ({
                value: props.datas.map(v => v.value)[i],
                symbol: v
            })),
            tooltip: {
                formatter: (params: any) => `<img style="height: 250px;width: 100%;" src="/images/waterGrass/${params.name}.png" /><div style="color: #000;font-size: 20px;"><span style="">${params.data.value}</span>个农户选择种植-<b>${params.name}</b></div>`,
            },
            markLine: {
                symbol: 'none',
                label: {
                    formatter: 'max: {c}',
                    position: 'start',
                    color: "#fff"
                },
                lineStyle: {
                    color: 'green',
                    type: 'dotted',
                    opacity: 0.2,
                    width: 2,
                },
                data: [
                    {
                        type: 'max'
                    }
                ],
                tooltip: {
                    formatter: (params: any) => `max: <b>${params.data.value}</b>`
                }
            },
            z: 10
        },
        {
            // full data
            type: 'pictorialBar',
            itemStyle: {
                opacity: 0.2
            },
            label: {
                show: true,
                position: 'right',
                offset: [10, 0],
                color: '#0f8e9c',
                fontSize: 18,
                opacity: 1,
                fontWeight: 800,
                shadowBlur: 8,
                shadowColor: '#0f8e9c'
            },
            animationDuration: 0,
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbolSize: 30,
            symbolBoundingData: maxData,
            data: spiritList.map((v, i) => ({
                value: props.datas.map(v => v.value)[i],
                symbol: v
            })),
            z: 5
        }
    ]
})

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