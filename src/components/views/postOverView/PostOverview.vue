<template>
  <v-sheet
    class="post-over-view d-flex align-center border-thin position-relative align-stretch"
  >
    <!-- Heart -->
    <v-icon
      v-show="isShowLikeIcon && !item.favorite_post_id"
      icon="mdi-heart-outline"
      class="position-absolute top-0 right-0 pa-4 cursor-pointer"
      @click="likePost(item)"
    ></v-icon>
    <v-icon
      v-show="isShowLikeIcon && item.favorite_post_id"
      icon="mdi-heart"
      class="position-absolute top-0 right-0 pa-4 cursor-pointer"
      :color="'red'"
      @click="likePost(item)"
    ></v-icon>
    <!-- Avatar -->
    <v-col :cols="imageCols" align-self="center" @click="onClickItem">
      <v-img :src="item.images?.split(',')?.[0]" :aspect-ratio="1"></v-img>
    </v-col>
    <v-col
      :cols="isShowFeatureBtn ? 12 - imageCols - 2 : 12 - imageCols"
      class="pa-2"
    >
      <v-sheet class="d-flex">
        <!-- Title -->
        <span
          class="text-h7 text-limit text-no-wrap text-blue cursor-pointer mr-4"
          @click="viewDetail"
        >
          {{ item.post_title }}
        </span>
      </v-sheet>
      <v-sheet class="flex-column" @click="onClickItem">
        <v-sheet class="d-flex mt-2 info">
          <v-sheet class="d-flex align-center mr-8">
            <v-icon icon="mdi-cash" v-tooltip="'Giá thuê'"></v-icon>
            <span
              >{{ formatNumberWithCommas(item.room_price) }} đồng/tháng</span
            >
          </v-sheet>
          <v-sheet class="d-flex align-center mr-8">
            <v-icon icon="mdi-home" v-tooltip="'Diện tích'"></v-icon>
            <span>{{ item.room_area }} m²</span>
          </v-sheet>
          <v-sheet class="d-flex align-center">
            <v-icon icon="mdi-calendar-clock" v-tooltip="'Ngày đăng'"></v-icon>
            <!-- HH => 24h, hh => 12h -->
            <span>{{
              moment(item.posted_date).format("HH:mm DD/MM/YYYY")
            }}</span>
          </v-sheet>
        </v-sheet>
        <v-sheet class="d-flex mt-2">
          <v-icon icon="mdi-map-marker-outline" color="red"></v-icon>
          <span class="text-limit text-no-wrap" v-tooltip="item.room_address">{{
            item.room_address
          }}</span>
        </v-sheet>
        <v-sheet v-if="item.room_description" class="d-flex align-start mt-2">
          <v-icon icon="mdi-text-account" class="mr-1" />
          <span
            class="text-limit text-no-wrap"
            v-tooltip="item.room_description"
            >{{ item.room_description }}</span
          >
        </v-sheet>
      </v-sheet>
      <!-- Detail info -->
    </v-col>
    <v-col v-if="isShowFeatureBtn" cols="2" class="d-flex justify-end">
      <v-sheet class="d-flex flex-column justify-center align-center">
        <v-btn
          v-if="displayedBtns.includes(featureBtns.Delete)"
          prepend-icon="mdi-trash-can-outline"
          color="red"
          class="w-fit-content"
          @click="showDeleteDialog"
          >Xóa</v-btn
        >
        <v-btn
          v-if="displayedBtns.includes(featureBtns.Post)"
          prepend-icon="mdi-post-outline"
          class="w-fit-content"
          color="blue-accent-1"
          >Đăng bài</v-btn
        >
        <v-btn
          v-if="displayedBtns.includes(featureBtns.Hide)"
          prepend-icon="mdi-eye-off-outline"
          class="w-fit-content"
          >Ẩn bài đăng</v-btn
        >
      </v-sheet>
    </v-col>
  </v-sheet>
  <v-dialog v-model="showDialog" width="auto">
    <v-card
      width="500"
      :prepend-icon="dialogConfig.icon"
      :title="dialogConfig.title"
      :text="dialogConfig.text"
    >
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          color="red"
          text="Xóa"
          @click="deletePost"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";
// resources
import { usePostOverview } from "./postOverview";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    isShowLikeIcon: {
      type: Boolean,
      default: true,
    },
    isShowFeatureBtn: {
      type: Boolean,
      default: false,
    },
    displayedBtns: {
      type: Array,
      default: () => [],
    },
    detailPageName: {
      type: String,
      default: "PostDetail",
    },
    imageCols: {
      type: Number,
      default: 2,
    },
  },
  setup() {
    const resource = usePostOverview();
    return {
      ...resource,
      moment,
    };
  },
};
</script>

<style lang="scss">
.post-over-view {
  margin-bottom: 8px;

  .v-btn {
    & + .v-btn {
      margin-top: 16px;
    }
  }

  .limit-2-line {
    white-space: nowrap;
  }

  .info {
    .v-icon {
      margin-right: 4px;
    }
  }

  @media screen and (min-width: 1920px) {
    .limit-2-line {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      white-space: wrap;
    }
  }
}
</style>