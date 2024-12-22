import { computed, getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useGoTo } from "vuetify";
// resources
import { useRoomSearchCommon } from "../roomSearchCommon";
import { scrollTo } from "@/common/commonFunction";
import RoomCategoryConfig from "@/common/config/roomCategoryConfig";
import LocationConfig from "@/common/config/locationConfig";
// stores
import { useLocationStore } from "@/stores/location/locationStore";
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
// enum
import LocationType from "@/common/enum/LocationType";

export const useMainView = () => {
  const { proxy } = getCurrentInstance();
  // stores
  const roomPostStore = useRoomPostStore();
  const locationStore = useLocationStore();

  const goTo = useGoTo();

  //#region Filters
  const { filters } = useRoomSearchCommon();
  const filterVals = ref([]);
  //#endregion

  const searchConfig = reactive([
    {
      type: 10,
      label: "Loại nhà đất",
      items: RoomCategoryConfig.map((x) => x.text),
    },
    ...LocationConfig,
  ]);

  const onSelectFilter = (selectedVal, type) => {
    let config = null;
    switch (type) {
      case LocationType.Province:
        locationStore.selectProvinceByName(selectedVal);
        config = searchConfig.find(
          (x) => x.locationType === LocationType.District
        );
        if (config) {
          config.items = locationStore.districtItems.map(
            (x) => x.location_name
          );
        }
        break;
      case LocationType.District:
        locationStore.selectDistrictByName(selectedVal);
        config = searchConfig.find((x) => x.locationType === LocationType.Ward);
        if (config) {
          config.items = locationStore.wardItems.map((x) => x.location_name);
        }
        break;
      default:
        break;
    }
  };

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
    onSelectFilter,
  };
};
