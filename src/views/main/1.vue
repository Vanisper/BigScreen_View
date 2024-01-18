<template>
    <recordNumberTab style="margin: 10px 0;" :datas="headerData" />
    <div class="content">
        <ContentLeft class="contentLeft" />
        <ContentCenter class="contentCenter" />
        <ContentRight class="contentRight" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from "vue";
import useIndex from "../../components/All/utils/useDraw";

import recordNumberTab from "../../components/All/includes/contentCenter/recordNumberTab";
import 头部数据 from "../../datas/接口数据/头部数据.json";
import ContentCenter from "../../components/All/includes/contentCenter/contentCenter";
import ContentRight from "../../components/All/includes/contentRight/index.vue";
import ContentLeft from "../../components/All/includes/contentLeft/index.vue";
import axios from "../../api/request"
import { getRealUrl } from "../../api/config";

// * 适配处理
const { appRef, calcRate, windowDraw } = useIndex()

const headerData = ref(头部数据)
// 生命周期
onMounted(() => {
    // todo 屏幕适应
    // windowDraw()
    // calcRate()
    axios.get(getRealUrl("头部数据")!).then((res) => {
        headerData.value = res.data.data.data
    })
})
</script>

<style lang="less" scoped>
.content {
    display: flex;
    justify-content: space-between;
    height: 90%;
    padding: 10px;

    .contentLeft {
        width: 28%;

        .container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            position: relative;
            height: 100%;
        }
    }

    .contentCenter {
        width: 42%;
    }

    .contentRight {
        width: 28%;
    }
}
</style>