<template>
  <t-dynamic-popup
    :title="title"
    :width="500"
    name="PaymentDetail"
    class="payment-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup thanh toán -->
    <template #content>
      <v-row>
        <v-col class="mr-4">
          <label> Mã phòng </label>
          <v-text-field
            disabled
            hide-details
            class="mt-2"
            variant="outlined"
            v-model="model.room_code"
          />
        </v-col>
        <v-col>
          <label> Chủ phòng </label>
          <v-text-field
            disabled
            hide-details
            class="mt-2"
            variant="outlined"
            v-model="model.resident_name"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-col class="mr-4">
          <label>Số tiền</label>
          <t-currency-input
            class="mt-2"
            v-model="model.payment_amount"
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
          <label>Ngày thanh toán</label>
          <v-text-field
            id="date"
            variant="outlined"
            v-model="displayedDate"
            append-inner-icon="mdi-calendar"
            readonly
            class="mt-2"
          ></v-text-field>
          <v-menu
            location="start center"
            activator="#date"
            :close-on-content-click="false"
          >
            <v-date-picker
              v-model="model.payment_date"
              hide-header
              show-adjacent-months
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <div class="text-h6">Lịch sử giao dịch</div>
        <v-data-table-virtual
          :fixed-header="true"
          no-data-text="Không tìm thấy lịch sử thanh toán"
          :headers="headers"
          :items="model.oldPayments"
          :height="model.oldPayments?.length > 0 ? 212 : 120"
        >
        </v-data-table-virtual>
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
import { usePaymentDetail } from "./paymentDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";

export default {
  extends: BaseDetail,
  name: "PaymentDetail",
  components: {},
  setup() {
    const resource = usePaymentDetail();
    return resource;
  },
};
</script>

<style lang="scss">
</style>