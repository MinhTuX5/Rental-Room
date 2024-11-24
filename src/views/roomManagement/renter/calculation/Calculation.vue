<template>
  
</template>

<script>
import { useCalculation } from "./calculation";

export default {
  name: "Calculation",
  setup() {
    const resource = useCalculation();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./Calculation";
</style>