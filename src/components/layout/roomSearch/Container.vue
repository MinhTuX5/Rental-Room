<template>
  <v-header ref="VHeader" @onClickHomeBtn="scrollToTop" />
  <router-view :height-of-header="$refs.VHeader?.$el.clientHeight" />
  <v-footer />
</template>

<script>
import { getCurrentInstance, onMounted } from "vue";
import { useGoTo } from "vuetify";
import VHeader from "./Header.vue";
import VFooter from "./Footer.vue";
// resource
import { scrollTo, moveToTop } from "@/common/commonFunction";

export default {
  name: "SearchContainer",
  components: {
    VHeader,
    VFooter,
  },

  setup() {
    const { proxy } = getCurrentInstance();
    const goTo = useGoTo();

    const scrollToTop = () => {
      scrollTo(goTo, 0);
    };

    onMounted(() => {
      moveToTop();
      window._roomSearchContainer = proxy;
    });

    return {
      scrollToTop,
    };
  },
};
</script>