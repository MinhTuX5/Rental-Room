<template>
  <v-container class="vehicle-list">
    <t-feature class="mb-4" search-label="Mã, Loại phương tiện"></t-feature>
    <t-data-table :items="items" :headers="headers"></t-data-table>
  </v-container>
</template>

<script>
import { usVehicleList } from "./vehicleList";
import BaseList from "@/views/base/baseList.js";
// components
import TFeature from "@/components/base/views/TFeature.vue";

export default {
  extends: BaseList,
  name: "VehicleList",
  components: { TFeature },
  setup() {
    const vehicleList = usVehicleList();
    return vehicleList;
  },
};
</script>

<style lang="scss">
.vehicle-list {
  @import "./VehicleList.scss";
}
</style>