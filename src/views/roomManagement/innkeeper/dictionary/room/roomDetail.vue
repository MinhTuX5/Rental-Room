<template>
  <t-dynamic-popup
    :title="title"
    :width="800"
    name="RoomDetail"
    class="room-detail"
    @before-open="beforeOpen"
    @opened="opened"
  >
    <!-- Nội dung popup -->
    <template #content>
      <v-row>
        <v-col>
          <label> Mã phòng </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Nhập mã loại phòng"
            :autofocus="true"
            v-model="model[store.codeField]"
        /></v-col>
        <v-col class="ml-4">
          <label> Tên phòng </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Phòng 001, ..."
            v-model="model[store.nameField]"
          />
        </v-col>
        <v-col class="ml-4">
          <label> Loại phòng </label>
          <v-autocomplete
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :items="allRoomCategories"
            :item-title="roomCategoryStore.nameField"
            :item-value="roomCategoryStore.idField"
            v-model="model[roomCategoryStore.idField]"
            @update:modelValue="onSelectRoomCategory"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <label> Vị trí phòng </label>
          <v-text-field
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            placeholder="Tầng 2 bên phải cầu thang máy ..."
            v-model="model.room_position"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="5">
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
        <v-col class="ml-4">
          <label>Diện tích</label>
          <v-number-input
            class="mt-2 hide-spin-buttons"
            variant="outlined"
            controlVariant=""
            type="number"
            :reverse="false"
            :inset="false"
            :min="0"
            :hide-spin-buttons="true"
            suffix="m²"
            v-model="model.room_area"
          ></v-number-input>
        </v-col>
        <v-col class="ml-4">
          <label>Số phòng ngủ</label>
          <v-number-input
            class="mt-2"
            variant="outlined"
            controlVariant="stacked"
            :reverse="false"
            :inset="true"
            :min="0"
            v-model="model.no_of_bed_rooms"
          ></v-number-input>
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
        <v-checkbox-btn
          label="Còn trống"
          color="blue"
          density="compact"
          v-model="model.is_empty"
        ></v-checkbox-btn>
      </div>
    </template>
  </t-dynamic-popup>
</template>

<script>
import { useRoomDetail } from "./roomDetail";
// base
import BaseDetail from "@/views/base/baseDetail.js";
// components
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";

export default {
  extends: BaseDetail,
  name: "RoomDetail",
  components: {
    TCurrencyInput,
  },
  setup() {
    const resource = useRoomDetail();
    return resource;
  },
};
</script>

<style lang="scss">
.room-detail {
  .v-col {
    padding: unset;
  }
}
</style>