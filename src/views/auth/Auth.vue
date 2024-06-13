<template>
  <v-sheet
    class="h-screen align-center d-flex flex-column justify-center"
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