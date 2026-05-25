<template>
  <t-dynamic-popup
    :title="title"
    :width="700"
    name="VehicleDetail"
    class="vehicle-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col class="mr-4">
          <label> Chủ xe </label>
          <v-autocomplete
            v-if="!viewing"
            hide-details
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :items="residents"
            item-title="resident_name"
            item-value="resident_id"
            :menu-props="vehicleDetailMenuProps"
            v-model="model.resident_id"
            @update:modelValue="onSelectResident"
            placeholder="Chọn chủ xe"
          />
          <v-text-field
            v-else
            disabled
            hide-details
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.resident_name"
          />
        </v-col>
        <v-col>
          <label> Loại phương tiện </label>
          <v-combobox
            v-if="!viewing"
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Chọn hoặc nhập loại xe"
            :items="vehicleTypes"
            :menu-props="vehicleDetailMenuProps"
            v-model="model.vehicle_type"
            hide-details
          />
          <v-text-field
            v-else
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            disabled
            v-model="model.vehicle_type"
            hide-details
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="mr-4">
          <label> Biển số xe </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.license_plate"
          />
        </v-col>
        <v-col class="mr-4">
          <label> Màu sắc </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập màu xe"
            v-model="model.color"
        /></v-col>
        <v-col>
          <label> Mẫu xe </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Honda vision, Honda LEAD, ..."
            v-model="model.vehicle_brand"
        /></v-col>
      </v-row>
    </template>
    <!-- Chân popup -->
    <template #footer="{ close }">
      <div class="d-flex flex-row-reverse">
        <v-btn class="ml-3" min-width="80" color="blue" @click="submit"
          >Lưu</v-btn
        >
        <v-btn min-width="80" @click="close" variant="outlined">Hủy</v-btn>
      </div>
    </template>
  </t-dynamic-popup>
</template>

<script>
import { useVehicleDetail } from "./vehicleDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";

export default {
  extends: BaseDetail,
  name: "VehicleDetail",
  components: {},
  setup() {
    const resource = useVehicleDetail();
    return resource;
  },
  data() {
    return {
      residents: [],
      vehicleTypes: [],
      vehicleDetailMenuProps: {
        zIndex: 4000,
        contentClass: "vehicle-detail-menu",
      },
    };
  },
};
</script>

<style lang="scss">
.vehicle-detail-menu {
  z-index: 4000 !important;
}
</style>
