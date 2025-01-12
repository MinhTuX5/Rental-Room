<template>
  <t-dynamic-popup
    :title="title"
    :maximum="true"
    name="FeeDetail"
    class="fee-detail"
    @before-open="beforeOpen"
  >
    <template #content-title>
      <span class="ml-4 text-6 font-italic"
        >Tổng số: {{ formatNumberWithCommas(totalFee) }}</span
      >
    </template>
    <!-- Nội dung popup -->
    <template #content>
      <!-- Row 1 -->
      <v-row>
        <v-col class="mr-4">
          <label> Phòng </label>
          <v-text-field
            disabled
            hide-details
            class="mt-2"
            variant="outlined"
            density="compact"
            v-model="model.room_name"
          />
        </v-col>
        <v-col class="mr-4">
          <label>Giá phòng</label>
          <t-currency-input
            disabled
            density="compact"
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
          <label> Chủ phòng </label>
          <v-text-field
            disabled
            hide-details
            class="mt-2"
            variant="outlined"
            density="compact"
            v-model="model.resident_name"
          />
        </v-col>
        <v-col class="mr-4">
          <label>Từ ngày</label>
          <v-text-field
            disabled
            id="fromDate"
            variant="outlined"
            v-model="fromDate"
            append-inner-icon="mdi-calendar"
            readonly
            density="compact"
            class="mt-2"
          ></v-text-field>
          <v-menu
            location="start center"
            activator="#fromDate"
            :close-on-content-click="false"
          >
            <v-date-picker
              v-model="model.fromDate"
              hide-header
              show-adjacent-months
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <label>Đến ngày</label>
          <v-text-field
            disabled
            id="toDate"
            variant="outlined"
            v-model="toDate"
            append-inner-icon="mdi-calendar"
            readonly
            class="mt-2"
            density="compact"
          ></v-text-field>
          <v-menu
            location="start center"
            activator="#toDate"
            :close-on-content-click="false"
          >
            <v-date-picker
              v-model="model.expired_date"
              hide-header
              show-adjacent-months
            >
              <v-spacer></v-spacer>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-item-group multiple class="flex">
        <v-row>
          <v-item v-slot="{ toggle, isSelected }">
            <v-col>
              <v-btn
                class="text-h6"
                variant="text"
                :prepend-icon="isSelected ? 'mdi-menu-up' : 'mdi-menu-down'"
                @click="toggle"
                >Phí dịch vụ:
                {{ formatNumberWithCommas(serviceFeeTotal) }}</v-btn
              >
              <v-col v-show="isSelected">
                <v-row
                  v-for="service in editServiceFees"
                  :key="service[serviceFeeStore.idField]"
                  class="edit-service mt-3"
                >
                  <v-col cols="3" class="mr-4"
                    >{{ service.service_type }} ({{
                      formatNumberWithCommas(service.fee_price)
                    }}/{{ service.price_unit == 4 ? "số" : "m³" }}):
                    {{
                      formatNumberWithCommas(
                        (service.newIndex ?? 0) - (service.oldIndex ?? 0) <= 0
                          ? 0
                          : (service.newIndex - service.oldIndex) *
                              service.fee_price
                      )
                    }}</v-col
                  >
                  <v-col cols="3">
                    <v-number-input
                      density="compact"
                      placeholder="Chỉ số cũ"
                      class="mr-4"
                      variant="outlined"
                      color="blue-lighten-3"
                      controlVariant=""
                      type="number"
                      :min="0"
                      :reverse="false"
                      :inset="false"
                      :hide-spin-buttons="true"
                      hide-details
                      v-model="service.oldIndex"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-number-input
                      density="compact"
                      placeholder="Chỉ số mới"
                      variant="outlined"
                      controlVariant=""
                      type="number"
                      color="blue-lighten-3"
                      :reverse="false"
                      :inset="false"
                      :min="0"
                      hide-details
                      :hide-spin-buttons="true"
                      v-model="service.newIndex"
                    />
                  </v-col>
                </v-row>
                <v-data-table-virtual
                  v-if="viewServiceFees.length > 0"
                  :fixed-header="true"
                  no-data-text="Không có dữ liệu"
                  :headers="serviceHeaders"
                  :items="viewServiceFees"
                  :height="212"
                />
              </v-col>
            </v-col>
          </v-item>
        </v-row>
        <v-row v-if="model.vehicles?.length" class="mt-4">
          <v-item v-slot="{ toggle, isSelected }">
            <v-btn
              class="text-h6"
              variant="text"
              :prepend-icon="isSelected ? 'mdi-menu-up' : 'mdi-menu-down'"
              @click="toggle"
              >Phí gửi xe: {{ formatNumberWithCommas(vehicleFeeTotal) }}</v-btn
            >
            <v-data-table-virtual
              v-show="isSelected"
              :fixed-header="true"
              no-data-text="Không có dữ liệu"
              :headers="vehicleHeaders"
              :items="model.vehicles"
              :height="212"
            />
          </v-item>
        </v-row>
      </v-item-group>
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
import { useFeeDetail } from "./feeDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";

export default {
  extends: BaseDetail,
  name: "FeeDetail",
  components: {},
  setup() {
    const resource = useFeeDetail();
    return resource;
  },
};
</script>

<style lang="scss">
.fee-detail {
  .title_left {
    display: flex;
    align-items: center;
  }

  .modal-content {
    display: flex;
    flex-direction: column;

    .modal_content {
      flex: 1;
      max-height: calc(100vh - 40px - 38px - 36px);

      .v-item-group {
        max-height: 100%;
        overflow-y: auto;

        .edit-service {
          align-items: center;
        }
      }
    }

    .v-btn--size-default {
      padding: unset;
    }
    .v-row {
      flex: unset;
    }
  }
}
</style>