<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption,
    TitleComponent,
    TitleComponentOption,
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { subTitleFontSize, titleFontSize } from '../../assets/style';

const props = defineProps({
    datas: {
        type: Array as () => {
            name: string,
            value: number
        }[],
        required: true
    },
    title: {
        type: Object as () => {
            text: string;
            top?: string;
            left?: string;
        },
    },
    /**
     * default: ['40%', '70%']
     */
    radius: {
        type: Array as () => string[],
        default: ['40%', '70%']
    },
    borderRadius: {
        type: Number,
        default: 8
    },
    rose: {
        type: String as () => "area" | "radius",
    },
    unit: {
        type: String,
        default: ""
    },
    labelPosition: {
        type: String as () => "outer" | "inner",
        default: "inner"
    },
    showLegend: {
        type: Boolean,
        default: true
    }
})

echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

type EChartsOption = echarts.ComposeOption<
    TooltipComponentOption | LegendComponentOption | PieSeriesOption | TitleComponentOption
>;

let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
let myChart: echarts.ECharts;

const option: EChartsOption = {
    title: {
        text: props.title?.text,
        textStyle: {
            color: "#fff",
            fontSize: titleFontSize
        },
        top: props.title?.top || "center",
        left: props.title?.left || "center"
    },
    tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
            const datas = params.data.datas as {
                type: string,
                value: number
            }[]
            if (datas) {
                return `${params.name}<br />${datas.map((item) => `${item.type}: ${item.value}`).join("<br />")}`
            } else {
                return `${params.name}: ${params.value}${props.unit}`
            }
        },
    },
    legend: {
        top: '0',
        left: 'center',
        textStyle: {
            color: "#fff",
            fontSize: subTitleFontSize,
        },
        show: props.showLegend,
        type: 'scroll',
        orient: 'horizontal' // vertical | horizontal
    },
    series: {
        name: props.title?.text,
        type: 'pie',
        roseType: props.rose,
        radius: props.radius,
        avoidLabelOverlap: false,
        itemStyle: {
            borderRadius: props.borderRadius,
            borderColor: '#000',
            borderWidth: 2
        },
        label: {
            show: true,
            color: "#fff",
            fontSize: "16px",
            formatter: '{b}: {d}%',
            position: props.labelPosition
        },
        emphasis: {
            label: {
                show: true,
                fontSize: titleFontSize,
                fontWeight: 'bold',
                color: "#fff"
            }
        },
        labelLine: {
            show: true
        },
        data: props.datas
    },
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
        series: {
            data: newVal
        }
    })
})
</script>

<style lang="less" scoped></style>