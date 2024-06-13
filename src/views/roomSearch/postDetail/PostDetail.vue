<template>
  <v-container class="post-detail">
    <v-col cols="9">
      <v-sheet>
        <v-img
          cover
          src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        ></v-img>
      </v-sheet>
      <v-sheet>
        <h1>Phòng trọ Hoàng Hoa Thám</h1>
      </v-sheet>
      <v-sheet class="d-flex flex-column">
        <span>Địa chỉ: {{ model.address }}</span>
        <span>Giá: {{ model.price / 10 ** 6 }} triệu/tháng</span>
        <span
          >Diện tích: {{ model.area }} {{ superscriptCharacters.Squared }}</span
        >
        <span>Số phòng ngủ: {{ model.noOfBedrooms }}</span>
        <span
          >Ngày đăng: {{ moment(model.posted_date).format("DD/MM/YYYY") }}</span
        >
      </v-sheet>
      <v-row class="filters">
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
      <v-sheet>
        <h3>Mô tả thêm</h3>
        <p>{{ model.description }}</p>
      </v-sheet>
      <v-sheet>
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
      <v-row justify="space-between" class="mt-4">
        <v-btn variant="outlined" color="red-darken-1">Yêu thích</v-btn>
        <v-btn variant="outlined" color="blue-darken-1">Chia sẻ</v-btn>
        <v-btn variant="outlined" color="green-darken-1">Đặt lịch</v-btn>
        <v-btn variant="outlined">Báo cáo vi phạm</v-btn>
      </v-row>
    </v-col>
    <v-col></v-col>
  </v-container>
</template>

<script>
import { usePostDetail } from "./postDetail.js";

export default {
  name: "PostDetail",
  setup() {
    const resource = usePostDetail();
    return resource;
  },
};
</script>

<style lang="scss">
@import "./PostDetail";
</style>