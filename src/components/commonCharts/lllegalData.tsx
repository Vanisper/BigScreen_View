/*
 * @Description: 违章数据雷达图
 * @Author: Vergil
 * @Date: 2021-09-09 22:47:23
 * @LastEditTime: 2021-09-12 01:03:47
 * @LastEditors: Vergil
 */
import { PropType, defineComponent, reactive } from "vue";
import { ILllegalDataData, ILllegalDataTitle } from "./lllegalData.d";

export const LllegalData = defineComponent({
  name: "LllegalData",
  props: {
    title: {
      type: Object as PropType<ILllegalDataTitle>,
      required: true,
    },
    datas: {
      type: Array as PropType<ILllegalDataData[]>,
      required: true,
    },
  },
  setup(props) {
    const className = "radarCharts";
    const width = "100%";
    const height = "100%";
    const datavaule = props.datas.map((v) => v.value);
    const indicator = reactive(props.datas);
    const option = {
      title: {
        text: props.title.isVertical
          ? props.title.text.split("").join("\n")
          : props.title.text,
        top: props.title.top || "30%",
        left: props.title.left || "1%",
        textStyle: {
          color: props.title.textStyle?.color || "#fff",
          fontSize: props.title.textStyle?.fontSize || "18",
        },
      },
      radar: {
        // shape: 'circle',
        indicator: indicator,
        axisName: {
          color: props.title.textStyle?.color || "#fff",
          fontSize: props.title.textStyle?.fontSize || "18",
          borderRadius: 3,
          padding: [3, 5],
          formatter: (value: string) => {
            return "「" + value + "」";
          },
        },
        splitLine: {
          lineStyle: {
            width: 1,
            color: [
              "rgba(0,206,209, 0.1)",
              "rgba(0,206,209, 0.2)",
              "rgba(0,206,209, 0.3)",
              "rgba(0,206,209, 0.4)",
              "rgba(0,206,209, 0.5)",
              "rgba(0,206,209, 0.6)",
            ].reverse(),
          },
        },
        splitArea: {
          areaStyle: {
            color: [
              "rgba(0,255,255, 0.1)",
              "rgba(0,255,255, 0.2)",
              "rgba(0,255,255, 0.3)",
              "rgba(0,255,255, 0.4)",
              "rgba(0,255,255, 0.5)",
              "rgba(0,255,255, 0.6)",
            ].reverse(),
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowBlur: 30,
            shadowOffsetX: 10,
            shadowOffsetY: 10,
          },
        },
        axisLine: {
          //指向外圈文本的分隔线样式
          lineStyle: {
            color: "rgba(0,0,0,0)",
          },
        },
      },
      series: [
        {
          type: "radar",
          areaStyle: {
            color: "rgba(255,237,145, 0.5)",
          },
          itemStyle: {
            color: "rgba(255,237,145,0.8)",
            borderColor: "rgba(255,237,145,0.2)",
            borderWidth: 10,
          },
          lineStyle: {
            color: "rgba(255,237,145, 0.6)",
            width: 2,
          },
          label: {
            show: true,
          },
          data: [
            {
              value: datavaule,
            },
          ],
        },
      ],
    };
    return () => (
      <div>
        <echarts
          className={className}
          width={width}
          height={height}
          options={option}
        ></echarts>
      </div>
    );
  },
});

export default LllegalData;
