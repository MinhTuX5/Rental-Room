<template>
  <v-sheet
    class="d-flex align-center border-thin mt-2 position-relative align-stretch"
  >
    <!-- Heart -->
    <v-icon
      v-if="!item.is_liked"
      icon="mdi-heart-outline"
      class="position-absolute top-0 right-0 pa-4 cursor-pointer"
    ></v-icon>
    <v-icon
      v-else
      icon="mdi-heart"
      class="position-absolute top-0 right-0 pa-4 cursor-pointer"
      :color="'red'"
    ></v-icon>
    <!-- Avatar -->
    <v-col cols="3" align-self="center">
      <v-img
        cover
        src="https://images.cenhomes.vn/2020/03/1585033152-can-ho-mau-eurowindow-river-park.jpg"
      ></v-img>
    </v-col>
    <v-col cols="9">
      <!-- Title -->
      <router-link :to="{ name: 'PostDetail' }" class="text-decoration-none">
        <v-sheet
          class="text-h6 d-webkit-box text-limit text-line-clamp-2 text-blue"
        >
          {{ item.title }}
        </v-sheet>
      </router-link>
      <!-- Detail info -->
      <v-sheet class="d-flex justify-space-between mt-2">
        <v-sheet class="d-flex">
          <v-sheet class="d-flex align-center mr-2">
            <v-icon icon="mdi-cash" color="green"></v-icon>
            <span>{{ item.price }} đồng/tháng</span>
          </v-sheet>
          <v-sheet class="d-flex align-center mr-2">
            <v-icon icon="mdi-home" v-tooltip="'Diện tích'"></v-icon>
            <span>{{ item.area }} m²</span>
          </v-sheet>
        </v-sheet>
        <v-sheet class="d-flex">
          <v-sheet class="d-flex align-center mr-2">
            <v-icon icon="mdi-account-tie" v-tooltip="'Người đăng'"></v-icon>
            <span>{{ item.author }}</span>
          </v-sheet>
          <v-sheet class="d-flex align-center">
            <v-icon
              icon="mdi-calendar-clock"
              v-tooltip="'Ngày đăng'"
              color="blue"
            ></v-icon>
            <span>{{ moment(item.posting_date).format("DD/MM/YYYY") }}</span>
          </v-sheet>
        </v-sheet>
      </v-sheet>
      <v-sheet class="d-flex mt-2">
        <v-icon icon="mdi-map-marker-outline" color="red"></v-icon>
        <span class="text-limit text-no-wrap" v-tooltip="item.address">{{
          item.address
        }}</span>
      </v-sheet>
      <v-sheet class="d-flex align-start mt-2">
        <v-icon icon="mdi-text-account" class="mr-1" />
        <span class="text-limit limit-2-line" v-tooltip="item.description">{{
          item.description
        }}</span>
      </v-sheet>

      <!-- More info -->
    </v-col>
  </v-sheet>
</template>

<script>
import moment from "moment";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      moment,
    };
  },
};
</script>

<style lang="scss" scoped>
.limit-2-line {
  white-space: nowrap;
}

@media screen and (min-width: 1920px) {
  .limit-2-line {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: wrap;
  }
}
</style>