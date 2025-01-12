import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify"; // Import cấu hình Vuetify
import "./styles/style.css";
import { createPinia } from "pinia";
import VueTextareaAutosize from "vue-textarea-autosize";
import router from "@/router";
import { registerGlobalComponent } from "@/components/register/globalComponent.js";
import { registerPopup } from "@/components/register/popupRegister.js";
import { initApp } from "@/common/initApp.js";
import { vfmPlugin } from "vue-final-modal";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(vfmPlugin);

app.use(VueTextareaAutosize);

app.use(router);

app.use(vuetify);

registerGlobalComponent(app);
registerPopup(app);

initApp();

app.mount("#app");
