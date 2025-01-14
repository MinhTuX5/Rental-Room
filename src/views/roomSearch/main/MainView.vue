<template>
  <v-container class="main-view">
    <v-col>
      <v-sheet align="center">
        <h2>Cho Thuê Phòng Trọ, Thuê Nhà Trọ Giá Rẻ, Chính Chủ</h2>
      </v-sheet>
      <v-sheet align="center"
        >Cho thuê phòng trọ, nhà trọ giá rẻ hàng đầu Việt Nam - Cập nhật thông
        tin cho thuê phòng trọ nhanh chóng, chính xác, thông tin xác
        thực.</v-sheet
      >
    </v-col>
    <v-row align="center" class="above-filter">
      <v-col
        v-for="item in searchConfig"
        :key="item.label"
        align-self="center"
        class="filter-item"
      >
        <v-autocomplete
          clearable
          :multiple="item.multiple"
          :auto-select-first="true"
          :hide-details="true"
          :no-data-text="item.noDataText"
          :label="item.label"
          :items="item.items"
          :item-value="item.idField"
          :item-title="item.nameField"
          v-model="filterModel[item.modelField]"
          @update:modelValue="onSelectFilter($event, item.locationType)"
        />
      </v-col>
    </v-row>
    <v-row class="d-flex align-end mb-4 mt-4">
      <v-col class="mr-4">
        <v-btn id="price-range" variant="outlined" class="w-100">{{
          priceRangeBtn
        }}</v-btn>
        <v-menu
          activator="#price-range"
          width="400"
          :close-on-content-click="false"
        >
          <v-list>
            <v-list-item :value="1">
              <v-list-item-title @click="priceRangeBtn = 'Dưới 1 triệu'"
                >Dưới 1 triệu</v-list-item-title
              >
            </v-list-item>
            <v-list-item :value="2" @click="selectPriceRange">
              <v-list-item-title class="mb-8"
                >Từ 1 đến 20 triệu</v-list-item-title
              >
              <v-range-slider
                v-model="priceRange"
                thumb-label="always"
                :max="20"
                :min="1"
                :step="0.5"
                class="align-center ml-4 mr-4"
                hide-details
              ></v-range-slider>
            </v-list-item>
            <v-list-item :value="3">
              <v-list-item-title @click="priceRangeBtn = 'Trên 20 triệu'"
                >Trên 20 triệu</v-list-item-title
              >
            </v-list-item>
            <v-list-item :value="4">
              <v-list-item-title @click="priceRangeBtn = 'Mức giá'"
                >Đặt lại</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <v-col class="mr-4">
        <v-btn id="area-range" variant="outlined" class="w-100">{{
          areaRangeBtn
        }}</v-btn>
        <v-menu
          activator="#area-range"
          width="400"
          :close-on-content-click="false"
        >
          <v-list>
            <v-list-item :value="1">
              <v-list-item-title @click="areaRangeBtn = 'Dưới 10 m²'"
                >Dưới 10 m²</v-list-item-title
              >
            </v-list-item>
            <v-list-item :value="2" @click="selectAreaRange">
              <v-list-item-title class="mb-8"
                >Từ 10 đến 100 m²</v-list-item-title
              >
              <v-range-slider
                v-model="areaRange"
                thumb-label="always"
                :max="100"
                :min="10"
                :step="1"
                class="align-center ml-4 mr-4"
                hide-details
              ></v-range-slider>
            </v-list-item>
            <v-list-item :value="3">
              <v-list-item-title @click="areaRangeBtn = 'Trên 100 m²'"
                >Trên 100 m²</v-list-item-title
              >
            </v-list-item>
            <v-list-item :value="4">
              <v-list-item-title @click="areaRangeBtn = 'Diện tích'"
                >Đặt lại</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>

      <v-col class="mr-4">
        <v-number-input
          clearable
          hide-details
          density="compact"
          control-variant="stacked"
          label="Số người ở"
          class="mt-2"
          variant="outlined"
          type="number"
          :min="1"
          :max="100"
          v-model="filterModel.noOfRenters"
        />
      </v-col>

      <v-col class="mr-4">
        <v-number-input
          clearable
          hide-details
          density="compact"
          control-variant="stacked"
          label="Số xe"
          class="mt-2"
          variant="outlined"
          type="number"
          :min="0"
          :max="100"
          v-model="filterModel.noOfVehicles"
        />
      </v-col>

      <v-col>
        <v-number-input
          clearable
          hide-details
          density="compact"
          control-variant="stacked"
          label="Số phòng ngủ"
          class="mt-2"
          variant="outlined"
          type="number"
          :min="1"
          :max="100"
          v-model="filterModel.noOfBedRooms"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col id="list" cols="9" class="border-thin pa-4">
        <h3>Tổng {{ totalCount ?? 0 }} kết quả</h3>
        <v-sheet class="d-flex align-center mb-4 mt-2">
          <h3 class="mr-1">Sắp xếp:</h3>
          <v-btn
            variant="solo"
            :append-icon="sortByNew ? 'mdi-star' : ''"
            @click="onSortByNewest"
            >Mới nhất</v-btn
          >
          <v-btn
            variant="solo"
            id="price-menu-activator"
            :append-icon="sortIcon"
            >Giá cả</v-btn
          >
          <v-menu activator="#price-menu-activator">
            <v-list>
              <v-list-item
                v-for="(item, index) in priceMenuItems"
                :key="index"
                :value="index"
                @click="sortPrice(item)"
              >
                <v-list-item-title
                  ><v-icon :icon="item.icon" class="mr-2" />
                  {{ item.title }}</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <v-btn variant="solo">Số lượng tương tác</v-btn> -->
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
        <v-row class="mt-2">
          <v-col class="d-flex align-center justify-end">
            <v-select
              label="Số bài mỗi trang"
              :items="[10, 20, 50]"
              :max-width="200"
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
              :total-visible="3"
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
      <v-col class="border-thin ml-2 pa-4">
        <v-row class="d-flex align-center mb-4">
          <v-btn
            class="flex-fill mr-4"
            color="blue-accent-1"
            @click="changePage(1)"
            >Tìm kiếm</v-btn
          >
          <v-icon
            icon="mdi-filter-off-outline"
            class="cursor-pointer"
            v-tooltip:top="'Bỏ lọc'"
            @click="clearFilters"
          />
        </v-row>

        <v-sheet class="d-flex flex-column justify-space-between">
          <v-sheet ref="filter" class="flex-column">
            <v-sheet v-for="(filter, index) in filters" :key="index" cols="3">
              <h3>{{ filter.label }}</h3>
              <ul>
                <li v-for="item in filter.children" :key="item.label">
                  <v-checkbox
                    density="compact"
                    hide-details
                    color="success"
                    :label="item.label"
                    :value="item.value"
                    v-model="filterVals"
                  ></v-checkbox>
                </li>
              </ul>
            </v-sheet>
          </v-sheet>
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
.above-filter {
  .v-col {
    padding: unset;
  }

  .filter-item {
    & + .filter-item {
      margin-left: 12px;
    }
  }
}
.why {
  .v-sheet {
    width: 100%;
    text-align: center;
  }
}
</style>