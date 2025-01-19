<template>
  <t-dynamic-popup
    :title="title"
    :width="660"
    name="RoomCategoryDetail"
    class="room-category-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <!-- Địa chỉ cho thuê -->
      <v-sheet>
        <v-sheet class="text-h5 mb-4">Địa chỉ cho thuê</v-sheet>
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
              :autofocus="item.autofocus"
              :rules="[rules.required]"
              @update:modelValue="selectLocation($event, item.locationType)"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- 02 -->
        <v-row class="address">
          <v-col>
            <v-text-field
              label="Đường/Phố"
              density="compact"
              :disabled="viewing"
              v-model="model.street_name"
              @update:modelValue="updateLocationParts($event, 2)"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Số nhà"
              density="compact"
              :disabled="viewing"
              v-model="model.house_number"
              @update:modelValue="updateLocationParts($event, 1)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-sheet>

      <v-row>
        <v-col cols="5">
          <label> Mã loại phòng </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập mã loại phòng"
            :autofocus="true"
            :disabled="viewing"
            v-model="model.room_category_code"
        /></v-col>
        <v-col cols="7">
          <label> Loại phòng </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Phòng VIP, ..."
            :disabled="viewing"
            v-model="model.room_category_name"
        /></v-col>
      </v-row>

      <v-row>
        <v-col cols="5">
          <label>Giá phòng</label>
          <t-currency-input
            class="mt-2"
            v-model="feePrice"
            placeholder=""
            :options="{
              currency: 'VND',
              locale: 'de-DE',
              valueRange: {
                min: 0,
              },
              hideGroupingSeparatorOnFocus: false,
            }"
          />
        </v-col>
        <v-col>
          <label>Diện tích</label>
          <v-number-input
            class="mt-2 hide-spin-buttons"
            variant="outlined"
            controlVariant=""
            type="number"
            :reverse="false"
            :inset="false"
            :min="0"
            :hide-spin-buttons="true"
            suffix="m²"
            v-model="model.room_area"
          ></v-number-input>
        </v-col>
        <v-col>
          <label>Số phòng ngủ</label>
          <v-number-input
            class="mt-2"
            variant="outlined"
            controlVariant="stacked"
            :reverse="false"
            :inset="true"
            :min="0"
            v-model="model.no_of_bed_rooms"
          ></v-number-input>
        </v-col>
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
import { useVehicleFeeDetail } from "./roomCategoryDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";
// components
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";

export default {
  extends: BaseDetail,
  name: "VehicleFeeDetail",
  components: {
    TCurrencyInput,
  },
  setup() {
    const vehicleFeeDetail = useVehicleFeeDetail();
    return vehicleFeeDetail;
  },
};
</script>

<style lang="scss">
</style>