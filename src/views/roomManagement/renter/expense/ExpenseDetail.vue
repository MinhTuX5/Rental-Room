<template>
  <t-dynamic-popup
    :title="title"
    :width="800"
    name="ExpenseDetail"
    class="expense-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col>
          <label> Loại chi tiêu <span class="required">*</span></label>
          <v-autocomplete
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :items="allExpenseCategories"
            :item-title="expenseCategoryStore.nameField"
            :item-value="expenseCategoryStore.idField"
            v-model="model[expenseCategoryStore.idField]"
            @update:modelValue="onSelectExpenseCategory"
          ></v-autocomplete>
        </v-col>
        <v-col class="ml-4">
          <label>Số tiền chi <span class="required">*</span></label>
          <t-currency-input
            class="mt-2"
            v-model="model.expense_amount"
            placeholder="Nhập số tiền"
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
        <v-col>
          <label>Ngày chi</label>
          <v-text-field
            id="expenseDate"
            variant="outlined"
            :model-value="expenseDate"
            append-inner-icon="mdi-calendar"
            readonly
            class="mt-2"
          ></v-text-field>
          <v-menu
            location="end center"
            activator="#expenseDate"
            :close-on-content-click="false"
          >
            <v-date-picker
              v-model="model.expense_date"
              hide-header
              show-adjacent-months
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="ml-4"></v-col>
      </v-row>

      <v-row>
        <v-col>
          <label> Ghi chú </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Ăn sáng, mua sắm, ..."
            v-model="model.expense_description"
          />
        </v-col>
      </v-row>
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
      </div>
    </template>
  </t-dynamic-popup>
</template>

<script>
import { useExpenseDetail } from "./expenseDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";
// components
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";

export default {
  extends: BaseDetail,
  name: "ExpenseDetail",
  components: {
    TCurrencyInput,
  },
  setup() {
    const resource = useExpenseDetail();
    return resource;
  },
};
</script>

<style lang="scss">
.expense-detail {
  .v-col {
    padding: unset;
  }
}
</style>