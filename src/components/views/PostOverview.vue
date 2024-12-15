<template>
  <v-sheet
    class="d-flex align-center border-thin mt-2 position-relative align-stretch"
  >
    <!-- Heart -->
    <v-icon
      v-if="!item.favorite_post_id"
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
      <v-sheet class="d-flex">
        <!-- Title -->
        <v-span
          class="text-h7 text-limit text-no-wrap text-blue cursor-pointer mr-4"
          @click="viewDetail"
        >
          {{ item.post_title }}
        </v-span>
      </v-sheet>
      <!-- Detail info -->
      <v-sheet class="d-flex justify-space-between mt-2 info">
        <v-sheet class="d-flex align-center mr-2">
          <v-icon icon="mdi-cash" color="green" v-tooltip="'Giá thuê'"></v-icon>
          <span>{{ item.room_price }} đồng/tháng</span>
        </v-sheet>
        <v-sheet class="d-flex align-center mr-2">
          <v-icon icon="mdi-home" v-tooltip="'Diện tích'"></v-icon>
          <span>{{ item.room_area }} m²</span>
        </v-sheet>
        <v-sheet class="d-flex align-center mr-2">
          <v-icon icon="mdi-account-tie" v-tooltip="'Người đăng'"></v-icon>
          <span>{{ item.post_author }}</span>
        </v-sheet>
        <v-sheet class="d-flex align-center">
          <v-icon
            icon="mdi-calendar-clock"
            v-tooltip="'Ngày đăng'"
            color="blue"
          ></v-icon>
          <span>{{ moment(item.posted_date).format("DD/MM/YYYY") }}</span>
        </v-sheet>
      </v-sheet>
      <v-sheet class="d-flex mt-2">
        <v-icon icon="mdi-map-marker-outline" color="red"></v-icon>
        <span class="text-limit text-no-wrap" v-tooltip="item.room_address">{{
          item.room_address
        }}</span>
      </v-sheet>
      <v-sheet class="d-flex align-start mt-2">
        <v-icon icon="mdi-text-account" class="mr-1" />
        <span class="text-limit limit-2-line" v-tooltip="item.description">{{
          item.room_description
        }}</span>
      </v-sheet>

      <!-- More info -->
    </v-col>
  </v-sheet>
</template>

<script>
import moment from "moment";
import { getCurrentInstance, onMounted } from "vue";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { proxy } = getCurrentInstance();

    const viewDetail = () => {
      const me = proxy;
      me.$router.push({
        name: "PostDetail",
        params: { id: me.$props.item.room_post_id },
      });
    };

    return {
      moment,
      viewDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
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
</style>