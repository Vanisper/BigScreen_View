<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import * as echarts from "echarts/core";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { LegendComponent, TitleComponent, TooltipComponent } from "echarts/components";
import { floorTo } from "../../utils/Math";

const props = defineProps({
    datas: {
        type: Array as () => ({
            name: string,
            value: number,
            [key: string]: any
        }[]),
        required: true
    }
})

echarts.use([
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent
])
type EChartsOption = echarts.ComposeOption<
    PieSeriesOption
>;

let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
const myChart = ref<echarts.ECharts>()

const option: EChartsOption = ({
    title: {
        text: '套养情况',
        subtext: '各类投苗数量、比例',
        left: 'left',
        top: "center",
        textStyle: {
            color: '#fff'
            // ...
        },
        subtextStyle: {
            color: '#fff'
        },
    },
    tooltip: {
        trigger: 'item',
        formatter: (params: {
            percent: number,
            data: {
                name: string,
                value: number,
                expected_survival: number
            }
        }) => {
            return `<img style="height: 150px;z-index: 999;width: 100%;" src="./images/intensive/${params.data.name}.png"></img><div style="color: #000;font-size: 18px;"><b>${params.data.name}</b>：投放${params.data.value}只（${params.percent}%）<br/>预计存活${floorTo(params.data.expected_survival, 0)}（存活率${floorTo(params.data.expected_survival, 0) / params.data.value * 100}%）</div>`
        }
    },
    legend: {
        // orient: 'vertical',
        left: 'center',
        top: "top",
        textStyle: {
            color: '#fff'
            // ...
        }
    },
    series: [
        {
            name: '套养模式',
            type: 'pie',
            radius: '50%',
            data: props.datas,
            label: {
                show: true,
                color: "#fff"
            },
            // top: "center",
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
})

onMounted(() => {
    myChart.value = echarts.init(chartDom.value!)
    myChart.value.showLoading();
    myChart.value.resize();

    myChart.value.hideLoading();
    myChart.value.setOption(option);

    chartObserver = new ResizeObserver(() => {
        myChart.value?.resize();
    });
    chartObserver.observe(chartDom.value!);
})

onUnmounted(() => {
    chartObserver.disconnect()
})
</script>