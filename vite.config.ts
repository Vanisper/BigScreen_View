import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

import { viteMockServe } from 'vite-plugin-mock'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "./",
    define: {
      // 定义全局常量替换方式。其中每项在开发环境下会被定义在全局（window下直接可以使用），而在构建时被静态替换（全局替换指定的变量的值）。
      "VITE_API_BASE": `"${env.VITE_API_BASE}"`,
    },
    plugins: [
      vue(),
      vueJsx(),
      svgLoader(),
      viteMockServe({
        mockPath: 'src/api/mock',
        enable: true,
      })
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        // // 代理所有 /mock/api 的请求，该求情将被代理到 target 中
        // '/mock/api': {
        //   // 代理请求之后的请求地址（你的真实接口地址)
        //   target: 'http://localhost:8080/api/v1/bigscreen',
        //   // 跨域
        //   changeOrigin: true,
        //   // 重写路径
        //   rewrite: (path) => path.replace(/^\/mock\/api/, '')
        // }
      }
    },
  }
})
