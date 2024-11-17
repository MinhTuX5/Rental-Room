<template>
  <v-container>
    <v-row align="center">
      <v-col
        v-for="searchItem in searchConfig"
        :key="searchItem.label"
        cols="2"
        align-self="center"
      >
        <v-combobox
          label="Loại nhà đất"
          :items="searchItem.items"
          hide-details
        ></v-combobox>
      </v-col>
      <v-col cols="2">
        <v-btn color="#42b983">Tìm kiếm</v-btn>
      </v-col>
    </v-row>
    <v-col>
      <v-sheet align="center">
        <h1>Cho Thuê Phòng Trọ, Thuê Nhà Trọ Giá Rẻ, Chính Chủ</h1>
      </v-sheet>
      <v-sheet align="center"
        >Cho thuê phòng trọ, nhà trọ giá rẻ hàng đầu Việt Nam - Cập nhật thông
        tin cho thuê phòng trọ nhanh chóng, chính xác, thông tin xác
        thực.</v-sheet
      >
    </v-col>
    <v-col>
      <v-sheet>
        <h2>Khu vực nổi bật</h2>
      </v-sheet>
      <v-row align-content="space-around">
        <v-col v-for="item in popularPlaces" :key="item.location">
          <h3 class="text-center">{{ item.location }}</h3>
          <v-img aspect-ratio="16/9" cover :src="item.image"></v-img>
        </v-col>
      </v-row>
    </v-col>
    <v-row class="mt-2">
      <v-col cols="9" class="border-thin pa-4">
        <h3>Tổng {{ postDetails?.length ?? 0 }} kết quả</h3>
        <v-sheet class="d-flex align-center">
          <h3 class="mr-1">Sắp xếp:</h3>
          <span class="mr-4">Mới nhất</span>
          <span class="mr-4">Giá cả</span>
          <span>Số lượng tương tác</span>
        </v-sheet>
        <post-overview
          v-for="(item, index) in postDetails"
          :key="index"
          :item="item"
        ></post-overview>
        <v-pagination
          v-model="page"
          :length="pageTotal"
          :total-visible="10"
        ></v-pagination>
      </v-col>
      <v-col class="border-thin ml-2">
        <h2>Lọc</h2>
        <v-sheet
          v-for="(filter, index) in roomSearchCommon.filters"
          :key="index"
          cols="3"
          class="mt-4"
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
        </v-sheet>
      </v-col>
    </v-row>
    <v-row class="border-thin why" align="center">
      <v-sheet>Tại sao lại chọn TimNhaTroViet.com?</v-sheet>
      <v-sheet
        >Chúng tôi biết bạn có rất nhiều lựa chọn, nhưng TimNhaTroViet.com tự
        hào là trang web đứng top google về các từ khóa: cho thuê phòng trọ, nhà
        trọ, thuê nhà nguyên căn, cho thuê căn hộ, tìm người ở ghép, cho thuê
        mặt bằng...Vì vậy tin của bạn đăng trên website sẽ tiếp cận được với
        nhiều khách hàng hơn, do đó giao dịch nhanh hơn, tiết kiệm chi phí
        hơn</v-sheet
      >
      <v-sheet class="d-flex justify-space-between">
        <v-sheet class="d-flex flex-column">
          <h4>Thành viên</h4>
          <span>116.998+</span>
        </v-sheet>
        <v-sheet class="d-flex flex-column">
          <h4>Tin đăng</h4>
          <span>103.348+</span>
        </v-sheet>
        <v-sheet class="d-flex flex-column">
          <h4>Lượt truy cập/tháng</h4>
          <span>300000</span>
        </v-sheet>
        <v-sheet class="d-flex flex-column">
          <h4>Lượt xem/tháng</h4>
          <span>2.500.000+</span>
        </v-sheet>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
import { useMainView } from "./mainView";
import PostOverview from "@/components/views/PostOverview.vue";

export default {
  name: "RoomSearchView",
  components: {
    PostOverview,
  },
  setup() {
    console.log(1);
    
    const mainView = useMainView();
    return mainView;
  },
};
</script>

<style lang="scss" scoped>
.why {
  .v-sheet {
    width: 100%;
    text-align: center;
  }
}
</style>