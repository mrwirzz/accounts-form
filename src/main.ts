import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { createPinia } from "pinia";
import { create } from "naive-ui";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(store);
app.use(create());

app.mount("#app");
