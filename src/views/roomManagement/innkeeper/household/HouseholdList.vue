<template>
  <v-container class="household-list">
    <t-feature
      :ref="refToolBar"
      class="pb-4"
      search-label="Thông tin phòng, chủ trọ"
      :showAddBtn="false"
      @on-click="viewDetail"
      @search="onSearch"
      @refresh="refresh"
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
      no-data-text="Tất cả các phòng chưa có người thuê nào"
      :fixed-footer="true"
      :fixed-header="true"
      :style="{ maxHeight: tableMaxHeight + 'px' }"
      @update:options="loadItems"
    >
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
        </v-row>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script>
import baseDicList from "@/views/base/baseDicList";
// resources
import { useHouseholdList } from "./householdList.js";

export default {
  extends: baseDicList,
  name: "BuildingList",
  components: {},
  props: {
    heightOfAppHeader: {
      typeof: "number",
      default: 64,
    },
  },
  setup() {
    const resource = useHouseholdList();
    return { ...resource };
  },
};
</script>

<style lang="scss">
</style>