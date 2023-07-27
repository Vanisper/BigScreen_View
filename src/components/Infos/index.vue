<template>
    <div class="container">
        <h1>套养品种</h1>
        <tao-yang :datas="intensiveTypes" style="height: 300px;overflow: unset;"></tao-yang>
        <!-- <h1>套养品种</h1> -->
        <h1>种植水草</h1>
        <shui-cao :max-data="farmerData.length" :datas="waterGrass" style="height: 250px;"></shui-cao>
        <h1>螃蟹</h1>
        <pang-xie :datas="crabTypes" :body-max="farmerData.length" style="height: 250px;"></pang-xie>
        <h1>蟹苗：各区域每亩投苗个数</h1>
        <xie-miao :datas="crabSeedlingsTypes" title="各区域每亩投苗个数" style="height: 250px;"></xie-miao>
        <h1>主力规格</h1>
        <main-size :FarmerData="farmerData" style="height: 300px;"></main-size>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import TaoYang from "./TaoYang.vue";
import ShuiCao from "./ShuiCao.vue";
import PangXie from "./PangXie.vue";
import XieMiao from "./XieMiao.vue";
import MainSize from "../MainSize/index.vue";
import { arrayUnion, cellTo, roundToDecimal, uniqueArray } from '../../utils/Math';
import { ICrabInfos } from './types';

const props = defineProps({
    FarmerData: {
        type: Array as () => any[],
        required: true
    }
})
const farmerData = ref<any[]>([])

// 套养
const intensiveTypeNames = ref<string[]>([])
const intensiveTypes = ref<{
    name: string,
    value: number,
    expected_survival: number
}[]>([])
// 水草
const waterGrass = ref<{
    name: string,
    value: number
}[]>([{
    name: "轮叶黑藻",
    value: 0
}, {
    name: "苦草",
    value: 0
}, {
    name: "扁担草",
    value: 0
}, {
    name: "其他",
    value: 0
}])
// 螃蟹
const crabTypes = ref<{
    name: string,
    value: number,
    [key: string]: any
}[]>([])
const crabSeedlingsTypes = ref<{
    name: string,
    value: number,
    [key: string]: any
}[]>([])

watch(() => props.FarmerData, (value) => {
    farmerData.value = value
    if (farmerData.value) {
        //-------------套养 Start-------------//
        const intensives = farmerData.value.map(v => (v["breeding_mode"] as any[]).map(v => (v["intensive"] as any[])));
        intensiveTypeNames.value = arrayUnion(intensives.map(value => uniqueArray(value.map(v => v.map(v => v.type)).flat())));
        const intensiveTypesAll = intensives.map(
            value => {
                const temp = value.map(
                    v => v.map(v => ({
                        name: v.type,
                        value: v.number,
                        expected_survival: v.number * v.expected_survival_rate
                    })
                    )
                )
                const names = arrayUnion(temp.map(v => v.map(v => v.name)))
                const res = names.map(name => ({
                    name: name,
                    value: temp.flat().filter(v => v.name == name).map(v => v.value).reduce((prev, curr) => prev + curr),
                    expected_survival: temp.flat().filter(v => v.name == name).map(v => v.expected_survival).reduce((prev, curr) => prev + curr),
                }))

                return res
            }
        )
        intensiveTypes.value = (intensiveTypeNames.value.map((name) => {
            const t = intensiveTypesAll.flat().filter(v => v.name == name)
            return {
                name: name,
                value: t.map(v => v.value).reduce((prev, curr) => (prev + curr)),
                expected_survival: t.map(v => v.expected_survival).reduce((prev, curr) => (prev + curr)),
            }
        }));
        //-------------套养 End-------------//
        //-------------水草 Start-------------//
        const breedingMode = farmerData.value.map(value => value["breeding_mode"].map((v: any) => ({ ...v, street: value["street"] }))) as {
            name: string
            pond_area: number
            pond_num: number
            crab_infos: ICrabInfos
            street: string
        }[][];
        const crabInfos = farmerData.value.map(v => (v["breeding_mode"] as any[]).map(v => (v["crab_infos"] as ICrabInfos)));
        waterGrass.value = waterGrass.value.map(value => {
            const temps = crabInfos.map(v => arrayUnion(v.map(v => v.water_grass))).flat()
            return {
                name: value.name,
                value: temps.filter(v => (v == value.name) || !waterGrass.value.map(vv => vv.name).includes(v)).length
            }
        })
        //-------------水草 End-------------//
        //-------------螃蟹 Start-------------//
        const crabs = arrayUnion(breedingMode.map(v => v.map(v => v.crab_infos)).map(v => v.map(v => v.crab_types)));  // 螃蟹种类
        crabTypes.value = crabs.map(value => {
            const temp = breedingMode.map(v => v.map(v => ({
                ...v.crab_infos,
                pondNum: v.pond_num,
                pondArea: v.pond_area
            }))).map(v => v.filter(v => v.crab_types == value));
            const item_expected_survival_rate = temp.flat().map(v => v.expected_survival_rate).flat();

            return {
                name: value,
                value: temp.length, // 养殖的农户数量
                // 预期存活率
                expectedSurvivalRate: cellTo(item_expected_survival_rate.reduce((a, b) => a + b) / item_expected_survival_rate.length, -2),
                // 预期存活量
                expectedProductionVolume: temp.flat().map(v => v.expected_production_volume).reduce((a, b) => a + b),
                // 总塘口数量
                pondNum: roundToDecimal(temp.flat().map(v => v.pondNum).reduce((a, b) => a + b), 2)
            }
        })
        //-------------螃蟹 End-------------//
        //-------------蟹苗 Start-------------//
        const crabSeedlings = arrayUnion(breedingMode.map(v => v.map(v => v.crab_infos)).map(v => v.map(v => v.crab_seedlings_types)));  // 蟹苗种类

        crabSeedlingsTypes.value = crabSeedlings.map(value => {
            const temp = breedingMode.map(v => v.map(v => ({
                ...v.crab_infos,
                pondNum: v.pond_num,
                pondArea: v.pond_area,
                street: v.street
            }))).map(v => v.filter(v => v.crab_seedlings_types == value));

            const temp_crab_seedlings_infos = temp.map(v => v.map(v => ({
                crab_seedlings_infos: v.crab_seedlings_infos,
                expected_production_volume: v.expected_production_volume,
                pondNum: v.pondNum,
                pondArea: v.pondArea,
                street: v.street ? v.street : "其他地区",
            }))).flat(2);

            const item_expected_survival_rate = temp_crab_seedlings_infos.map(v => v.crab_seedlings_infos.map(v => v.survival_rate)).flat();
            const item_seedlings_planted_number = temp_crab_seedlings_infos.map(v => v.crab_seedlings_infos.map(v => v.seedlings_planted_number)).flat();
            const streets = arrayUnion([temp_crab_seedlings_infos.map(v => v.street)]);
            const streetDataSet = streets.map(street => {
                const curr_datas = temp_crab_seedlings_infos.filter(v => v.street == street);
                const pondArea = curr_datas.map(v => v.pondArea).reduce((a, b) => (a + b));
                const expectedProductionVolume = curr_datas.map(v => v.expected_production_volume).reduce((a, b) => (a + b));
                const seedlingsPlantedNumber = curr_datas.map(v => v.crab_seedlings_infos.map(v => v.seedlings_planted_number)).flat().reduce((a, b) => a + b);

                return {
                    street: street,
                    // 当前乡镇总亩数
                    pondArea: pondArea,
                    // 当前乡镇预计总产量（斤）
                    expectedProductionVolume: expectedProductionVolume,
                    // 当前乡镇亩产量（预期）（斤）
                    expectedProductionVolumePreAcre: expectedProductionVolume / pondArea,
                    // 当前乡镇总投苗数（个）
                    seedlings_planted_number: seedlingsPlantedNumber,
                    // 当前象征每亩投苗数（个/亩）
                    seedlings_planted_numberPreAcre: seedlingsPlantedNumber / pondArea,
                    datas: curr_datas,
                }
            })
            return {
                name: value,
                // 养殖的总亩数,
                value: temp_crab_seedlings_infos.map((v) => v.pondArea).reduce((a, b) => a + b),
                // 平均存活率
                expectedSurvivalRate: roundToDecimal(item_expected_survival_rate.reduce((a, b) => a + b) / item_expected_survival_rate.length, 2),
                // 预期总产量
                expectedProductionVolume: temp_crab_seedlings_infos.map((v) => v.expected_production_volume).reduce((a, b) => a + b),
                // 投入总量
                plantedNumber: roundToDecimal(item_seedlings_planted_number.reduce((a, b) => a + b), 2),
                streets: streets,
                streetDataSet: streetDataSet,
                // 完整数据
                datas: temp_crab_seedlings_infos,
            }
        })
        //-------------蟹苗 End-------------//

    }
}, {
    immediate: true,
    deep: true
})
</script>

<style lang="less" scoped>
.container {
    color: #fff;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        /* 设置滚动条宽度 */
        width: 5px;
    }

    &::-webkit-scrollbar-track {
        /* 设置滚动条轨道背景色 */
        background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
        /* 设置滚动条滑块背景色 */
        background-color: #888;
        /* 设置滚动条滑块边框圆角 */
        border-radius: 4px;

        &:hover {
            /* 设置滚动条滑块在悬停时的背景色 */
            background-color: #555;

        }
    }


    h1 {
        color: red;
        text-align: center;
    }
}
</style>