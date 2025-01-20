<template>
  <v-col id="list" class="border-thin pa-4">
    <v-btn
      @click="changePage(1, true)"
      class="justify-end mb-4"
      prepend-icon="mdi-refresh"
      >Làm mới</v-btn
    >
    <v-virtual-scroll
      v-if="postDetails.length"
      ref="virtualScroll"
      :items="postDetails"
      :height="heightOfList"
    >
      <template #default="{ item }">
        <post-overview
          :key="item.room_post_id"
          :item="item"
          class="mb-1"
          :isShowLikeIcon="false"
          detailPageName="PostDetailApproval"
          @onClickItem="scrollToIndex(item.sort_order)"
        />
      </template>
    </v-virtual-scroll>
    <v-empty-state
      v-else
      text="Không tìm thấy bài đăng cần phê duyệt!"
      image="/src/assets/imgs/common/empty.png"
    ></v-empty-state>
    <v-row v-if="postDetails.length" class="d-flex align-center">
      <v-col>
        <div class="text-h6">Tổng {{ totalCount ?? 0 }} kết quả</div>
      </v-col>
      <v-col cols="2" class="d-flex align-center mr-4">
        <v-select
          label="Số bài mỗi trang"
          density="compact"
          :items="[10, 20, 50]"
          :width="100"
          hide-details
          v-model="pageSize"
          @update:modelValue="changePage(1)"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-pagination
          ref="pagination"
          v-model="pageIndex"
          :length="pageTotal"
          :total-visible="5"
          :showFirstLastPage="true"
          @update:modelValue="changePage"
        >
          <template #first="{ onClick, disabled }">
            <v-btn icon variant="text" @click="onClick" :disabled="disabled">
              <v-icon>mdi-chevron-double-left</v-icon>
            </v-btn>
          </template>
          <template #last="{ onClick, disabled }">
            <v-btn icon variant="text" @click="onClick" :disabled="disabled">
              <v-icon>mdi-chevron-double-right</v-icon>
            </v-btn>
          </template>
        </v-pagination>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { computed, getCurrentInstance, onMounted, ref } from "vue";
// stores
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
// base
import baseView from "../base/baseView";
// components
import PostOverview from "@/components/views/postOverview/PostOverview.vue";
import FilterOperator from "../../common/enum/FilterOperator";
import PostStatus from "../../common/enum/PostStatus";

export default {
  extends: baseView,
  name: "PostApproval",
  components: { PostOverview },
  props: {
    heightOfAppHeader: {
      typeof: "number",
      default: 64,
    },
  },

  setup() {
    const { proxy } = getCurrentInstance();
    // stores
    const roomPostStore = useRoomPostStore();

    // Tổng số bản ghi thu được
    const totalCount = ref(0);
    // Số bản ghi mỗi trang
    const pageSize = ref(10);
    // số lượng trang
    const pageTotal = computed(() =>
      Math.ceil(totalCount.value / pageSize.value)
    );

    const postDetails = ref([]);

    /**
     * @description Chuyển trang
     * @param {Number} pageIndex
     */
    const changePage = async (pageIndex, isFirstLoad = false) => {
      const me = proxy;
      const payload = {
        PagingItem: {
          Skip: (pageIndex - 1) * pageSize.value,
          Take: pageSize.value,
          filters: [
            {
              Field: "post_status",
              Operator: FilterOperator.Equal,
              Value: PostStatus.WaitingForApproval,
            },
          ],
        },
      };
      const res = await roomPostStore.getPaging(payload);

      if (Array.isArray(res.data)) {
        postDetails.value = res.data.map((x, index) => ({
          ...x,
          sort_order: index,
        }));
      }

      if (typeof res.totalCount === "number") {
        totalCount.value = res.totalCount;
      }

      if (!isFirstLoad) {
        scrollTo(
          goTo,
          "#list",
          me.$props.heightOfHeader * -1,
          100,
          "By Query Selector"
        );

        scrollToIndex(0);
      }
    };

    const scrollToIndex = (index) => {
      const me = proxy;
      me.$refs.virtualScroll.scrollToIndex(index);
    };

    // số thứ tự của trang hiện tại
    const pageIndex = ref(1);

    const heightOfList = computed(() => {
      return (
        window.innerHeight - (proxy.$props?.heightOfAppHeader ?? 64) - 32 - 60 - 48
      );
    });

    onMounted(async () => {
      changePage(1, true);
    });

    return {
      totalCount,
      changePage,
      postDetails,
      scrollToIndex,
      pageTotal,
      pageIndex,
      heightOfList,
      pageSize,
    };
  },
};
</script>

<style lang="scss">
</style>