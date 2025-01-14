<template>
  <v-container class="post-detail-popup">
    <v-form v-model="form">
      <v-col>
        <v-sheet class="mb-4 w-25">
          <v-sheet class="text-h5 mb-4">Loại nhà đất</v-sheet>
          <v-select
            density="compact"
            item-value="value"
            item-title="text"
            :items="roomCategories"
            hide-details
            v-model="model.room_type_id"
          ></v-select>
        </v-sheet>
        <!-- Địa chỉ cho thuê -->
        <v-sheet>
          <v-sheet class="text-h5 mb-4">Địa chỉ cho thuê</v-sheet>
          <v-row align="center" class="address mb-2">
            <v-col
              v-for="item in addressInfo"
              :key="item.label"
              align-self="center"
            >
              <v-autocomplete
                v-model="model[item.valueField]"
                density="compact"
                :auto-select-first="true"
                :no-data-text="item.noDataText"
                :label="item.label"
                :items="item.items"
                :item-value="locationStore.$state.idField"
                :item-title="locationStore.$state.nameField"
                :autofocus="item.autofocus"
                :rules="[rules.required]"
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
                v-model="model.street_name"
                @update:modelValue="updateLocationParts($event, 2)"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Số nhà"
                density="compact"
                :disabled="viewing"
                v-model="model.house_number"
                @update:modelValue="updateLocationParts($event, 1)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-sheet>
        <!-- Địa chỉ chính xác -->
        <v-sheet class="mb-4">
          <v-sheet class="text-h5 mb-4">Địa chỉ chính xác</v-sheet>
          <v-row class="d-flex align-center">
            <v-text-field
              :variant="allowEdit ? 'filled' : 'outlined'"
              density="compact"
              :disabled="!allowEdit"
              :hide-details="true"
              v-model="model.room_address"
            >
            </v-text-field>
            <v-sheet v-tooltip:bottom="'Chỉnh sửa'">
              <v-icon
                v-if="allowEdit"
                icon="mdi-pencil-outline cursor-pointer"
                class="ml-4"
                @click="toggleAllowEdit"
              />
              <v-icon
                v-else
                icon="mdi-pencil-off-outline cursor-pointer"
                class="ml-4"
                @click="toggleAllowEdit"
              />
            </v-sheet>
          </v-row>
        </v-sheet>
        <v-sheet class="room-description">
          <v-sheet class="text-h5 mb-4">Thông tin mô tả</v-sheet>
          <v-sheet>
            <v-sheet class="text-h6 mb-2"
              >Tiêu đề bài đăng <span class="required">*</span></v-sheet
            >
            <v-text-field
              :counter="255"
              count
              :rules="[rules.required, rules.max255]"
              v-model="model.post_title"
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
                  />
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
              <label class="text-h6 mb-2">Số phòng ngủ</label>
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
                class="hide-spin-buttons"
                controlVariant=""
                type="number"
                :reverse="false"
                :inset="false"
                :min="0"
                :hide-spin-buttons="true"
                suffix="m²"
                :rules="[rules.required, rules.min0]"
                v-model="model.room_area"
              ></v-number-input>
            </v-col>
          </v-row>
          <!-- Filter -->
          <v-row class="mb-4">
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
          <v-row>
            <!-- Đối tượng cho thuê -->
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
          <!-- :rules="imageRules" -->
          <v-file-input
            multiple
            label="Chọn các hình ảnh miêu tả cho phòng trọ"
            prepend-icon="mdi-camera"
            variant="filled"
            show-size
            :accept="validImageTypes"
          ></v-file-input>
        </v-sheet>
      </v-col>
      <v-row>
        <v-col cols="6" class="d-flex justify-center">
          <!-- Nếu không ngăn chặn sự kiện => submit sẽ thực hiện hành động mặc định của nó => tự điều hướng về màn hiện tại -->
          <v-btn
            color="light-blue-accent-4"
            type="submit"
            :disabled="!form"
            @click.prevent="submitPopup(false)"
            >Lưu</v-btn
          >
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <v-btn
            color="green-lighten-1"
            type="submit"
            :disabled="!form"
            @click.prevent="submitPopup(true)"
            >Đăng bài</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
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