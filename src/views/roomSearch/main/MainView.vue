<template>
  <v-container class="main-view">
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
      <v-col id="list" cols="9" class="border-thin pa-4">
        <h3>Tổng {{ totalCount ?? 0 }} kết quả</h3>
        <v-sheet class="d-flex align-center">
          <h3 class="mr-1">Sắp xếp:</h3>
          <span class="mr-4">Mới nhất</span>
          <span class="mr-4">Giá cả</span>
          <span>Số lượng tương tác</span>
        </v-sheet>
        <v-virtual-scroll
          v-if="postDetails.length"
          ref="virtualScroll"
          :items="postDetails"
          :height="$refs.filter?.$el.clientHeight"
        >
          <template #default="{ item }">
            <post-overview
              :key="item.room_post_id"
              :item="item"
              class="mb-1"
              @onClickItem="scrollToIndex(item.sort_order)"
            />
          </template>
        </v-virtual-scroll>
        <v-empty-state
          v-else
          text="Không tìm thấy bài đăng!"
          image="/src/assets/imgs/common/empty.png"
        ></v-empty-state>
        <v-row>
          <v-col class="d-flex align-center">
            <v-select
              label="Số bài mỗi trang"
              density="compact"
              :items="[10, 20, 50]"
              hide-details
              v-model="pageSize"
              @update:modelValue="changePage(1)"
            ></v-select>
          </v-col>
          <v-col>
            <v-pagination
              ref="pagination"
              v-model="pageIndex"
              :length="pageTotal"
              :total-visible="5"
              :showFirstLastPage="true"
              @update:modelValue="changePage"
            >
              <template #first="{ onClick, disabled }">
                <v-btn
                  icon
                  variant="text"
                  @click="onClick"
                  :disabled="disabled"
                >
                  <v-icon>mdi-chevron-double-left</v-icon>
                </v-btn>
              </template>
              <template #last="{ onClick, disabled }">
                <v-btn
                  icon
                  variant="text"
                  @click="onClick"
                  :disabled="disabled"
                >
                  <v-icon>mdi-chevron-double-right</v-icon>
                </v-btn>
              </template>
            </v-pagination>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="border-thin ml-2">
        <v-sheet class="d-flex flex-column justify-space-between">
          <v-sheet ref="filter" class="flex-column">
            <v-sheet v-for="(filter, index) in filters" :key="index" cols="3">
              <h3>{{ filter.label }}</h3>
              <ul>
                <li v-for="item in filter.children" :key="item.label">
                  <v-checkbox
                    hide-details
                    color="success"
                    density="compact"
                    :label="item.label"
                    :value="item.value"
                    v-model="filterVals"
                  ></v-checkbox>
                </li>
              </ul>
            </v-sheet>
          </v-sheet>
          <v-btn class="mt-4" color="blue-accent-1" @click="changePage(1)"
            >Tìm kiếm</v-btn
          >
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
// resources
import { useMainView } from "./mainView";
// components
import PostOverview from "@/components/views/postOverview/PostOverview.vue";
// base
import baseView from "@/views/base/baseView";

export default {
  name: "RoomSearchView",
  extends: baseView,
  components: {
    PostOverview,
  },
  props: {
    heightOfHeader: {
      type: Number,
      default: 68,
    },
  },
  setup() {
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