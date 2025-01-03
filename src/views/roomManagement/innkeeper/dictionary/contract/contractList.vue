<template>
  <v-container class="contract-category-list">
    <t-feature
      :ref="refToolBar"
      class="pb-4"
      search-label="Mã hợp đồng, mã phòng"
      @on-click="viewDetail"
      @search="onSearch"
    ></t-feature>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="items"
      :items-length="totalItems"
      :loading="loading"
      :search="keyWord"
      item-value="name"
      items-per-page-text="Số bản ghi mỗi trang"
      loading-text="Đang tải dữ liệu"
      no-data-text="Không có dữ liệu"
      :fixed-footer="true"
      :fixed-header="true"
      :style="{ maxHeight: tableMaxHeight + 'px' }"
      @update:options="loadItems"
    >
      <template v-slot:item.is_empty="{ item }">
        <v-checkbox-btn class="justify-center" v-model="item.is_empty" readonly></v-checkbox-btn>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-row>
          <v-col>
            <v-icon
              color="blue"
              v-tooltip:top="'Chỉnh sửa'"
              class="mr-2 cursor-pointer"
              size="large"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
          </v-col>
          <v-col>
            <v-icon
              class="cursor-pointer"
              color="red"
              v-tooltip:top="'Xóa'"
              size="large"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </v-col>
        </v-row>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script>
import { useContractList } from "./contractList";
import baseDicList from "@/views/base/baseDicList";
// components
import TFeature from "@/components/base/views/TFeature.vue";

export default {
  extends: baseDicList,
  name: "ContractList",
  components: { TFeature },
  props: {
    heightOfAppHeader: {
      typeof: "number",
      default: 64,
    },
  },
  setup() {
    const resource = useContractList();
    return resource;
  },
};
</script>

<style lang="scss">
</style>