<template>
    <div ref="chartDom"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import * as echarts from "echarts/core";
import { generateColors } from '../../utils/Color';
import { arrayUnion, cellTo } from '../../utils/Math';

const props = defineProps({
    datas: {
        type: Array as () => {
            name: string,
            value: number,
            [key: string]: any
        }[],
        required: true
    },
    title: {
        type: String,
    }
})

let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
var myChart: echarts.ECharts

const colors = generateColors(arrayUnion(props.datas.map(v => v.streets)).length)

const option = {
    title: {
        text: props.title?.split("").join("\n") || "",
        top: "center",
        left: "0px",
        textStyle: {
            color: "#fff"
        }
    },
    grid: {
        left: '5%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            lineStyle: {
                color: '#fff'
            }
        }
    },
    legend: {
        icon: 'rect',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 20,
        left: '10%',
        data: arrayUnion(props.datas.map(v => v.streets)),
        textStyle: {
            fontSize: 17,
            color: '#F1F1F3'
        }
    },
    xAxis: [
        {
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
                fontSize: 14
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            // max: cellTo(Math.max(...(props.datas.map(v => v.streetDataSet.map((v: any) => v.pondArea))).flat()), 0),
            axisLine: {
                lineStyle: {
                    color: '#fff',
                }
            },
            axisLabel: {
                margin: 5,
                fontSize: 10
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#fff'
                }
            }
        }
    ],
    series: [
        // ...(arrayUnion(props.datas.map(v => v.streets)).map((value, index) => {
        //     const data = props.datas.map(v => v.streetDataSet.filter((v: any) => v.street == value)).flat().map((v: any) => v.seedlings_planted_numberPreAcre);
        //     return ({
        //         name: value,
        //         type: 'line',
        //         smooth: true,
        //         data: data as number[],
        //         areaStyle: {
        //             color: {
        //                 type: 'linear',
        //                 x: 0,
        //                 y: 0,
        //                 x2: 0,
        //                 y2: 1,
        //                 colorStops: [
        //                     {
        //                         offset: 0,
        //                         color: `rgba(${colors[index].split("rgb(")[1].split(")")[0]},1)` // 0% 处的颜色
        //                     },
        //                     {
        //                         offset: 1,
        //                         color: `rgba(${colors[index].split("rgb(")[1].split(")")[0]},.1)` // 100% 处的颜色
        //                     }
        //                 ],
        //                 global: false // 缺省为 false
        //             }
        //         },
        //         itemStyle: {
        //             color: colors[index]
        //         },
        //     })
        // })),
        {
            name: "种苗养殖面积",
            type: 'bar',
            data: props.datas.map(v => (v.streetDataSet.map((v: any) => (v.pondArea)) as number[]).reduce((a, b) => a + b)),
            barWidth: "20%",
        },
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

