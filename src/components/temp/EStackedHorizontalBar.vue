<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    LegendComponent,
    LegendComponentOption,
    TitleComponent,
    TitleComponentOption
} from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { titleFontSize, xAxisLabelFontSize, yAxisLabelFontSize } from '../../assets/style';

const props = defineProps({
    datas: {
        type: Object as () => {
            title: string[],
            datas: Record<string, number[]>
        },
        required: true
    },
    title: {
        type: String,
    }
})

echarts.use([
    TooltipComponent,
    TitleComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    CanvasRenderer
]);

type EChartsOption = echarts.ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | BarSeriesOption
>;

let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
let myChart: echarts.ECharts;

const option: EChartsOption = {
    title: {
        text: props.title,
        textStyle: {
            color: "#fff",
            fontSize: titleFontSize
        },
        top: "top",
        left: "left"
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {
        textStyle: {
            color: "#fff"
        },
        left: "right",
        top: "28px"
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            color: "#fff",
            fontSize: xAxisLabelFontSize,
        }
    },
    yAxis: {
        type: 'category',
        data: Object.keys(props.datas.datas),
        axisLabel: {
            color: "#fff",
            fontSize: xAxisLabelFontSize,
        },
    },
    series: [
        ...props.datas.title.map((name, index) => ({
            name,
            type: 'bar',
            stack: 'total',
            label: {
                show: true,
                color: "#fff",
                fontSize: xAxisLabelFontSize
            },
            emphasis: {
                focus: 'series'
            },
            data: Object.values(props.datas.datas).map((v) => v[index]),
        } as BarSeriesOption)),
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

watch(() => props.datas, (newVal) => {
    myChart.setOption({
        yAxis: {
            data: Object.keys(newVal.datas)
        },
        series: [
            ...newVal.title.map((name, index) => ({
                name,
                type: 'bar',
                stack: 'total',
                label: {
                    show: true,
                    color: "#fff",
                    fontSize: xAxisLabelFontSize
                },
                emphasis: {
                    focus: 'series'
                },
                data: Object.values(newVal.datas).map((v) => v[index]),
            } as BarSeriesOption)),
        ]
    })
})

</script>

<style lang="less" scoped></style>