<template>
  <v-container class="post-detail-popup">
    <v-col>
      <v-sheet class="text-h4 mb-4">{{ title }}</v-sheet>
      <v-sheet class="mb-4 w-50">
        <v-sheet class="text-h5 mb-4">Loại nhà đất</v-sheet>
        <v-select
          density="compact"
          :items="roomCategories"
          hide-details
          v-model="roomCategory"
        ></v-select>
      </v-sheet>
      <v-sheet>
        <v-sheet class="text-h5 mb-4">Địa chỉ cho thuê</v-sheet>
        <v-row align="center" class="address">
          <v-col
            v-for="item in addressInfo"
            :key="item.label"
            align-self="center"
          >
            <v-autocomplete
              density="compact"
              :auto-select-first="true"
              :no-data-text="item.noDataText"
              :label="item.label"
              :items="item.items"
              :autofocus="item.autofocus"
              :disabled="viewing"
              @update:modelValue="onSelectLocation($event, item.locationType)"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <!-- 02 -->
        <v-row class="address">
          <v-col>
            <v-text-field
              label="Đường/Phố"
              density="compact"
              :disabled="viewing"
              @update:modelValue="updateLocationParts($event, 2)"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Số nhà"
              density="compact"
              :disabled="viewing"
              @update:modelValue="updateLocationParts($event, 1)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-sheet>
      <v-sheet class="mb-4">
        <v-sheet class="text-h5 mb-4">Địa chỉ chính xác</v-sheet>
        <v-text-field
          variant="outlined"
          density="compact"
          disabled
          :hide-details="true"
          v-model="roomAddress"
        ></v-text-field>
      </v-sheet>
      <v-sheet class="room-description">
        <v-sheet class="text-h5 mb-4">Thông tin mô tả</v-sheet>
        <v-sheet>
          <v-sheet class="text-h6 mb-2"
            >Tiêu đề bài đăng <span>*</span></v-sheet
          >
          <v-text-field
            v-model="model.post_title"
            :counter="255"
            :disabled="viewing"
          ></v-text-field>
        </v-sheet>
        <v-row>
          <v-col cols="6">
            <label class="text-h6 mb-2"
              >Giá cho thuê <span class="required">*</span></label
            >
            <v-row>
              <v-col cols="7">
                <v-text-field
                  :maxlength="16"
                  :required="true"
                  :disabled="viewing"
                  v-model="roomPrice"
                  @input="formatAmount"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-combobox
                  label="Đơn vị"
                  :auto-select-first="true"
                  :disabled="viewing"
                  :items="unitList"
                  v-model="priceUnit"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <label class="text-h6 mb-2"
              >Số phòng ngủ <span class="required">*</span></label
            >
            <v-number-input
              controlVariant="stacked"
              :reverse="false"
              :inset="false"
              :disabled="viewing"
              v-model="model.no_of_bed_rooms"
              :min="1"
            ></v-number-input>
          </v-col>
          <v-col>
            <label class="text-h6 mb-2"
              >Diện tích <span class="required">*</span></label
            >
            <v-number-input
              controlVariant="stacked"
              :reverse="false"
              :inset="false"
              :disabled="viewing"
              v-model="model.room_area"
            ></v-number-input>
          </v-col>
        </v-row>
        <!-- Filter -->
        <v-row>
          <v-col
            v-for="(filter, index) in roomSearchCommon.filters"
            :key="index"
          >
            <h4>{{ filter.label }}</h4>
            <ul>
              <li v-for="item in filter.children" :key="item.label">
                <v-checkbox
                  color="success"
                  density="compact"
                  hide-details
                  :disabled="viewing"
                  :label="item.label"
                  :value="item.value"
                  v-model="roomCharacteristic"
                ></v-checkbox>
              </li>
            </ul>
          </v-col>
        </v-row>
        <!-- Đối tượng cho thuê -->
        <v-row>
          <v-col>
            <label class="text-h6 mb-2">Đối tượng cho thuê</label>
            <v-radio-group
              class="gender"
              v-model="model.room_gender"
              inline
              :disabled="viewing"
            >
              <v-radio label="Tất cả" :value="0"></v-radio>
              <v-radio label="Nam" :value="1"></v-radio>
              <v-radio label="Nữ" :value="2"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col>
            <label class="text-h6 mb-2">Giới hạn số người ở</label>
            <v-number-input
              controlVariant="stacked"
              :reverse="false"
              :inset="false"
              :min="0"
              v-model="model.room_people_limit"
            ></v-number-input>
          </v-col>
          <v-col>
            <label class="text-h6 mb-2">Giới hạn số xe</label>
            <v-number-input
              controlVariant="stacked"
              :reverse="false"
              :inset="false"
              :min="0"
              v-model="model.room_vehicle_limit"
            ></v-number-input>
          </v-col>
        </v-row>
        <!-- Mô tả thêm -->
        <v-textarea
          label="Mô tả thêm"
          v-model="model.room_description"
        ></v-textarea>
        <!-- Hình ảnh -->
        <v-file-input
          :rules="imageRules"
          label="Chọn hình ảnh miêu tả phòng trọ"
          prepend-icon="mdi-camera"
          variant="filled"
          show-size
          :disabled="viewing"
          :accept="validImageTypes"
        ></v-file-input>
      </v-sheet>
    </v-col>
    <v-row>
      <v-col cols="6" class="d-flex justify-center">
        <v-btn color="light-blue-accent-4" @click="submitPopup(false)"
          >Lưu</v-btn
        >
      </v-col>
      <v-col cols="6" class="d-flex justify-center">
        <v-btn color="green-lighten-1" @click="submitPopup(true)"
          >Đăng bài</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// base
import baseDetail from "@/views/base/baseDetail.js";
// resources
import { usePostDetailPopup } from "./postDetailPopup.js";
// components
import NormalInput from "@/components/views/VControl.vue";
import { VNumberInput } from "vuetify/labs/VNumberInput";

export default {
  name: "PostDetailPopup",
  extends: baseDetail,
  components: {
    NormalInput,
    VNumberInput,
  },
  setup() {
    const resource = usePostDetailPopup();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./PostDetailPopup.scss";
</style>