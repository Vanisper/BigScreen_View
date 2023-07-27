<template>
    <section style="width: 100%;display: flex;align-items: center;">
        <div class="table">
            <div class="th">
                <div>
                    <span :style="{
                        width: 100 / (showData.data.length + 1) + '%',
                    }">地区</span>
                    <span :style="{
                        width: 100 / (showData.data.length + 1) + '%',
                    }" v-for="(data, index) in showData.data" :key="index">{{ data.label }}</span>
                </div>
            </div>
            <div class="tb">
                <div class="line" v-for="(title, index) in showData.title" :key="index">
                    <span :style="{
                        width: 100 / (showData.data.length + 1) + '%',
                    }">{{ title }}</span>
                    <span :style="{
                        width: 100 / (showData.data.length + 1) + '%',
                    }" v-for="(data, idx) in showData.data" :key="idx">{{ data.value[index] }}</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
    datas: {
        title: string[];
        data: {
            label: string;
            value: number[];
        }[];
    },
    show: number;
    duration: number;
}>()
const allCount = ref(props.datas.title.length - props.show)
const flag = ref(0)
const showData = computed(() => {
    const count = props.show > props.datas.title.length ? props.datas.title.length : props.show;
    const x = flag.value <= allCount.value ? [flag.value] : [flag.value, 0];
    const y = flag.value <= allCount.value ? [flag.value + count] : [props.datas.title.length, flag.value - allCount.value];
    if (count == props.datas.title.length) {
        return props.datas
    }

    return {
        title: x.map((v, i) => props.datas.title.slice(v, y[i])).flat(),
        data: props.datas.data.map(item => {
            return {
                label: item.label,
                value: x.map((v, i) => item.value.slice(v, y[i])).flat(),
            }
        })
    }
})

const update = () => {
    flag.value = flag.value <= props.datas.title.length - 1 ? flag.value + 1 : 1
}
let time: NodeJS.Timeout | null = null
onMounted(() => {
    if (showData.value.title.length === props.datas.title.length) {

    } else {
        time = setInterval(update, props.duration)
    }
})
onUnmounted(() => {
    if (time) {
        clearInterval(time)
    }
})

</script>

<style lang="less" scoped>
.table {
    width: 100%;
    text-align: center;

    .th {
        background-color: #2c91f8;
        padding: 5px;

        div {
            display: flex;
            justify-content: space-between;
        }
    }

    .tb {
        height: unset;
        overflow: hidden;
        padding: 5px;

        .line {
            --line-height: 38px;
            width: 100%;
            height: var(--line-height);
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
                height: 100%;
                line-height: var(--line-height);
                border-bottom: 1px solid #2c91f8;
            }
        }
    }
}
</style>