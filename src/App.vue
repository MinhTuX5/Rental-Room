<template>
  <div class="app-container">
    <v-alert
      v-if="store.showAlert"
      class="v-alert-custom"
      variant="flat"
      :type="store.alertType"
      :height="48"
      >{{ store.alertMessage }}</v-alert
    >
    <router-view />
    <modals-container />
  </div>
</template>

<script>
import { useAppStore } from "@/stores/appStore";
import { ModalsContainer } from "vue-final-modal";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { onMounted, ref } from "vue";

export default {
  name: "App",
  components: {
    ModalsContainer,
  },
  setup() {
    const store = useAppStore();

    const isLoggedIn = ref(false);
    onMounted(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if(user) {
          isLoggedIn.value = true;
        } else {
          isLoggedIn.value = false;
        }
      })
    })

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
    position: fixed;
    display: flex;
    align-items: center;
    left: 50%;
    transform: translate(-50%, 20%);
    z-index: 2001;
    width: fit-content;

    .v-alert__prepend {
      align-self: unset;
    }
  }
}
</style>