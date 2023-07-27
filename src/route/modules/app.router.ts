import { RouteRecordRaw } from "vue-router";


const appRouters: RouteRecordRaw = {
    path: "/index",
    name: "Index",
    component: () => import("../../App.vue"),
    meta: {
        title: "集成展示",
        keepAlive: true,
    },
    children: [],
}

export default appRouters