<template>
  <t-dynamic-popup
    :title="title"
    :width="600"
    name="serviceFeeDetail"
    class="service-fee-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col class="mr-4">
          <label> Mã dịch vụ </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập mã dịch vụ"
            :disabled="viewing"
            v-model="model.service_fee_code"
        /></v-col>
        <v-col>
          <label> Loại dịch vụ </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Tiền điện, Tiền nước, ..."
            :disabled="viewing"
            v-model="model.service_type"
        /></v-col>
      </v-row>

      <v-row>
        <v-col class="mr-4">
          <label>Mức giá dịch vụ</label>
          <t-currency-input
            class="mt-2"
            v-model="model.fee_price"
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
import { useServiceFeeDetail } from "./serviceFeeDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";
// components
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";

export default {
  extends: BaseDetail,
  name: "ServiceFeeDetail",
  components: { TCurrencyInput },
  setup() {
    const serviceDetail = useServiceFeeDetail();
    return serviceDetail;
  },
};
</script>