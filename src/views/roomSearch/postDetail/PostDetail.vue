<template>
  <v-container class="post-detail d-flex">
    <v-col cols="9" class="pa-0 mr-4">
      <v-sheet class="mb-4">
        <v-carousel show-arrows="hover" :height="300">
          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/hotel.jpg"
            cover
          ></v-carousel-item>

          <v-carousel-item
            src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
            cover
          ></v-carousel-item>
        </v-carousel>
      </v-sheet>

      <v-sheet class="d-flex flex-column mb-4">
        <h2 :style="{ fontFamily: 'Lexend Medium,Roboto,Arial' }">
          {{ model.post_title }}
        </h2>
        <div class="d-flex align-center">
          <v-icon icon="mdi-map-marker-outline" color="red"></v-icon>
          <span class="sub-title">{{ model.room_address }}</span>
        </div>
      </v-sheet>

      <v-sheet class="d-flex justify-space-between align-center">
        <v-sheet class="d-flex room-info mb-1">
          <div class="d-flex flex-column info-item">
            <span class="title text-center">Mức giá</span>
            <span class="info"
              >{{ model.room_price / 10 ** 6 }} triệu/tháng</span
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
            <span class="title text-center">Ngày đăng</span>
            <span class="info">{{
              moment(model.posted_date).format("DD/MM/YYYY")
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

      <v-row class="filters mb-1">
        <v-col v-for="(filter, index) in filters" :key="index" cols="3">
          <h3>{{ filter.label }}</h3>
          <ul>
            <li v-for="item in filter.children" :key="item.label">
              <v-checkbox
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

      <v-sheet class="mb-4">
        <h3>Mô tả thêm</h3>
        <v-textarea label="" :model-value="model.room_description" auto-grow>
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

        <div class="text-h6 mt-2">Nguyễn Hồng Điệp</div>

        <div class="mt-4 w-100">Số điện thoại 1: 0963689218</div>
        <div class="mt-2 w-100">Số điện thoại 2: 0963689218</div>

        <div class="mt-4 w-100">Zalo: 0963689218</div>
        <div class="mt-2 cursor-pointer w-100">
          <a href="https://www.facebook.com/" target="_blank">Facebook</a>
        </div>
      </v-card>
      <v-row class="d-flex">
        <v-btn
          class="mt-4 flex-fill mr-4"
          color="green"
          prepend-icon="mdi-check"
          >Phê duyệt</v-btn
        >
        <v-btn
          class="mt-4 flex-fill"
          color="red"
          prepend-icon="mdi-window-close"
          >Từ chối</v-btn
        >
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import { usePostDetail } from "./postDetail.js";
// base
import baseView from "@/views/base/baseView";

export default {
  name: "PostDetail",
  extends: baseView,
  setup() {
    const resource = usePostDetail();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./PostDetail";
</style>