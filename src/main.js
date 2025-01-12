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
import { initializeApp } from 'firebase/app';

const app = createApp(App);

const firebaseConfig = {
  apiKey: "AIzaSyCD7Pgy8XlA1DnlJeJ6atSWXqq6_u8iOpk",
  authDomain: "rental-room-system-21e0e.firebaseapp.com",
  projectId: "rental-room-system-21e0e",
  storageBucket: "rental-room-system-21e0e.firebasestorage.app",
  messagingSenderId: "363809723938",
  appId: "1:363809723938:web:9c78bf65994faa0e471c7b"
};

initializeApp(firebaseConfig)

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
