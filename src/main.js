import { createApp } from "vue";
import "./styles/style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import VueTextareaAutosize from "vue-textarea-autosize";
// vue router
import router from "@/router";
// vuetify
import vuetify from "./plugins/vuetify"; // Import cấu hình Vuetify
import { registerGlobalComponent } from "@/components/register/globalComponent.js";
import { registerPopup } from "@/components/register/popupRegister.js";
import { initApp } from "@/common/initApp.js";
// Popup
import { vfmPlugin } from "vue-final-modal";

const app = createApp(App);

app.use(vfmPlugin);

const pinia = createPinia();
app.use(pinia);

app.use(VueTextareaAutosize);

app.use(router);

app.use(vuetify);

registerGlobalComponent(app);
registerPopup(app);

initApp();

app.mount("#app");
