import { ref, Ref, computed } from 'vue'
interface PicType {
  appRef: Ref<HTMLElement | undefined>
  calcRate: () => void
  windowDraw: () => void
  setScaleMode: (value: ScaleModeType) => void
  style: {
    baseWidth: Ref<number>
    baseHeight: Ref<number>
  },
  isIFrame: Boolean
}

export type ScaleModeType = "0" | "1" // 缩放模式：0是拉伸 1是等比

export default function useIndex(ScaleMode: ScaleModeType): PicType {
  // * 指向最外层容器
  const appRef = ref<HTMLElement>()
  // * 定时函数
  const timer = ref<NodeJS.Timeout>(0 as unknown as NodeJS.Timeout)
  // * 默认缩放值
  const scale = {
    width: '1920',
    height: '1080'
  }
  // * 额外需要空余的空间 仅在 window.self === window.top 为false的情况下生效
  const isIFrame = !(window.self === window.top);
  const extra = {
    top: 84,
    left: 0,
    right: 0,
    bottom: 0,
  }
  // * 设计稿尺寸（px）
  const baseWidth = computed(()=> +scale.width - (!isIFrame ? 0 : extra.left - extra.right))
  const baseHeight = computed(()=> +scale.height - (!isIFrame ? 0 : extra.top - extra.bottom))
  // * 需保持的比例（默认1.77778）
  const baseProportion = computed(() => parseFloat((baseWidth.value / baseHeight.value ).toFixed(5)))
  const scaleMode = ref<ScaleModeType>(ScaleMode); // 缩放模式：0是拉伸 1是等比

  const calcRate = () => {
    if (appRef.value && appRef.value.parentElement) {
      const pDom = appRef.value.parentElement
      pDom.style.overflow = "hidden"
      pDom.style.backgroundColor = "#11151b"
      const pDomStyle = getComputedStyle(pDom)
      const pDomHeight = +pDomStyle.height.split("px")[0]
      const pDomWidth = +pDomStyle.width.split("px")[0]
      console.group("当前缩放模式", scaleMode.value == "0" ? "拉伸" : "等比")
      console.log("isIFrame", isIFrame);
      console.log("设计稿尺寸（px）", scale, baseProportion.value)
            
      console.log("当前宽高", pDomWidth, pDomHeight)
      // 当前宽高比
      const currentRate = parseFloat((pDomWidth / pDomHeight).toFixed(5))
      console.log("当前宽高比", currentRate)
      
      if (currentRate > baseProportion.value) {
        // 表示更宽
        let width = "";
        if (scaleMode.value == "0" && !isIFrame) {
          width = (pDomWidth / baseWidth.value ).toFixed(5)
        } else {
          width = ((pDomHeight * baseProportion.value) / baseWidth.value ).toFixed(5)
        }
        let height = (pDomHeight / baseHeight.value ).toFixed(5)
        appRef.value.style.transform = `scale(${width}, ${height}) translate(calc(-50% - ${isIFrame ? extra.left / 2 : 0}px), calc(-50% - ${isIFrame ? extra.top / 2 : 0}px))`
        console.log("更宽", scale)        
      } else {
        // 表示更高
        let height = "";
        if (scaleMode.value == "0" && !isIFrame) {
          height = (pDomHeight / baseHeight.value).toFixed(5)
        } else {
          height = (pDomWidth / baseProportion.value / baseHeight.value).toFixed(5)
        }
        let width = (pDomWidth / baseWidth.value).toFixed(5)
        appRef.value.style.transform = `scale(${width}, ${height}) translate(calc(-50% - ${isIFrame ? extra.left / 2 : 0}px), calc(-50% - ${isIFrame ? extra.top / 2 : 0}px))`
        console.log("更高", scale)
      }
      console.groupEnd();
      
    }
  }

  const resize = () => {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      calcRate()
    }, 200)
  }

  // 改变窗口大小重新绘制
  const windowDraw = () => {
    window.addEventListener('resize', resize)
  }

  // 修改缩放模式
  const setScaleMode = (value: ScaleModeType) => {
    if (scaleMode.value == value) return
    scaleMode.value = value;
    console.log("切换缩放模式", scaleMode.value == "0" ? "拉伸" : "等比")
    resize();
  }

  return {
    appRef,
    calcRate,
    windowDraw,
    setScaleMode,
    style: {
      baseHeight,
      baseWidth,
    },
    isIFrame,
  }
}
