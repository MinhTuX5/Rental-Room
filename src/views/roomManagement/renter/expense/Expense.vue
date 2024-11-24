<template>
  <v-container ref="child-container" class="d-flex flex-column h-100">
    <v-data-table
      :style="{maxHeight: contentHeight + 'px'}"
      :height="contentHeight"
      :headers="headers"
      :items="items"
      :sticky="true"
      :fixedHeader="true"
      :fixedFooter="true"
      no-data-text="Không có dữ liệu"
      itemsPerPageText='Số dòng mỗi trang'
    ></v-data-table>
  </v-container>
</template>

<script>
import { useExpense } from "./expense";

export default {
  name: "Expense",
  setup() {
    const resource = useExpense();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./Expense";
</style>