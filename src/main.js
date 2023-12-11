import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import http from "@/api/http";
import store from "./store/store";
// main.js 또는 해당 컴포넌트
import BootstrapVue from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

const app = createApp(App);
app.use(BootstrapVue);

app.provide("$http", http);

app.use(router);
app.use(store);

app.mount("#app");
