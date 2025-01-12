<template>
  <v-header ref="VHeader" @onClickHomeBtn="scrollToTop" />
  <router-view :height-of-header="$refs.VHeader?.$el.clientHeight" />
  <v-footer />
  <t-login-popup
    v-if="appStore.$state.showLoginPopup"
    containerClass="login-popup-custom"
  />
</template>

<script>
import { getCurrentInstance, onMounted } from "vue";
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

    onMounted(() => {
      moveToTop();
      window._roomSearchContainer = proxy;
    });

    return {
      scrollToTop,
      appStore,
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