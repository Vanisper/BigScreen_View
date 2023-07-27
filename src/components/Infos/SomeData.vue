<template>
    <div class="trafficVolume">
        <div class="title">
            <p class="way">养殖模式</p>
            <p v-for="(title) in props.datas.title" class="passengerTraffic">{{ title }}</p>
        </div>
        <ul style="justify-content: space-evenly;" :style="{
            height: props.height
        }">
            <li v-for="(item, index) in props.datas.datas">
                <p class="way">
                    <img v-if="item.pic" :src=item.pic alt="" />
                    <span>{{ item.name }}</span>
                </p>
                <p class="passengerTraffic" style="font-weight: 600;" v-for="(itt, idx) in item.values" :key="index">{{ itt
                }}</p>
            </li>

        </ul>
    </div>
</template>


<script lang="ts" setup>
import { h } from 'vue';

const props = defineProps({
    datas: {
        type: Object as () => {
            title: string[],
            datas: {
                pic: string,
                name: string,
                values: string[]
            }[]
        },
        required: true
    },
    height: {
        type: String,
        default: "fit-content"
    }
})
</script>

<style lang="less" scoped>
.trafficVolume {
    text-align: center;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #d8dee0;

    .title {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-around;
        padding-top: 20px;

        p {
            font-size: 18px;
            font-weight: 600;
        }

    }

    ul {
        display: flex;
        flex-direction: column;
        width: 100%;

        li {
            width: 100%;
            height: 60px;
            background-color: rgba(8, 40, 69, .3);
            border: 1px solid #0e406e;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            img {
                width: 25px;
                height: 25px;
                display: block;
                margin-right: 3px;
            }

            p {
                display: flex;
                align-items: center;
            }

            .passengerTraffic,
            .freight {
                background: linear-gradient(to left, #06aae3, #06aae3) left top no-repeat,
                    linear-gradient(to bottom, #06aae3, #06aae3) left top no-repeat,
                    linear-gradient(to left, #06aae3, #06aae3) right top no-repeat,
                    linear-gradient(to bottom, #06aae3, #06aae3) right top no-repeat,
                    linear-gradient(to left, #06aae3, #06aae3) left bottom no-repeat,
                    linear-gradient(to bottom, #06aae3, #06aae3) left bottom no-repeat,
                    linear-gradient(to left, #06aae3, #06aae3) right bottom no-repeat,
                    linear-gradient(to left, #06aae3, #06aae3) right bottom no-repeat;
                /*设置大小*/
                background-size: 5px 1px, 1px 5px, 5px 1px, 1px 5px, 5px 1px, 1px 5px, 5px 1px, 1px 5px;
                background-color: rgba(15, 54, 87, .4);
                padding: 10px 0;
                display: flex;
                justify-content: center;
            }
        }
    }

    .way {
        // width: 20%;
        justify-content: center;
        width: 100px;
    }

    .passengerTraffic {
        width: 35%;

        span {
            color: #08baa1;
            font-weight: 600;
        }
    }

    .freight {
        width: 35%;

        span {
            color: #e3e20d;
            font-weight: 600;
        }
    }
}
</style>