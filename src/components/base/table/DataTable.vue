<template>
  <v-data-table
    :style="{ maxHeight: contentHeight + 'px' }"
    :height="contentHeight"
    :headers="headers"
    :items="items"
    :sticky="true"
    :fixedHeader="true"
    :fixedFooter="true"
    no-data-text="Không có dữ liệu"
    itemsPerPageText="Số dòng mỗi trang"
  ></v-data-table>
</template>

<script>
export default {
  name: "TDataTable",
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    contentHeight: {
      type: Number,
      default: () => 500,
    },
    headers: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  setup() {
    return {};
  },
};
</script>