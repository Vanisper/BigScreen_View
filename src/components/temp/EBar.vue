<template>
    <div style="display: flex;flex-direction: column;">
        <slot />
        <div ref="chartDom" style="flex-grow: 1;"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts/core";
import {
    TitleComponentOption, TitleComponent,
    GridComponent,
    GridComponentOption,
} from "echarts/components";
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, onUnmounted, ref, watch } from "vue";
import { xAxisLabelFontSize, titleFontSize, yAxisLabelFontSize } from "../../assets/style";
echarts.use([
    TitleComponent, BarChart, CanvasRenderer, GridComponent
])
type EChartsOption = echarts.ComposeOption<
    TitleComponentOption | BarSeriesOption | GridComponentOption
>;

const props = defineProps({
    datas: {
        type: Array as () => {
            name: string,
            value: string | number,
            [key: string]: any
        }[],
        required: true
    },
    unit: {
        type: String
    },
    title: {
        type: Object as () => {
            text: string,
            isVertical: boolean
        },
        default: ""
    },
    color: {
        type: String
    },
    barWidth: {
        type: String,
        default: "20%"
    },
    grid: {
        type: Object as () => {
            width?: number | string;
            height?: number | string;
            top?: number | string;
            right?: number | string;
            bottom?: number | string;
            left?: number | string;
        }
    }
})

let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
let myChart: echarts.ECharts;

const option: EChartsOption = {
    title: {
        text: props.title.isVertical ? props.title.text.split("").join("\n") : props.title.text,
        top: props.title.isVertical ? "center" : "top",
        left: props.title.isVertical ? "left" : "center",
        textStyle: {
            color: "#fff",
            fontSize: titleFontSize,
        },
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    grid: {
        left: props.grid?.left || props.title.isVertical ? "15%" : "8%",
        right: "20px"
    },
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: props.datas.map(v => v.name),
        axisLine: {
            lineStyle: {
                color: '#fff'
            }
        },
        axisLabel: {
            margin: 10,
            fontSize: xAxisLabelFontSize,
            interval: 0, rotate: 30,
        }
    },
    yAxis: {
        type: 'value',
        name: props.unit,
        axisLine: {
            lineStyle: {
                color: '#fff',
            }
        },
        axisLabel: {
            margin: 15,
            fontSize: yAxisLabelFontSize
        },
        splitLine: {
            // show: false
            lineStyle: {
                color: ['#fff'],
                opacity: 0.1
            }
        }
    },
    series: {
        name: props.title.text,
        type: "bar",
        data: props.datas.map(v => v.value),
        barWidth: props.barWidth,
        color: props.color,
        label: {
            show: true,
            position: "top",
            color: "#fff",
            fontSize: 12,
            formatter: (params: any) => {
                return params.value
            }
        }
    }
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
        xAxis: {
            data: newVal.map(v => v.name)
        },
        series: {
            data: newVal.map(v => v.value)
        }
    });
})

</script>

<style lang="less" scoped></style>