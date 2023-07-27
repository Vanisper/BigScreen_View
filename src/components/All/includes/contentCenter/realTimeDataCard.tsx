import { subTitleFontSize, titleFontSize } from "../../../../assets/style";
import { cellTo } from "../../../../utils/Math";
import "./realTimeDataCard.less";
import {
  defineComponent,
  ref,
  reactive,
  watch,
  Ref,
  computed,
  onMounted,
} from "vue";

const realTimeDataCard = defineComponent({
  name: "RealTimeDataCard",
  props: {
    datas: {
      type: Array as () => Record<string, number | string>[] | undefined,
      required: true,
    },
    onlyFull: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const currCityIndex = ref<number>(-1);
    const datas = ref(props.datas);
    const data = computed(() =>
      currCityIndex.value == -1
        ? datas.value
        : city.value &&
          datas.value?.filter(
            (v) => v.street == city.value![currCityIndex.value]
          )
    );

    const city = computed(() => datas.value?.map((v) => v["street"] as string));

    const select = (ev: MouseEvent) => {
      const text = (ev.target as HTMLElement).innerText;
      currCityIndex.value =
        city.value?.indexOf(text) !== undefined
          ? city.value?.indexOf(text)
          : -1;
    };

    watch(
      () => props.datas,
      (value) => {
        datas.value = value;
      }
    );

    return () => (
      <div class="realTimeDataCard">
        {!props.onlyFull ? (
          <div class="cardLeft">
            <h3>预期产量</h3>
            <p
              onClick={select}
              style="cursor: pointer;"
              class={[-1 === currCityIndex.value ? "active" : ""]}
            >
              全区数据
            </p>
            <ul>
              {city.value?.map((item, index) => {
                return (
                  <li
                    style="cursor: pointer;"
                    class={[index === currCityIndex.value ? "active" : ""]}
                    onClick={select}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <h3
            style={{
              color: "#fff",
              fontSize: titleFontSize,
              paddingLeft: "30px",
            }}
          >
            预期产量
          </h3>
        )}
        <div
          class="cardRight"
          style={{
            padding: "20px",
            flexGrow: 1,
            maxWidth: "60%",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              color: "rgb(1, 187, 218)",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: subTitleFontSize,
            }}
          >
            <h3>平均亩产量(斤)</h3>
            <span style={{ fontWeight: "bold" }}>
              {data.value &&
                data.value.map((v) => v["production"] as number).length &&
                cellTo(
                  data.value
                    .map((v) => v["production"] as number)
                    ?.reduce((a, b) => a + b) /
                    data.value
                      .map((v) => v["area"] as number)
                      ?.reduce((a, b) => a + b),
                  -2
                )}
            </span>
          </div>
          <div
            style={{
              color: "rgb(227, 238, 110)",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: subTitleFontSize,
            }}
          >
            <h3>每户平均总产量(斤)</h3>
            <span style={{ fontWeight: "bold" }}>
              {data.value &&
                data.value.map((v) => v["production"] as number).length &&
                cellTo(
                  data.value
                    .map((v) => v["every_farmer_production"] as number)
                    ?.reduce((a, b) => a + b) / data.value.length,
                  -2
                )}
            </span>
          </div>
          <div
            style={{
              color: "rgb(204, 72, 47)",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: subTitleFontSize,
            }}
          >
            <h3>总产量(斤)</h3>
            <span style={{ fontWeight: "bold" }}>
              {data.value &&
                data.value.map((v) => v["production"] as number).length &&
                data.value
                  .map((v) => v["production"] as number)
                  ?.reduce((a, b) => a + b)}
            </span>
          </div>
        </div>
      </div>
    );
  },
});
export default realTimeDataCard;
