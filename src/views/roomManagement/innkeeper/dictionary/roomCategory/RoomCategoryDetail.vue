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
      <v-row>
        <v-col cols="5">
          <label> Mã loại phòng </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập mã loại phòng"
            :autofocus=true
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
            type='number'
            :reverse="false"
            :inset="false"
            :min="0"
            :hide-spin-buttons="true"
            suffix='m²'
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
  name: "RoomCategoryDetail",
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