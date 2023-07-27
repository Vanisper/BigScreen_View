<template>
    <div ref="appRef" class="container">
        <n-dropdown :options="options" placement="bottom-start" trigger="hover" @select="handleSelect">
            <n-button class="select" text-color="#fff">{{ select.label + '价格' }}</n-button>
        </n-dropdown>
        <chart-line class="line" :dataset="Dataset" :title="select.label + '价格'" />
    </div>
</template>

<script lang="ts" setup>
import ChartLine from './Line.vue'
import { useHistoricalPricesStore } from "../../stores/useHistoricalPricesStore";
import { useMessage, NDropdown, NButton } from 'naive-ui';
import { DropdownOption } from "naive-ui/es/dropdown/src/interface";
import { ref, computed, onMounted, watch, onUnmounted } from "vue";

const appRef = ref<HTMLElement>()

interface ISelect {
    label: string,
    key: "2021FemaleGrab" | "2021MaleGrab" | "2022FemaleGrab" | "2022MaleGrab"
}
const HistoricalPrices = useHistoricalPricesStore();
const Datasets = HistoricalPrices.Historical_Prices_of_Crabs_Dataset;
const Dataset = computed(() => Datasets[select.value.key])
const select = ref<ISelect>({
    label: "2022年母蟹",
    key: "2022FemaleGrab"
})
const options = [
    {
        label: '2022年公蟹',
        key: '2022MaleGrab'
    },
    {
        label: '2022年母蟹',
        key: '2022FemaleGrab'
    },
    {
        label: '2021年公蟹',
        key: '2021MaleGrab'
    },
    {
        label: '2021年母蟹',
        key: '2021FemaleGrab'
    },
];
const message = useMessage();
const handleSelect = (_key: string | number, infos: DropdownOption) => {
    // message.info(String(key))
    select.value = infos as ISelect
}
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    position: relative;

    &>.line {
        height: 100%;
        width: 100%;
    }

    .select {
        position: absolute;
        right: 20px;
        top: 25px;
        z-index: 999;
    }
}
</style>