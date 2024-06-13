<template>
  <div></div>
</template>

<script>
import { useTemplate } from "./template";

export default {
  name: "Template",
  setup() {
    const resource = useTemplate();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./Template";
</style>