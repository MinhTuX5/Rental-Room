import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { useGoTo } from "vuetify";
// resources
import { useRoomSearchCommon } from "../roomSearchCommon";
import { scrollTo } from "@/common/commonFunction";
// stores
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";

export const useMainView = () => {
  const { proxy } = getCurrentInstance();
  // stores
  const roomPostStore = useRoomPostStore();

  const goTo = useGoTo();

  //#region Filters
  const { filters } = useRoomSearchCommon();
  const filterVals = ref([]);
  //#endregion

  const searchConfig = [
    {
      label: "Loại nhà đất",
      items: [
        {
          title: "Tất cả",
          value: 0,
        },
        {
          title: "Phòng trọ, nhà trọ",
          value: 1,
        },
        {
          title: "Nhà thuê nguyên căn",
          value: 2,
        },
        {
          title: "Cho thuê căn hộ",
          value: 3,
        },
      ],
    },
    {
      label: "Chọn giá",
      items: [
        {
          title: "Tất cả",
          value: 0,
        },
        {
          title: "Phòng trọ, nhà trọ",
          value: 1,
        },
        {
          title: "Nhà thuê nguyên căn",
          value: 2,
        },
        {
          title: "Cho thuê căn hộ",
          value: 3,
        },
      ],
    },
    {
      label: "Loại nhà đất",
      items: [
        {
          title: "Tất cả",
          value: 0,
        },
        {
          title: "Phòng trọ, nhà trọ",
          value: 1,
        },
        {
          title: "Nhà thuê nguyên căn",
          value: 2,
        },
        {
          title: "Cho thuê căn hộ",
          value: 3,
        },
      ],
    },
    {
      label: "Chọn giá",
      items: [
        {
          title: "Tất cả",
          value: 0,
        },
        {
          title: "Phòng trọ, nhà trọ",
          value: 1,
        },
        {
          title: "Nhà thuê nguyên căn",
          value: 2,
        },
        {
          title: "Cho thuê căn hộ",
          value: 3,
        },
      ],
    },
    {
      label: "Chọn giá",
      items: [
        {
          title: "Tất cả",
          value: 0,
        },
        {
          title: "Phòng trọ, nhà trọ",
          value: 1,
        },
        {
          title: "Nhà thuê nguyên căn",
          value: 2,
        },
        {
          title: "Cho thuê căn hộ",
          value: 3,
        },
      ],
    },
  ];

  const popularPlaces = [
    {
      location: "Hà Nội",
      image: "src/assets/imgs/HaNoi.jpg",
    },
    {
      location: "Đà Nẵng",
      image: "src/assets/imgs/DaNang.jpg",
    },
    {
      location: "Hồ Chí Minh",
      image: "src/assets/imgs/HoChiMinh.jpg",
    },
  ];

  const postDetails = ref([]);

  //#region Pagination
  // Số bản ghi mỗi trang
  const pageSize = ref(10);
  // số thứ tự của trang hiện tại
  const pageIndex = ref(1);
  // Tổng số bản ghi thu được
  const totalCount = ref(20);
  // số lượng trang
  const pageTotal = computed(() =>
    Math.ceil(totalCount.value / pageSize.value)
  );

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
      },
      FilterVals: filterVals.value,
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
        "By Query Selector"
      );

      scrollToIndex(0);
    }
  };

  const scrollToIndex = (index) => {
    const me = proxy;
    me.$refs.virtualScroll.scrollToIndex(index);
  };
  //#endregion

  const tabVal = ref(1);

  onMounted(async () => {
    changePage(1, true);
  });

  return {
    searchConfig,
    tabVal,
    popularPlaces,
    postDetails,
    pageIndex,
    pageTotal,
    changePage,
    totalCount,
    pageSize,
    scrollToIndex,
    filters,
    filterVals,
  };
};
