<template>
  <t-dynamic-popup
    :title="title"
    :width="700"
    name="BuildingDetail"
    class="building-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col v-if="editMode == 2" class="mr-4" cols="4">
          <label> Mã tòa nhà</label>
          <v-text-field
            disabled
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :rules="[rules.required]"
            v-model="model.building_code"
            density="compact"
        /></v-col>
        <v-col>
          <label> Tên tòa nhà <span class="required">*</span></label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập tên tòa nhà"
            :rules="[rules.required]"
            v-model="model.building_name"
            density="compact"
        /></v-col>
      </v-row>
      <!-- Địa chỉ cho thuê -->
      <v-sheet>
        <v-row align="center" class="address mb-2">
          <v-col
            v-for="item in addressInfo"
            :key="item.label"
            align-self="center"
          >
            <v-autocomplete
              clearable
              v-model="model[item.valueField]"
              density="compact"
              :auto-select-first="true"
              :no-data-text="item.noDataText"
              :label="item.label"
              :items="item.items"
              :item-value="locationStore.$state.idField"
              :item-title="locationStore.$state.nameField"
              :rules="[rules.required]"
              @update:modelValue="selectLocation($event, item.locationType)"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- 02 -->
        <v-row class="address mb-4">
          <v-col>
            <v-text-field
              hide-details
              label="Đường/Phố"
              density="compact"
              variant="outlined"
              color="blue-lighten-3"
              v-model="model.street_name"
              @update:modelValue="updateLocation($event, 2)"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              hide-details
              label="Số nhà"
              density="compact"
              variant="outlined"
              color="blue-lighten-3"
              v-model="model.house_number"
              @update:modelValue="updateLocation($event, 1)"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="d-flex flex-column">
          <label class="mb-2">Địa chỉ</label>
          <v-text-field
            :variant="allowEdit ? 'filled' : 'outlined'"
            density="compact"
            readonly
            :hide-details="true"
            placeholder="Địa chỉ"
            color="blue-lighten-3"
            v-model="model.building_address"
          >
          </v-text-field>
        </v-row>
      </v-sheet>
    </template>
    <!-- Chân popup -->
    <template #footer="{ close }">
      <div class="d-flex flex-row-reverse justify-space-between align-center">
        <div class="d-flex flex-row-reverse">
          <v-btn class="ml-3" min-width="80" color="blue" @click="submit"
            >Lưu</v-btn
          >
          <v-btn min-width="80" @click="close" variant="outlined">Hủy</v-btn>
        </div>
        <v-checkbox-btn
          :disabled="disableUsingBtn"
          label="Sử dụng"
          color="blue"
          density="compact"
          v-model="isUsing"
        ></v-checkbox-btn>
      </div>
    </template>
  </t-dynamic-popup>
</template>

<script>
// base
import BaseDetail from "@/views/base/baseDetail.js";
// components
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";
import { useBuildingDetail } from "./buildingDetail";

export default {
  extends: BaseDetail,
  name: "BuildingDetail",
  components: {
    TCurrencyInput,
  },
  setup() {
    const resource = useBuildingDetail();
    return resource;
  },
};
</script>

<style lang="scss">
.address {
  .v-col + .v-col {
    margin-left: 16px;
  }
}
</style>