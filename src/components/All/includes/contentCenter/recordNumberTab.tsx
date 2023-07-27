import { defineComponent, h, ref, watch } from "vue";
import style from "./recordNumberTab.module.less";
import { cellTo, floorTo } from "../../../../utils/Math";
import { generateColors } from "../../../../utils/Color";
import FullscreenDirective from "../../../../hooks/fullScreenHook";
import {
  heaedrDataBiggerFontSize,
  heaedrDataBiggerFontSizeForCN,
  heaedrDataSmallFontSize,
  subTitleFontSize,
} from "../../../../assets/style";

const recordNumberTab = defineComponent({
  name: "RecordNumberTab",
  props: {
    datas: {
      type: Object as () => {
        [key: string]: {
          datas: {
            name: string;
            value: string;
            color?: string;
          }[];
          color?: string;
        };
      },
      required: true,
    },
    autoColor: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
  },
  directives: {
    fullscreen: FullscreenDirective,
  },

  setup(props) {
    const colors = generateColors(Object.keys(props.datas).length);
    return () => (
      <div class={style.recordNumberTab}>
        <h3 class={[style.title, "lineOne"]}>{props.title}</h3>
        <div
          style={{
            width: "100%",
            display: "flex",
            fontSize: subTitleFontSize,
          }}
        >
          {Object.values(props.datas).map((group, index) => (
            <ul
              v-fullscreen
              class={style.recordNumber}
              key={index}
              style={{
                backgroundColor: "rgba(37, 64, 106, 0.4)",
              }}
            >
              {group.datas.map((data, idx) => (
                <li key={data.name}>
                  <h3
                    style={{
                      // color: props.autoColor
                      //   ? colors[idx]
                      //   : group.color || data.color,
                      color: "#fff",
                      fontSize: heaedrDataSmallFontSize,
                    }}
                  >
                    {data.name}
                  </h3>
                  <p
                    style={{
                      color: props.autoColor
                        ? colors[idx]
                        : group.color || data.color,
                      fontSize: heaedrDataBiggerFontSize,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {data.value.replace(/[\u4e00-\u9fa5]/g, "")}
                    </span>
                    <span
                      style={{
                        fontSize: heaedrDataBiggerFontSizeForCN,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                     {/* 去除数字 加减 百分号 */}
                      {data.value.replace(/[0-9\+\-\%\.]/g, "")}                      
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    );
  },
});
export default recordNumberTab;
