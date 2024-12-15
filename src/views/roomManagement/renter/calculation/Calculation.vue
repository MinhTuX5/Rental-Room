<template>
  <v-card>
    <v-tabs bg-color="deep-purple-darken-4" center-active>
      <v-tab>One</v-tab>
      <v-tab>Two</v-tab>
      <v-tab>Three</v-tab>
    </v-tabs>
  </v-card>
</template>

<script>
import { useCalculation } from "./calculation";

export default {
  name: "Calculation",
  components: {},
  setup() {
    const resource = useCalculation();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./Calculation";
</style>