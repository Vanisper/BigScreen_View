<template>
    <recordNumberTab v-if="datas" style="margin: 10px 0;" :datas="datas['头部数据']" />
    <div v-if="datas" class="content">
        <div class="contentLeft">
            <e-pie v-fullscreen.dblclick style="height: 100%;width: 100%;" :datas="datas['养殖品种']" :title="{
                text: '养殖品种',
                // left: '10%',
            }" :radius="['30%', '70%']" unit="亩" labelPosition="outer"></e-pie>
        </div>
        <div class="contentCenter">
            <div class="container">
                <e-bar v-fullscreen style="height: 100%;width: 100%;" :datas="datas['养殖基地']" unit="单位：-"
                    :title="{
                        text: '养殖基地',
                        isVertical: false,
                    }" 
                    
                    :grid="{
                        left: '15%',
                    }"
                    color="#04b49c" bar-width="50%"></e-bar>
            </div>
        </div>
        <div class="contentRight" style="justify-content: space-between;display: flex;flex-direction: column;">
            <e-pie v-fullscreen.dblclick style="height: 100%;width: 100%;" :datas="datas['养殖类型']" :title="{
                text: '养殖类型',
                // left: '10%',
            }" :radius="['30%', '70%']" unit="亩" labelPosition="outer"></e-pie>
        </div>
    </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { getRealUrl } from '../../api/config';
import recordNumberTab from "../../components/All/includes/contentCenter/recordNumberTab";
import EPie from "../../components/temp/EPie.vue";
import EBar from "../../components/temp/EBar.vue";
import vFullscreen from "../../hooks/fullScreenHook";

const datas = ref()
onMounted(() => {
    axios.get(getRealUrl("扬州宝应县数据")!).then((res) => {
        datas.value = res.data.data.data
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
    }
    .container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: relative;
        height: 100%;
    }

    .contentCenter {
        width: 42%;
    }

    .contentRight {
        width: 28%;
    }
}
</style>