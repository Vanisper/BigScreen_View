import { ref, Ref } from 'vue'
interface PicType {
  appRef: Ref<HTMLElement | undefined>
  calcRate: () => void
  windowDraw: () => void
}
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
  const baseWidth = 1920
  const baseHeight = 1080
  // * 需保持的比例（默认1.77778）
  const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
  const calcRate = () => {
    if (appRef.value && appRef.value.parentElement) {
      const pDom = appRef.value.parentElement
      pDom.style.overflow = "hidden"
      pDom.style.backgroundColor = "#11151b"
      const pDomStyle = getComputedStyle(pDom)
      const pDomHeight = +pDomStyle.height.split("px")[0]
      const pDomWidth = +pDomStyle.width.split("px")[0]
      // 当前宽高比
      const currentRate = parseFloat((pDomWidth / pDomHeight).toFixed(5))
      if (currentRate > baseProportion) {
        // 表示更宽
        scale.width = ((pDomHeight * baseProportion) / baseWidth).toFixed(5)
        scale.height = (pDomHeight / baseHeight).toFixed(5)
        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      } else {
        // 表示更高
        scale.height = (pDomWidth / baseProportion / baseHeight).toFixed(5)
        scale.width = (pDomWidth / baseWidth).toFixed(5)
        appRef.value.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
      }
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

  return {
    appRef,
    calcRate,
    windowDraw
  }
}
