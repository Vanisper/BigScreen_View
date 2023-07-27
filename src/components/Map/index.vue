<template>
    <div style="height:100%;display: flex;flex-direction: column;">
        <n-switch v-model:value="active" />
        <div class="mymap" style="overflow: hidden;flex-grow: 1;" ref="chartDom"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {
    VisualMapComponent,
    VisualMapComponentOption,
    GeoComponent,
    GeoComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption,
    TitleComponent,
    TitleComponentOption
} from 'echarts/components';
import { MapChart, MapSeriesOption, PieChart, PieSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { IGeoJSON } from '../../types';
import { v4 as uuidv4 } from "uuid";
import { floorTo } from '../../utils/Math';
import { PieceType } from './types';

import { NSwitch } from "naive-ui";

const active = ref(false);
watch(active, (value) => {
    myChart.setOption(options.value![value ? 1 : 0], true)
})
const props = defineProps({
    MapGeojson: {
        type: Object as () => IGeoJSON
    },
    Value: {
        type: Object as () => {
            name: string,
            value: number,
            [key: string]: any
        }[]
    },
    Title: String,
    SubTitle: String,
    Pieces: Object as () => PieceType[]
})

// gte lte gt lt
const scaleRules = [
    {
        name: "散户",
        value: [{
            gte: 1,
            lt: 50
        }]
    },
    {
        name: "中户",
        value: [{
            gte: 50,
            lt: 200
        }]
    },
    {
        name: "大户",
        value: [{
            gte: 200,
            lt: 500
        }]
    },
    {
        name: "规模企业",
        value: [{
            gte: 500
        }]
    },
]

echarts.use([
    VisualMapComponent,
    GeoComponent,
    TooltipComponent,
    LegendComponent,
    MapChart,
    CanvasRenderer,
    UniversalTransition,
    PieChart,
    TitleComponent
]);

type EChartsOption = echarts.ComposeOption<
    VisualMapComponentOption | GeoComponentOption | TooltipComponentOption | LegendComponentOption | MapSeriesOption | PieSeriesOption | TitleComponentOption
>;
const options = ref<EChartsOption[]>();
let chartObserver: ResizeObserver;
const chartDom = ref<HTMLElement>();
let myChart: echarts.ECharts
// uuid: 通用唯一识别码
const uuid = uuidv4();

function randomPieSeries(
    center: string | number[],
    radius: number,
    rules?: any[],
    data?: any,
): PieSeriesOption {
    const rulesRes = (rules!.map(v => {
        return {
            name: v.name as string,
            value: data.properties.value.datas.filter((item: any) => (v.value as { [s: string]: number; }[]).map((vv) => {
                const curr = item.pond_area == '\\N' ? 0 : (item.pond_area as number)
                const keys = Object.keys(vv) as ("gte" | "gt" | "lte" | "lt")[];
                const values = Object.values(vv) as number[];
                let result = false;
                if (keys.length == 1) {
                    switch (keys[0]) {
                        case "gt":
                            result = curr > values[0];
                            break
                        case "gte":
                            result = curr >= values[0];
                            break
                        case "lt":
                            result = curr < values[0];
                            break
                        case "lte":
                            result = curr <= values[0];
                            break
                    }
                } else {
                    if (keys[0] == "gt" && keys[1] == "lt") {
                        result = ((curr > values[0]) && ((curr < values[1])));
                    } else if (keys[0] == "gt" && keys[1] == "lte") {
                        result = ((curr > values[0]) && ((curr <= values[1])));
                    } else if (keys[0] == "gte" && keys[1] == "lt") {
                        result = ((curr >= values[0]) && ((curr < values[1])));
                    } else if (keys[0] == "gte" && keys[1] == "lte") {
                        result = ((curr >= values[0]) && ((curr <= values[1])));
                    }
                }
                return result
            }).some(bool => bool)) as any[]
        }
    }));

    const data1 = rulesRes.map((t) => {
        return {
            value: t.value.length,
            name: t.name
        };
    });

    return {
        type: 'pie',
        coordinateSystem: 'geo',
        tooltip: {
            formatter: '{b}: {c} ({d}%)'
        },
        label: {
            show: true,
            fontSize: 12
        },
        labelLine: {
            show: true
        },
        animationDuration: 0,
        radius,
        center,
        data: data1
    };
}
watch(() => props.Value, (_value) => {
    reset()
})

onMounted(() => {
    myChart = echarts.init(chartDom.value!);
    myChart.showLoading();
    myChart.resize();

    if (props.MapGeojson && props.Value) {
        reset()
    }

    chartObserver = new ResizeObserver(() => {
        myChart.resize();
    });
    chartObserver.observe(chartDom.value!);
})
// 关闭监听事件
onUnmounted(() => {
    chartObserver.disconnect()
})

function reset() {
    echarts.registerMap(uuid, props.MapGeojson!);
    const mapOption: EChartsOption = {
        title: {
            text: props.Title || '标题',
            subtext: props.SubTitle || 'Title',
            sublink: 'https://www.baidu.com/',
            left: 'center',
            textStyle: {
                fontSize: 24,
                color: '#fff'
            },
            subtextStyle: {
                color: '#fff'
            },
        },
        tooltip: {
            // formatter: function (params: any) {
            //     console.log(params);
                
            //     return params.data ? (
            //         params.data.name +
            //         '<br />养殖户数量: ' +
            //         params.data.value
            //     ) : params.name + " <b>-<b/> ";
            // }
        },
        visualMap: {
            type: 'piecewise', // piecewise为分段模式,不设置为来连续模式
            // splitNumber: 5, // 对于连续型数据，自动平均切分成几段。默认为5段
            top: 'top',
            left: "right",
            hoverLink: true, // 悬浮至图例触发响应
            showLabel: true, //是否显示每项的文本标签。默认情况是，如果text 被使用则不显示文本标签，否则显示。
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027']
            },
            text: ['高', '低'],
            textStyle: {
                fontSize: 18,
                color: '#fff'
            },
            calculable: true,
            // https://echarts.apache.org/zh/option.html#visualMap-piecewise.pieces
            pieces: [
                { gt: floorTo(Math.max(...props.Value!.map(v => v.value)), 1) }, // 不指定 max，表示 max 为无限大（Infinity）。
                { gt: 20, lte: 30 },
                { gt: Math.min(...props.Value!.map(v => v.value)), lte: 10 },
                { lte: Math.min(...props.Value!.map(v => v.value)), color: 'grey' },    // 不指定 min，表示 min 为无限大（-Infinity）。
            ]
        },
        series: [
            {
                id: 'Value',
                type: 'map',
                roam: true,
                map: uuid,
                itemStyle: { // 每个区域的样式
                    // areaColor: '#EDEDED',
                    color: '#fff',
                    borderColor: '#dd3c18', // 图形的描边颜色
                    borderWidth: 1, //描边线宽
                },
                emphasis: { // 高亮状态
                    label: {
                        show: true, // 去除鼠标移到地图上，地图上显示国家名的效果
                        color: '#fff',
                        fontSize: "24px"
                    },
                    // areaColor: '#7d7d7d'
                },
                label: {
                    show: true,
                    color: '#fff',
                    fontSize: "18px"
                    // 标签的文字。
                    // formatter: 'This is a normal label.'
                },
                //重点下面，与点击事件不同，虽然也是点击选中，但是事件不一样
                selectedMode: "single", //选择模式，单选，只能选中一个地市
                select: {//这个就是鼠标点击后，地图想要展示的配置
                    disabled: false,//可以被选中
                    itemStyle: {//相关配置项很多，可以参考echarts官网
                        areaColor: "#d0b208",//选中
                    },
                    label: {
                        color: "#fff"
                    }
                },
                animationDurationUpdate: 1000,
                universalTransition: true,
                data: props.Value
            },
        ]
    };

    const usefulTown = props.Value!.filter(v => v.value > 0);
    const usefulTownNames = props.Value!.filter(v => v.value > 0).map(v => v.name);
    const usefulGeojson = props.MapGeojson!.features.filter(v => usefulTownNames.includes(v.properties.name));
    const newUsefulGeojson = usefulGeojson.map((v) => {
        v.properties = (Object.assign({}, v.properties, { value: usefulTown.find(item => item.name == v.properties.name) }));
        return {
            ...v
        }
    });

    const mapOption1: EChartsOption = {
        geo: {
            map: uuid,
            roam: true,
            label: {
                show: false,
                color: 'red',
                fontSize: "20px",

            },
            tooltip: {
                formatter: (params: any) => {
                    /**
                        {
                            name: string,
                            data: {
                                name: string, value: number, datas: any[]
                            }
                        }
                     */
                    return params.data ? (
                        `<div style="font-size: 18px;">${params.data.name +
                        '<br />养殖户数量: ' +
                        params.data.value}</div>`
                    ) : params.name + " <b>-<b/> "
                }
            },
        },
        tooltip: {},
        legend: {
            textStyle: {
                color: '#fff'
                // ...
            }
        },
        series: [
            {
                type: 'map',
                geoIndex: 0,
                map: uuid,
                data: props.Value,
            },
            ...newUsefulGeojson.map(v => randomPieSeries(v.properties.center, 30, scaleRules, v)),
        ]
    };
    options.value = [mapOption, mapOption1]
    myChart.hideLoading();
    myChart.setOption(options.value[0]);
}
</script>

<style lang="less"></style>
