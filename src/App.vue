<template>
  <div class="app-container">
    <v-alert
      v-if="store.showAlert"
      class="v-alert-custom"
      :type="store.alertType"
      >{{ store.alertMessage }}</v-alert
    >
    <router-view />
  </div>
</template>

<script>
import { useAppStore } from "@/stores/appStore";

export default {
  name: "App",
  components: {},
  setup() {
    const store = useAppStore();
    return {
      store,
    };
  },
};
</script>

<style lang="scss">
.app-container {
  position: relative;

  .v-alert-custom {
    position: absolute;
    width: fit-content;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 20%);
    z-index: 2;
  }
}
</style>