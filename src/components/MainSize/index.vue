<template>
    <lllegal-data v-if="datas" :datas="datas" :title="title"></lllegal-data>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { LllegalData, } from "../commonCharts/lllegalData";
import { ILllegalDataData, ILllegalDataTitle, } from "../commonCharts/lllegalData.d";

const props = defineProps({
    FarmerData: {
        type: Array as () => any[],
        required: true
    }
})

const farmerData = ref<any[]>([])
const main_large_scale = ref<Record<string, { number: number, datas: any[] }>>({
    "4": {
        number: 0,
        datas: []
    }, "4.5": {
        number: 0,
        datas: []
    }, "5": {
        number: 0,
        datas: []
    }, "5.5": {
        number: 0,
        datas: []
    },
})

const main_little_scale = ref<Record<string, { number: number, datas: any[] }>>({
    "3.5": {
        number: 0,
        datas: []
    }, "3": {
        number: 0,
        datas: []
    }, "2.5": {
        number: 0,
        datas: []
    }, "2": {
        number: 0,
        datas: []
    },
})
const datas = ref<ILllegalDataData[]>([])
const title = ref<ILllegalDataTitle>({
    text: "大/小规格养殖养殖情况",
    isVertical: true,
    textStyle: {
        color: "#fff"
    },
    top: "center"
})

watch(() => props.FarmerData, (value) => {
    farmerData.value = value
    if (farmerData.value) {
        const main_scale_infos = farmerData.value.map((farmerDataValue) => {
            const breeding_mode: any[] = farmerDataValue.breeding_mode;
            const main_scale_curr = breeding_mode.map((v: any) => v.main_large_scale).flat()

            return {
                // 大规格
                "4": main_scale_curr.includes(4),
                "4.5": main_scale_curr.includes(4.5),
                "5": main_scale_curr.includes(5),
                "5.5": main_scale_curr.includes(5.5),
                // 小规格
                "3.5": main_scale_curr.includes(3.5),
                "3": main_scale_curr.includes(3),
                "2.5": main_scale_curr.includes(2.5),
                "2": main_scale_curr.includes(2)
            }
        });
        Object.keys(main_large_scale.value).forEach((value: string) => {
            main_large_scale.value[value].number = main_scale_infos.map(v => v[value as ("4" | "4.5" | "5" | "5.5")]).length
            datas.value.push({
                name: value + "两",
                max: farmerData.value.length,
                value: main_large_scale.value[value].number
            })
        })
        Object.keys(main_little_scale.value).forEach((value: string) => {
            main_little_scale.value[value].number = main_scale_infos.map(v => v[value as ("3.5" | "3" | "2.5" | "2")]).length
            datas.value.push({
                name: value + "两",
                max: farmerData.value.length,
                value: main_little_scale.value[value].number
            })
        })
    }
}, {
    deep: true,
    immediate: true
})


</script>

<style lang="less" scoped></style>