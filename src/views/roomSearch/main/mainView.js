import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
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
import FilterOperator from "../../../common/enum/FilterOperator";
import { sortBy } from "lodash";

export const useMainView = () => {
  const { proxy } = getCurrentInstance();
  // stores
  const roomPostStore = useRoomPostStore();
  const locationStore = useLocationStore();

  const goTo = useGoTo();

  //#region Filters
  const { filters } = useRoomSearchCommon();
  const filterVals = ref([]);

  const filterModel = reactive({
    noOfRenters: 1,
    noOfVehicles: 0,
    noOfBedRooms: null,
    room_type_id: [],
    district_id: "",
    ward_id: "",
    province_id: "",
  });
  //#endregion

  const searchConfig = reactive([
    {
      type: 10,
      label: "Loại nhà đất",
      idField: "value",
      nameField: "text",
      modelField: "room_type_id",
      items: RoomCategoryConfig,
      multiple: true,
    },
    ...LocationConfig,
  ]);

  const onSelectFilter = (selectedVal, type) => {
    let config = null;
    switch (type) {
      case LocationType.Province:
        locationStore.selectProvinceById(selectedVal);
        config = searchConfig.find(
          (x) => x.locationType === LocationType.District
        );
        if (config) {
          config.items = locationStore.districtItems;
        }
        break;
      case LocationType.District:
        locationStore.selectDistrictById(selectedVal);
        config = searchConfig.find((x) => x.locationType === LocationType.Ward);
        if (config) {
          config.items = locationStore.wardItems;
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

    const payload = getPagingPayload(pageIndex);
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

  const getPagingPayload = (pageIndex) => {
    const payload = {
      PagingItem: {
        Skip: (pageIndex - 1) * pageSize.value,
        Take: pageSize.value,
        Filters: [],
        Sorts: [],
      },
    };

    if (filterVals.value.length > 0) {
      payload.FilterVals = filterVals.value;
    }

    if (filterModel.room_type_id.length > 0) {
      payload.PagingItem.Filters.push({
        Field: "room_type_id",
        Operator: FilterOperator.IN,
        Value: filterModel.room_type_id.join(","),
      });
    }

    const locationFields = ["province_id", "district_id", "ward_id"];
    locationFields.forEach((field) => {
      if (filterModel[field]) {
        payload.PagingItem.Filters.push({
          Field: field,
          Operator: FilterOperator.Equal,
          Value: filterModel[field],
        });
      }
    });

    if (priceRangeBtn.value.toLowerCase().startsWith("dưới")) {
      payload.PagingItem.Filters.push({
        Field: "room_price",
        Operator: FilterOperator.LessThanOrEqual,
        Value: 1000000,
      });
    } else if (priceRangeBtn.value.toLowerCase().startsWith("trên")) {
      payload.PagingItem.Filters.push({
        Field: "room_price",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: 20000000,
      });
    } else if (priceRangeBtn.value.toLowerCase().startsWith("từ")) {
      payload.PagingItem.Filters.push({
        Field: "room_price",
        Operator: FilterOperator.LessThanOrEqual,
        Value: priceRange.value[1] * 1000000,
      });
      payload.PagingItem.Filters.push({
        Field: "room_price",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: priceRange.value[0] * 1000000,
      });
    }

    if (areaRangeBtn.value.toLowerCase().startsWith("dưới")) {
      payload.PagingItem.Filters.push({
        Field: "room_area",
        Operator: FilterOperator.LessThanOrEqual,
        Value: 10,
      });
    } else if (areaRangeBtn.value.toLowerCase().startsWith("trên")) {
      payload.PagingItem.Filters.push({
        Field: "room_area",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: 100,
      });
    } else if (areaRangeBtn.value.toLowerCase().startsWith("từ")) {
      payload.PagingItem.Filters.push({
        Field: "room_area",
        Operator: FilterOperator.LessThanOrEqual,
        Value: areaRange.value[1],
      });
      payload.PagingItem.Filters.push({
        Field: "room_area",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: areaRange.value[0],
      });
    }

    if (filterModel.noOfRenters > 1) {
      payload.PagingItem.Filters.push({
        Field: "room_people_limit",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: filterModel.noOfRenters,
      });
    }

    if (filterModel.noOfVehicles > 0) {
      payload.PagingItem.Filters.push({
        Field: "room_vehicle_limit",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: filterModel.noOfVehicles,
      });
    }

    if (filterModel.noOfBedRooms && filterModel.noOfBedRooms > 0) {
      payload.PagingItem.Filters.push({
        Field: "no_of_bed_rooms",
        Operator: FilterOperator.Equal,
        Value: filterModel.noOfBedRooms,
      });
    }

    if (sortByNew.value) {
      payload.PagingItem.Sorts.push({
        Column: "posted_date",
        IsAscending: false,
      });
    }

    if (sortIcon.value.includes("up")) {
      payload.PagingItem.Sorts.push({ Column: "room_price" });
    } else if (sortIcon.value.includes("down")) {
      payload.PagingItem.Sorts.push({
        Column: "room_price",
        IsAscending: false,
      });
    }

    return payload;
  };

  const scrollToIndex = (index) => {
    const me = proxy;
    me.$refs.virtualScroll.scrollToIndex(index);
  };
  //#endregion

  const tabVal = ref(1);

  const clearFilters = () => {
    filterVals.value = [];
  };

  const priceMenuItems = ref([
    {
      title: "Tăng dần",
      icon: "mdi-arrow-up",
    },
    { title: "Giảm dần", icon: "mdi-arrow-down" },
    {
      title: "Mặc định",
      icon: "",
    },
  ]);

  const sortIcon = ref("");
  const sortPrice = (item) => {
    sortIcon.value = item.icon;
    changePage(1);
  };

  const priceRangeBtn = ref("Mức giá");
  const priceRange = ref([1, 20]);
  const selectPriceRange = () => {
    priceRangeBtn.value = `Từ ${priceRange.value[0]} đến ${priceRange.value[1]} triệu`;
  };

  const areaRangeBtn = ref("Diện tích");
  const areaRange = ref([10, 100]);
  const selectAreaRange = () => {
    areaRangeBtn.value = `Từ ${areaRange.value[0]} đến ${areaRange.value[1]} m²`;
  };

  watch(priceRange, (newVal) => {
    priceRangeBtn.value = `Từ ${newVal[0]} đến ${newVal[1]} triệu`;
  });

  watch(areaRange, (newVal) => {
    areaRangeBtn.value = `Từ ${newVal[0]} đến ${newVal[1]} m²`;
  });

  const sortByNew = ref(false);
  const onSortByNewest = () => {
    sortByNew.value = !sortByNew.value;
    changePage(1);
  };

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
    clearFilters,
    priceMenuItems,
    sortPrice,
    sortIcon,
    priceRangeBtn,
    priceRange,
    areaRangeBtn,
    areaRange,
    filterModel,
    selectPriceRange,
    selectAreaRange,
    sortByNew,
    onSortByNewest,
  };
};
