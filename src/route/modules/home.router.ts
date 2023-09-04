import { RouteRecordRaw } from "vue-router";


const homeRouters: RouteRecordRaw = {
    path: "/home",
    name: "Home",
    component: () => import("../../components/All/index.vue"),
    meta: {
        title: "主页",
        keepAlive: false,
    },
    children: [
        {
            path: "/home/1",
            name: "Home1",
            component: () => import("../../views/main/1.vue"),
            meta: {
                keepAlive: false,
                title: "南京高淳螃蟹大数据"
            }
        }, {
            path: "/home/2",
            name: "Home2",
            component: () => import("../../views/main/2.vue"),
            meta: {
                keepAlive: false,
                title: "虾蟹产业价格风险决策模型"
            }
        }, {
            path: "/home/3",
            name: "Home3",
            component: () => import("../../views/main/3.vue"),
            meta: {
                keepAlive: false,
                title: "洪蓝街道水产养殖信息"
            }
        },
    ],
}

export default homeRouters