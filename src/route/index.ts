import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";
import { App } from "vue";
import modules from "./modules";

const RootRoute: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Root",
        redirect: "/home/1",
        meta: {
            title: "Root",
            keepAlive: true,
        },
        children: [modules.homeRouters, modules.appRouters],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: [...RootRoute],
    strict: true,
});

export const setupRouter = (app: App) => {
    app.use(router)
}

export default router