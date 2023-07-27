import classes from "./contentCenter.module.less";
import "./realTimeDataCard.less";
import { defineComponent, h, onMounted, ref, watch } from "vue";
import RealTimeDataCard from "./realTimeDataCard";
import RingChart from "./commonCharts/ringChart";

import EPie from "../../../temp/EPie.vue";
import ShuiCao from "../../../temp/ShuiCao.vue";
import FullscreenDirective from "../../../../hooks/fullScreenHook";
import axios from "../../../../api/request";
import { getRealUrl } from "../../../../api/config";

const contentCenter = defineComponent({
  name: "ContentCenter",
  directives: {
    fullscreen: FullscreenDirective,
  },
  setup() {
    const 投苗量 = ref<
      {
        name: string;
        value: number;
      }[]
    >([]);
    const 预期产量 = ref<Record<string, number | string>[]>([]);
    onMounted(() => {
      axios.get(getRealUrl("投苗量")!).then((res) => {
        投苗量.value = res.data.data.data;
      });
      axios.get(getRealUrl("预期产量")!).then((res) => {
        预期产量.value = res.data.data.data;
      });
    });
    return () => (
      <div class={classes.container}>
        <EPie
          v-fullscreen={[null, ["dblclick"]]}
          class="borderOne"
          style="height: 78%;width: 100%;"
          datas={投苗量.value}
          title={{
            text: "养殖模式",
            left: "center",
          }}
          radius={["35%", "80%"]}
          unit="亩"
        ></EPie>
        {/* <RealTimeDataCard
          v-fullscreen={[null, ["dblclick"]]}
          datas={预期产量.value.filter((v) => v["street"] !== "")}
          onlyFull={true}
        ></RealTimeDataCard> */}
        <ShuiCao />
      </div>
    );
  },
});

export default contentCenter;
