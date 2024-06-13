import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
// vue router
import router from "@/router";
// vuetify
import vuetify from "./plugins/vuetify"; // Import cấu hình Vuetify

import { registerGlobalComponent } from "@/components/register/globalComponent.js";
import { registerPopup } from "@/components/register/popupRegister.js";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);

app.use(vuetify);

registerGlobalComponent(app);
registerPopup(app);

app.mount("#app");
