<template>
  <v-container class="post-detail d-flex">
    <v-col cols="9" class="pa-0 mr-4">
      <v-sheet class="mb-4">
        <v-carousel v-if="imageLinks.length" show-arrows="hover" :height="300">
          <v-carousel-item
            v-for="(item, index) in imageLinks"
            :key="index"
            :src="item"
            cover
          ></v-carousel-item>
        </v-carousel>
      </v-sheet>

      <v-sheet class="d-flex flex-column mb-4">
        <h3 :style="{ fontFamily: 'Lexend Medium,Roboto,Arial' }">
          {{ model.post_title }}
          <span class="font-italic ml-2 font-weight-thin"
            >(Mã phòng: {{ model.post_code }})</span
          >
        </h3>
        <div class="d-flex align-center">
          <v-icon icon="mdi-map-marker-outline" color="red"></v-icon>
          <span class="sub-title">{{ model.room_address }}</span>
        </div>
      </v-sheet>

      <v-sheet class="d-flex justify-space-between align-center">
        <v-sheet class="d-flex room-info mb-1">
          <div class="d-flex flex-column info-item">
            <span class="title">Mức giá</span>
            <span class="info"
              >{{ formatNumberWithCommas(model.room_price) }} đồng/tháng</span
            >
          </div>
          <div class="d-flex flex-column info-item">
            <span class="title">Diện tích</span>
            <span class="info text-center">{{ model.room_area }} m²</span>
          </div>
          <div class="d-flex flex-column info-item">
            <span class="title">Số phòng ngủ</span>
            <span class="info text-center">{{ model.no_of_bed_rooms }}</span>
          </div>
          <div class="d-flex flex-column info-item">
            <span class="title">Giờ đăng</span>
            <span class="info">{{
              moment(model.posted_date).format("HH:mm DD/MM/YYYY")
            }}</span>
          </div>
        </v-sheet>
        <!-- Features -->
        <v-sheet v-if="!isFromAdmin" class="features">
          <v-btn
            color="red"
            :icon="model.favorite_post_id ? 'mdi-heart' : 'mdi-heart-outline'"
            variant="text"
            @click="likePost"
          ></v-btn>
          <v-btn
            color="blue"
            icon="mdi-share-variant-outline"
            variant="text"
          ></v-btn>
          <v-btn
            color="green"
            icon="mdi-calendar-month-outline"
            variant="text"
          ></v-btn>
        </v-sheet>
      </v-sheet>

      <v-row class="mt-4 room-info">
        <!-- Đối tượng cho thuê -->
        <v-col col="4" class="info-item d-flex flex-column">
          <span class="title">Đối tượng cho thuê</span>
          <span class="info">{{
            model.room_gender == 0
              ? "Tất cả"
              : model.room_gender == 1
              ? "Nam"
              : "Nữ"
          }}</span>
        </v-col>
        <v-col
          v-if="model.room_people_limit < 100"
          col="4"
          class="info-item d-flex flex-column"
        >
          <span class="title text-center">Giới hạn số lượng người thuê</span>
          <span class="info text-center">{{ model.room_people_limit }}</span>
        </v-col>
        <v-col
          v-if="model.room_vehicle_limit < 100"
          col="4"
          class="info-item d-flex flex-column"
        >
          <span class="title text-center">Giới hạn số lượng gửi xe</span>
          <span class="info text-center">{{ model.room_vehicle_limit }}</span>
        </v-col>
      </v-row>

      <v-row class="filters mb-1 mt-4">
        <v-col v-for="(filter, index) in filters" :key="index" cols="3">
          <h3>{{ filter.label }}</h3>
          <ul>
            <li v-for="item in filter.children" :key="item.label">
              <v-checkbox
                :class="{
                  'disable-custom': model.room_characteristic?.includes(
                    item.value
                  ),
                }"
                :label="item.label"
                hide-details
                color="success"
                density="compact"
                v-model="model.room_characteristic"
                :value="item.value"
                :disabled="true"
              ></v-checkbox>
            </li>
          </ul>
        </v-col>
      </v-row>

      <v-sheet v-if="model.room_description" class="mb-4">
        <h3>Mô tả thêm</h3>
        <v-textarea
          label=""
          :model-value="model.room_description"
          auto-grow
          readonly
        >
        </v-textarea>
      </v-sheet>

      <v-sheet v-if="!isFromAdmin">
        <h3>Bản đồ</h3>
        <p>Địa chỉ: {{ model.address }}</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.556457655514!2d105.80586997423868!3d21.010409488410495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9fccbb62d5%3A0x37afd3ab0ac9ee12!2zMjUgTmcuIDEzOSDEkC4gTmd1eeG7hW4gTmfhu41jIFbFqSwgVHJ1bmcgSG_DoCwgQ-G6p3UgR2nhuqV5LCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1717952649469!5m2!1svi!2s"
          width="600"
          height="450"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </v-sheet>
    </v-col>
    <!-- Thông tin người đăng -->
    <v-col class="d-flex flex-column align-center pa-0">
      <v-card class="d-flex flex-column align-center pa-4 w-100">
        <v-avatar
          image="https://picsum.photos/1920/1080?random"
          size="220"
        ></v-avatar>

        <div class="text-h6 mt-2">{{ model.user_name }}</div>

        <div v-if="model.phone_number" class="mt-4 w-100">
          Số điện thoại 1: {{ model.phone_number }}
        </div>
        <div v-if="model.second_phone_number" class="mt-2 w-100">
          Số điện thoại 2: {{ model.second_phone_number }}
        </div>

        <div v-if="model.user_zalo" class="mt-4 w-100">
          Zalo: {{ model.user_zalo }}
        </div>
        <div v-if="model.user_facebook" class="mt-2 w-100">
          <span>Facebook: </span>
          <a
            :href="model.user_facebook"
            target="_blank"
            class="cursor-pointer"
            >{{
              model.user_facebook?.replace("https://www.facebook.com/", "")
            }}</a
          >
        </div>
      </v-card>
      <v-row v-if="isFromAdmin" class="d-flex mt-4 flex-column">
        <v-btn
          color="green"
          prepend-icon="mdi-check"
          class="fill-flex mb-4"
          @click="approve"
          >Phê duyệt</v-btn
        >
        <v-btn color="red" prepend-icon="mdi-window-close" @click="reject"
          >Từ chối</v-btn
        >
      </v-row>
    </v-col>
  </v-container>
  <v-dialog v-model="showDialog" width="auto">
    <v-card
      :width="400"
      :prepend-icon="'mdi-image-remove-outline'"
      :title="'Từ chối bài đăng'"
      text="Lý do từ chối sẽ được thông báo đến người dùng"
    >
      <v-card-item>
        <v-row>
          <v-text-field
            clearable
            label="Lý do từ chối"
            class="mt-2"
            variant="outlined"
            color="blue-lighten-3"
            :autofocus="true"
            v-model="rejectMessage"
          />
        </v-row>
      </v-card-item>
      <template v-slot:actions>
        <v-btn
          :disabled="!rejectMessage"
          class="ms-auto"
          :text="'Từ chối'"
          color="orange-lighten-2"
          @click="onSubmitDialog"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatNumberWithCommas } from "../../../common/commonFunction.js";
import { usePostDetail } from "./postDetail.js";
// base
import baseView from "@/views/base/baseView";

export default {
  name: "PostDetail",
  extends: baseView,
  setup() {
    const resource = usePostDetail();
    return { ...resource, formatNumberWithCommas };
  },
};
</script>

<style lang="scss">
@import "./PostDetail";
</style>