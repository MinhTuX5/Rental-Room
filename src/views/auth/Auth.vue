<template>
  <v-sheet
    class="h-screen align-center d-flex flex-column justify-center position-absolute top-0 w-100"
    color="blue-grey-lighten-1"
  >
    <router-view />
  </v-sheet>
</template>


<script>
export default {
  name: "AuthView",
};
</script>