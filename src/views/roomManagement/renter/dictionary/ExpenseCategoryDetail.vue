<template>
  <t-dynamic-popup
    :title="title"
    :width="500"
    name="ExpenseCategoryDetail"
    class="expense-category-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col>
          <label> Loại phí chi </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Đồ ăn, Di chuyển, ..."
            v-model="model[store.$state.nameField]"
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
import { useExpenseCategoryDetail } from "./expenseCategoryDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";

export default {
  extends: BaseDetail,
  name: "ExpenseCategoryDetail",
  components: {},
  setup() {
    const resource = useExpenseCategoryDetail();
    return resource;
  },
};
</script>

<style lang="scss">
</style>