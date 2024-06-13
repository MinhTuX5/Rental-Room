<template>
  <v-header />
  <router-view />
  <v-footer />
</template>

<script>
import VHeader from "./Header.vue";
import VFooter from "./Footer.vue";

export default {
  name: "SearchContainer",
  components: {
    VHeader,
    VFooter,
  },

  setup() {},
};
</script>