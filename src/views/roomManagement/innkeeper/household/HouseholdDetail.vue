<template>
  <t-dynamic-popup
    :title="title"
    name="HouseholdDetail"
    class="household-detail"
    :drag="false"
    :maximum="true"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row class="flex-unset">
        <v-col class="mr-4">
          <label> Mã phòng </label>
          <v-text-field
            readonly
            density="compact"
            hide-details
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.room_code"
        /></v-col>
        <v-col class="mr-4">
          <label> Vị trí phòng </label>
          <v-text-field
            readonly
            density="compact"
            hide-details
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.room_position"
          />
        </v-col>
        <v-col class="mr-4">
          <label> Mã chủ phòng </label>
          <v-text-field
            readonly
            density="compact"
            hide-details
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.resident_code"
          />
        </v-col>
        <v-col class="mr-4">
          <label> Tên chủ phòng </label>
          <v-text-field
            readonly
            density="compact"
            hide-details
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.resident_name"
          />
        </v-col>
        <v-col class="mr-4">
          <label> Số điện thoại </label>
          <v-text-field
            readonly
            density="compact"
            hide-details
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            v-model="model.phone_number"
          />
        </v-col>
      </v-row>

      <v-row class="mt-4">
        <v-data-table-virtual
          :fixed-header="true"
          no-data-text="Không tìm thấy thành viên của phòng"
          :headers="residentHeaders"
          :items="model.residents"
        >
          <template v-slot:item.on_leave="{ item }">
            <v-checkbox-btn
              readonly
              color="green"
              class="justify-center"
              v-model="item.on_leave"
            ></v-checkbox-btn>
          </template>
          <template v-slot:item.displayed_resident_gender="{ item }">
            <v-chip :color="item.color">{{
              item.displayed_resident_gender
            }}</v-chip>
          </template>
        </v-data-table-virtual>
      </v-row>

      <t-feature
        :ref="refToolBar"
        class="pb-4 mt-4"
        :showRefreshBtn="false"
        @on-click="viewDetail"
      ></t-feature>
      <v-row>
        <v-data-table-virtual
          :fixed-header="true"
          no-data-text="Chưa có phương tiện được đăng ký"
          :headers="vehicleHeaders"
          :items="vehicleStore.$state.items"
          :height="140"
        >
          <template v-slot:item.actions="{ item }">
            <v-row>
              <v-col>
                <v-icon
                  color="blue"
                  v-tooltip:top="'Chỉnh sửa'"
                  class="mr-2 cursor-pointer"
                  size="large"
                  @click="editVehicle(item)"
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
import { useHouseholdDetail } from "./householdDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";

export default {
  extends: BaseDetail,
  name: "HouseholdDetail",
  setup() {
    const resource = useHouseholdDetail();
    return { ...resource };
  },
};
</script>

<style lang="scss">
.household-detail {
  .modal-content {
    display: flex;
    flex-direction: column;

    .modal_content {
      flex: 1;

      .flex-unset {
        flex: unset;
      }
    }
  }
}
</style>