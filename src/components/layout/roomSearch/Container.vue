<template>
  <v-header ref="VHeader" @onClickHomeBtn="scrollToTop" />
  <router-view :height-of-header="$refs.VHeader?.$el.clientHeight" />
  <v-footer />
  <t-login-popup
    v-if="appStore.$state.showLoginPopup"
    :fromAdmin="fromAdmin"
    containerClass="login-popup-custom"
  />
</template>

<script>
import { getCurrentInstance, onMounted, ref } from "vue";
import { useGoTo } from "vuetify";
import VHeader from "./Header.vue";
import VFooter from "./Footer.vue";
import TLoginPopup from "@/components/views/loginPopup/TLoginPopup.vue";
// resource
import { scrollTo, moveToTop } from "@/common/commonFunction";
// stores
import { useAppStore } from "../../../stores/appStore";

export default {
  name: "SearchContainer",
  components: {
    VHeader,
    VFooter,
    TLoginPopup,
  },

  setup() {
    const { proxy } = getCurrentInstance();
    const goTo = useGoTo();

    const appStore = useAppStore();

    const scrollToTop = () => {
      scrollTo(goTo, 0);
    };

    const fromAdmin = ref(false);

    onMounted(() => {
      const me = proxy;

      moveToTop();
      window._roomSearchContainer = me;

      // Kiểm tra thông tin từ sessionStorage
      const redirectedFrom = sessionStorage.getItem("redirectFrom");
      if (redirectedFrom == "Admin") {
        fromAdmin.value = true; // Thông tin đã đăng nhập từ trang admin
        appStore.toggleLoginPopup(); // Hiển thị popup đăng nhập nếu đã đăng nhập từ trang admin
      }
      
      // Xóa thông tin sau khi đã sử dụng
      sessionStorage.removeItem("redirectFrom");
      setTimeout(() => {
        fromAdmin.value = false;
      }, 0);
    });

    return {
      scrollToTop,
      appStore,
      fromAdmin,
    };
  },
};
</script>

<style lang="scss">
.login-popup-custom {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
}
</style>