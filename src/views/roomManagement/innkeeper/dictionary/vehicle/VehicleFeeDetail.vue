<template>
  <t-dynamic-popup
    :title="title"
    :width="600"
    name="VehicleFeeDetail"
    class="vehicle-fee-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col>
          <label> Mã phương tiện </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập mã phương tiện"
            :disabled="viewing"
            v-model="model.vehicle_fee_code"
        /></v-col>
        <v-col>
          <label> Loại phương tiện </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Ô tô, xe máy, ..."
            :disabled="viewing"
            v-model="model.vehicle_type"
        /></v-col>
      </v-row>

      <v-row>
        <v-col>
          <label>Giá phí gửi xe</label>
          <t-currency-input
            class="mt-2"
            v-model="feePrice"
            placeholder=""
            :options="{
              currency: 'VND',
              currencyDisplay: 'hidden',
              locale: 'de-DE',
              valueRange: {
                min: 0,
              },
              hideGroupingSeparatorOnFocus: false,
            }"
          />
        </v-col>
        <v-col>
          <label>Đơn vị tính</label>
          <v-select
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :items="unitItems"
            v-model="model.unit"
          />
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
import { useVehicleFeeDetail } from "./vehicleFeeDetail";
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
.vehicle-fee-detail {
  .modal_content {
    padding: unset;
  }
}
</style>