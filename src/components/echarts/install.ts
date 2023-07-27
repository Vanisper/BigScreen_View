/*
 * @Description:全局注册组件
 * @Author: Vergil
 * @Date: 2021-09-09 23:40:23
 * @LastEditTime: 2021-09-17 14:37:41
 * @LastEditors: Vergil
 */
import type { DefineComponent } from 'vue' //用于给vue类型
import Echarts from './index'
const coms: any = {
  install(app: DefineComponent) {
    // 此处形参为main.ts文件中use()方法自动传进来的Vue实例
    app.component('Echarts', Echarts)
  }
}
export default coms
