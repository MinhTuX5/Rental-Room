<template>
  <v-col class="post-detail-popup">
    <v-sheet class="text-h4 mb-4">Đăng tin mới</v-sheet>
    <v-sheet>
      <v-sheet class="text-h5 mb-4">Địa chỉ cho thuê</v-sheet>
      <v-row align="center">
        <v-col
          v-for="item in addressInfo"
          :key="item.label"
          cols="3"
          align-self="center"
        >
          <v-combobox :label="item.label" :items="item.items"></v-combobox>
        </v-col>
      </v-row>
      <v-col cols="3">
        <v-text-field label="Số nhà"></v-text-field>
      </v-col>
    </v-sheet>
    <v-sheet>
      <v-sheet class="text-h5 mb-4">Địa chỉ chính xác</v-sheet>
      <v-text-field variant="outlined" disabled></v-text-field>
    </v-sheet>
    <v-sheet>
      <v-sheet class="text-h5 mb-4">Thông tin mô tả</v-sheet>
      <v-sheet>
        <v-sheet class="text-h6 mb-4">Tiêu đề bài đăng*</v-sheet>
        <v-text-field></v-text-field>
      </v-sheet>
      <v-row>
        <v-col cols="6">
          <normal-input label="Giá" :required="true"></normal-input>
        </v-col>
        <v-col cols="6">
          <normal-input label="Diện tích" :required="true"></normal-input>
        </v-col>
      </v-row>
      <!-- Filter -->
      <v-row>
        <v-col
          v-for="(filter, index) in roomSearchCommon.filters"
          :key="index"
          cols="3"
        >
          <h3>{{ filter.label }}</h3>
          <ul>
            <li v-for="item in filter.children" :key="item.label">
              <v-checkbox
                :label="item.label"
                hide-details
                color="success"
                density="compact"
              ></v-checkbox>
            </li>
          </ul>
        </v-col>
      </v-row>
      <!-- Đối tượng cho thuê -->
      <v-row>
        <v-col cols="6">
          <normal-input
            label="Đối tượng cho thuê"
            control-type="combobox"
            :items="genders"
          ></normal-input>
        </v-col>
      </v-row>
      <!-- Mô tả thêm -->
      <normal-input label="Mô tả thêm" control-type="textarea"></normal-input>
      <!-- Hình ảnh -->
      <v-file-input
        :rules="imageRules"
        label="Chọn hình ảnh miêu tả phòng trọ"
        prepend-icon="mdi-camera"
        variant="filled"
        :accept="validImageTypes"
        show-size
      ></v-file-input>
      <!-- Video -->
      <normal-input
        label="Video"
        labelIn="Đường dẫn video từ youtube"
      ></normal-input>
    </v-sheet>
  </v-col>
  <v-row>
    <v-col cols="6" class="d-flex justify-center">
      <v-btn color="light-blue-accent-4" class="mb-4">Lưu</v-btn>
    </v-col>
    <v-col cols="6" class="d-flex justify-center">
      <v-btn color="green-lighten-1" class="mb-4">Đăng bài</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { usePostDetailPopup } from "./postDetailPopup.js";
import NormalInput from "@/components/views/VControl.vue";

export default {
  name: "PostDetailPopup",
  components: {
    NormalInput,
  },
  setup() {
    const resource = usePostDetailPopup();
    return resource;
  },
};
</script>

<style lang="scss" scoped>
@import "./PostDetailPopup.scss";
</style>