<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {
    ToolboxComponent,
    ToolboxComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    GridComponent,
    GridComponentOption,
    LegendComponent,
    LegendComponentOption,
    TitleComponent,
    TitleComponentOption,
} from 'echarts/components';
import {
    BarChart,
    BarSeriesOption,
    LineChart,
    LineSeriesOption,
} from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { YAXisOption } from 'echarts/types/dist/shared';
import { titleFontSize } from '../../assets/style';
import { colorToRGBA, convertColorsToHash, generateColors, rgbaColorToHash } from '../../utils/Color';

const props = defineProps({
    datas: {
        type: Object as () => {
            titles: string[],
            bar?: {
                label: string,
                name: string,
                values: number[],
            }[],
            line?: {
                label: string,
                name: string,
                values: number[],
            }[],
        },
        required: true
    },
    title: {
        type: String,
    }
})

echarts.use([
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
    TitleComponent
]);

type EChartsOption = echarts.ComposeOption<
    | ToolboxComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | BarSeriesOption
    | LineSeriesOption
    | TitleComponentOption
>;

let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
let myChart: echarts.ECharts;

const colors = computed(() => {
    const color = generateColors(((props.datas.bar ? props.datas.bar.length : 0) + (props.datas.line ? props.datas.line.length : 0)) ?? 0).map((color) => rgbaColorToHash(color));
    return [
        convertColorsToHash(color.slice(0, props.datas.bar?.length ?? 0), 0.9),
        convertColorsToHash(color.slice(props.datas.bar?.length ?? 0, (props.datas.bar?.length ?? 0) + (props.datas.line?.length ?? 0)), 0.5)
    ]
});

const option: EChartsOption = {
    color: colors.value.flat(),
    title: {
        text: props.title?.split("").join("\n"),
        textStyle: {
            color: '#fff',
            fontSize: titleFontSize,
        },
        left: 'left',
        top: 'center'
    },
    grid: {
        right: '20%',
        left: '12%',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    toolbox: {
        feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true, backgroundColor: "#11151b", pixelRatio: 2 }
        }
    },
    legend: {
        data: [...(props.datas.bar?.map((data) => data.name) ?? []), ...(props.datas.line?.map((data) => data.name) ?? [])],
        textStyle: {
            color: '#fff'
        }
    },
    xAxis: [
        {
            type: 'category',
            data: props.datas.titles,
            axisPointer: {
                type: 'shadow'
            }
        }
    ],
    yAxis: [
        ...(props.datas.bar ?? []).map((data, index): YAXisOption => {
            return {
                type: 'value',
                name: data.label,
                position: 'right',
                offset: 40 * index,
                alignTicks: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors.value[0][index]
                    }
                },
            }
        }),
        ...(props.datas.line ?? []).map((data, index): YAXisOption => {
            return {
                type: 'value',
                name: data.label,
                position: 'left',
                alignTicks: true,
                offset: 40 * index,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: colors.value[1][index]
                    }
                },
            }
        })
    ],
    series: [
        ...(props.datas.bar ?? []).map((data, index): BarSeriesOption => {
            return {
                name: data.name,
                type: "bar",
                data: data.values,
                yAxisIndex: index,
            }
        }),
        ...(props.datas.line ?? []).map((data, index): LineSeriesOption => {
            return {
                name: data.name,
                type: "line",
                data: data.values,
                yAxisIndex: index,
            }
        })
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
    chartObserver.disconnect();
})

watch(() => props.datas, (newVal) => {
    myChart.setOption({
        legend: {
            data: [...(newVal.bar?.map((data) => data.name) ?? []), ...(newVal.line?.map((data) => data.name) ?? [])],
        },
        xAxis: [
            {
                type: 'category',
                data: newVal.titles,
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            ...(newVal.bar ?? []).map((data, index): YAXisOption => {
                return {
                    type: 'value',
                    name: data.label,
                    position: 'right',
                    offset: 80 * index,
                    alignTicks: true,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors.value[0][index]
                        }
                    },
                }
            }),
            ...(newVal.line ?? []).map((data, index): YAXisOption => {
                return {
                    type: 'value',
                    name: data.label,
                    position: 'left',
                    alignTicks: true,
                    offset: 80 * index,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors.value[1][index]
                        }
                    },
                }
            })
        ],
        series: [
            ...(newVal.bar ?? []).map((data, index): BarSeriesOption => {
                return {
                    name: data.name,
                    type: "bar",
                    data: data.values,
                    yAxisIndex: index,
                }
            }),
            ...(newVal.line ?? []).map((data, index): LineSeriesOption => {
                return {
                    name: data.name,
                    type: "line",
                    data: data.values,
                    yAxisIndex: index,
                }
            })
        ]
    })
})

</script>

<style lang="less" scoped></style>