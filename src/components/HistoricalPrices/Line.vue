<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts/core";
import { TitleComponent, TitleComponentOption, LegendComponent, LegendComponentOption, GridComponent, GridComponentOption, DatasetComponent, DatasetComponentOption } from "echarts/components";
import { LineSeriesOption, LineChart } from "echarts/charts";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
    dataset: {
        type: Array as () => (string | number | null)[][],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    color: {
        type: String
    }
})
watch(() => props.dataset, (_value) => {
    myChart.setOption(option.value, true)
})
echarts.use([TitleComponent, LegendComponent, GridComponent, DatasetComponent, LineChart])
type EChartsOption = echarts.ComposeOption<TitleComponentOption | LegendComponentOption | GridComponentOption | DatasetComponentOption | LineSeriesOption>;
const chartDom = ref<HTMLElement>()
let myChart: echarts.ECharts
let chartObserver: ResizeObserver
// 指定图表的配置项和数据
const option = computed<EChartsOption>(() => ({
    title: {
        text: props.title,
        textStyle: {
            color: props.color || "#fff"
        },
        top: "30px",
        show: false
    },
    legend: {
        textStyle: {
            color: props.color || "#fff"
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    dataset: {
        source: props.dataset.map(v => {
            return v.map(v => v == null ? "" : v)
        })
    },
    // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
    xAxis: {
        type: 'category',
        axisLabel: {
            color: props.color || "#fff"
        }
    },
    // 声明一个 Y 轴，数值轴。
    yAxis: {
        axisLabel: {
            color: props.color || "#fff"
        },
        splitLine: {
            // show: false
            lineStyle: {
                color: ['#fff'],
                opacity: 0.1
            }
        }
    },
    // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
    series: props.dataset[0].filter((_, index) => index != 0).map(_ => ({
        type: 'line',
        smooth: true,
        // 不显示点
        showSymbol: false,
    }))
}));

onMounted(() => {
    myChart = echarts.init(chartDom.value!)
    myChart.showLoading();
    myChart.resize();

    myChart.hideLoading();
    myChart.setOption(option.value);
    chartObserver = new ResizeObserver(() => {
        myChart.resize()
    })
    chartObserver.observe(chartDom.value!)
})
onUnmounted(() => {
    chartObserver.disconnect()
})
</script>

<style lang="less" scoped></style>