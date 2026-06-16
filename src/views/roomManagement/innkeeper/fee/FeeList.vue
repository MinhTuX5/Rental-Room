<template>
  <v-container class="household-list">
    <t-feature
      :ref="refToolBar"
      class="pb-4"
      search-label="Mã hợp đồng, mã phòng"
      addBtnColor="green-lighten-1"
      addBtnText="Sinh thu phí"
      @on-click="genFees"
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
      no-data-text="Không có dữ liệu"
      :fixed-footer="true"
      :fixed-header="true"
      :style="{ maxHeight: tableMaxHeight + 'px' }"
      @update:options="loadItems"
    >
      <template v-slot:item.contract_code="{ item }">
        <span
          class="text-blue cursor-pointer font-weight-bold"
          @click="showResidentsPopup(item)"
        >
          {{ item.contract_code }}
        </span>
      </template>
      <template v-slot:item.displayed_fee_status="{ item }">
        <v-chip :color="item.status_color">{{
          item.displayed_fee_status
        }}</v-chip>
      </template>
      <template v-slot:item.print="{ item }">
        <v-icon
          color="indigo"
          v-tooltip:top="'In phiếu thu'"
          class="cursor-pointer"
          size="large"
          @click="printReceipt(item)"
        >
          mdi-printer
        </v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-row justify="center">
          <v-col>
            <v-icon
              color="green"
              v-tooltip:top="'Thanh toán'"
              class="cursor-pointer"
              size="large"
              @click="pay(item)"
            >
              mdi-cash-sync
            </v-icon>
          </v-col>
          <v-col>
            <v-icon
              color="blue"
              v-tooltip:top="'Chỉnh sửa'"
              class="cursor-pointer"
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
import baseDicList from "@/views/base/baseDicList";
// resources
import { useHouseholdList } from "./feeList.js";

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
