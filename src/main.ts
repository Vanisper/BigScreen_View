import { createApp } from 'vue'
import { setupStore } from "./stores";
import { setupRouter } from './route';
import "default-passive-events";
import App from './Main.vue';
import "./assets/styles/common.less";
import "./assets/styles/reset.less";
import EchartsInstall from "./components/echarts/install";

const app = createApp(App);
app.use(EchartsInstall);
setupRouter(app);
setupStore(app);

app.mount('#app');
