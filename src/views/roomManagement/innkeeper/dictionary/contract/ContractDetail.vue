<template>
  <t-dynamic-popup
    :title="title"
    :width="660"
    name="ContractDetail"
    class="contract-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col>
          <label> Mã hợp đồng </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập mã hợp đồng"
            :autofocus="true"
            v-model="model[store.codeField]"
        /></v-col>

        <v-col class="ml-4">
          <label> Phòng </label>
          <v-autocomplete
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :items="allRooms"
            :item-title="roomStore.nameField"
            :item-value="roomStore.idField"
            v-model="model[roomStore.idField]"
            @update:modelValue="onSelectRoom"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="mr-4">
          <label>Giá phòng</label>
          <t-currency-input
            class="mt-2"
            v-model="model.room_price"
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
        <v-col class="mr-4">
          <label>Tiền cọc</label>
          <t-currency-input
            class="mt-2"
            v-model="model.room_deposit"
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
          <label>Số tiền cọc đã nhận</label>
          <t-currency-input
            class="mt-2"
            v-model="model.deposit_amount_received"
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
      </v-row>

      <v-row class="mt-22px">
        <v-col class="mr-4">
          <label>Ngày bắt đầu</label>
          <v-text-field
            id="startDate"
            variant="outlined"
            v-model="startDate"
            append-inner-icon="mdi-calendar"
            readonly
            class="mt-2"
          ></v-text-field>
          <v-menu
            location="end center"
            activator="#startDate"
            :close-on-content-click="false"
          >
            <v-date-picker
              v-model="model.start_date"
              hide-header
              show-adjacent-months
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <label>Ngày kết thúc</label>
          <v-text-field
            id="endDate"
            variant="outlined"
            v-model="endDate"
            append-inner-icon="mdi-calendar"
            readonly
            class="mt-2"
          ></v-text-field>
          <v-menu
            location="start center"
            activator="#endDate"
            :close-on-content-click="false"
          >
            <!-- locale="sv-se" -->
            <v-date-picker
              v-model="model.end_date"
              hide-header
              show-adjacent-months
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
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
// resource
import { useContractDetail } from "./contractDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";
// components
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";

export default {
  extends: BaseDetail,
  name: "ContractDetail",
  components: {
    TCurrencyInput,
  },
  setup() {
    const resource = useContractDetail();
    return {
      ...resource,
    };
  },
};
</script>

<style lang="scss">
</style>