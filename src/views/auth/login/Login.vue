<template>
  <v-img
    cover
    src="https://picsum.photos/1920/1080?random"
    class="login-page h-screen d-flex justify-center align-center"
  >
    <template #placeholder> </template>
    <TLoginPopup :isManagementPage="true" />
  </v-img>
</template>


<script>
import TLoginPopup from "@/components/views/loginPopup/TLoginPopup.vue";

export default {
  name: "LoginView",
  components: { TLoginPopup },
  setup() {},
};
</script>

<style lang="scss">
.login-page {
}
</style>