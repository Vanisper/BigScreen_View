import { ref, Ref } from 'vue'
interface PicType {
  appRef: Ref<HTMLElement | undefined>
  calcRate: () => void
  windowDraw: () => void
  setScaleMode: (value: ScaleModeType) => void
}

export type ScaleModeType = "0" | "1" // 缩放模式：0是拉伸 1是等比

export default function useIndex(): PicType {
  // * 指向最外层容器
  const appRef = ref<HTMLElement>()
  // * 定时函数
  const timer = ref<NodeJS.Timeout>(0 as unknown as NodeJS.Timeout)
  // * 默认缩放值
  const scale = {
    width: '1920',
    height: '1080'
  }
  // * 设计稿尺寸（px）
  const baseWidth = +scale.width
  const baseHeight = +scale.height
  // * 需保持的比例（默认1.77778）
  const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
  const scaleMode = ref<ScaleModeType>("0"); // 缩放模式：0是拉伸 1是等比

  const calcRate = () => {
    if (appRef.value && appRef.value.parentElement) {
      const pDom = appRef.value.parentElement
      pDom.style.overflow = "hidden"
      pDom.style.backgroundColor = "#11151b"
      const pDomStyle = getComputedStyle(pDom)
      const pDomHeight = +pDomStyle.height.split("px")[0]
      const pDomWidth = +pDomStyle.width.split("px")[0]
      console.group("当前缩放模式", scaleMode.value == "0" ? "拉伸" : "等比")
      console.log("设计稿尺寸（px）", scale, baseProportion)
            
      console.log("当前宽高", pDomWidth, pDomHeight)
      // 当前宽高比
      const currentRate = parseFloat((pDomWidth / pDomHeight).toFixed(5))
      console.log("当前宽高比", currentRate)
      
      if (currentRate > baseProportion) {
        // 表示更宽
        if (scaleMode.value == "0") {
          scale.width = (pDomWidth / baseWidth).toFixed(5)
        } else {
          scale.width = ((pDomHeight * baseProportion) / baseWidth).toFixed(5)
        }
        scale.height = (pDomHeight / baseHeight).toFixed(5)
        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        console.log("更宽", scale)        
      } else {
        // 表示更高
        if (scaleMode.value == "0") {
          scale.height = (pDomHeight / baseHeight).toFixed(5)
        } else {
          scale.height = (pDomWidth / baseProportion / baseHeight).toFixed(5)
        }
        scale.width = (pDomWidth / baseWidth).toFixed(5)
        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
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
  }
}
