<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as echarts from "echarts/core";
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TitleComponentOption } from 'echarts/components';
import { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
import { rgbaColorToHash } from "../../../../../utils/Color";
import { cellTo } from '../../../../../utils/Math';

echarts.use([
    CanvasRenderer, TitleComponent, GaugeChart
]);

type EChartsOption = echarts.ComposeOption<
    TitleComponentOption | GaugeSeriesOption
>;

const props = defineProps({
    // 图表颜色
    color: {
        type: String,
        default: "0,0,0",
    },
    // 图表名称
    chartName: {
        type: String,
        require: "",
    },
    // 百分比
    rate: {
        type: String,
        default: 100,
    },
    // 显示数据
    text: {
        type: String,
        default: "100"
    }
})
const option = ref<EChartsOption>();

const chartDom = ref<HTMLElement>()
var myChart: echarts.ECharts
let chartObserver: ResizeObserver
const first = ref(true)
onMounted(() => {
    myChart = echarts.init(chartDom.value!);
    myChart.showLoading();
    myChart.resize();
    myChart.hideLoading();
    myChart.setOption(option.value!);
    chartObserver = new ResizeObserver(() => {
        myChart.resize();
    });
    chartObserver.observe(chartDom.value!);
    first.value = false
})
onUnmounted(() => {
    chartObserver.disconnect()
})

const reset = () => {
    option.value = {
        title: {
            text: props.chartName,
            // subtext: props.rate,
            textStyle: {
                color: "rgba(" + props.color + ", 1)",
                fontSize: 16
            },
            subtextStyle: {
                position: "left"
            },
            left: "center",
            top: "5",
        },
        series: [
            {
                type: "gauge",
                radius: "100%",
                progress: {
                    show: true,
                    width: 13,
                    itemStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 1,
                                    color: rgbaColorToHash("rgba(" + props.color + ", 0.2)"),
                                },
                                {
                                    offset: 0.9,
                                    color: rgbaColorToHash("rgba(" + props.color + ", 0.4"),
                                },
                                {
                                    offset: 0.31,
                                    color: rgbaColorToHash("rgba(" + props.color + ", 0.5)"),
                                },
                                {
                                    offset: 0.15,
                                    color: rgbaColorToHash("rgba(" + props.color + ", 0.6)"),
                                },
                                {
                                    offset: 0,
                                    color: rgbaColorToHash("rgba(" + props.color + ", 1)"),
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },
                },
                center: ["50%", "60%"],
                axisLine: {
                    lineStyle: {
                        width: 13,
                        color: [[1, "#1c5985"]],
                    },
                },
                axisTick: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                pointer: {
                    show: false,
                },
                title: {
                    show: false,
                },
                detail: {
                    valueAnimation: true,
                    // formatter: props.text,
                    fontSize: 24,
                    offsetCenter: [0, 0],
                    color: "#fff",
                },
                data: [
                    {
                        value: +cellTo(+props.rate, -2).toFixed(2),
                    },
                ],
            },
        ],
    };
    if (!first.value) {
        myChart.setOption(option.value, true);
    }

}

watch(() => props, () => {
    reset()
}, {
    deep: true,
    immediate: true
})
</script>

<style lang="less" scoped></style>