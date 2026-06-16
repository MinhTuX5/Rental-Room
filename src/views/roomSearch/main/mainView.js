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
import PostStatus from "../../../common/enum/PostStatus";

/**
 * useMainView - Composable function for room search main view
 * Handles room search filtering, pagination, sorting and displaying room posts
 */
export const useMainView = () => {
  // Lấy instance hiện tại để truy cập $refs và các phương thức của component
  const { proxy } = getCurrentInstance();
  // Khởi tạo stores để quản lý dữ liệu phòng trọ và địa chỉ
  const roomPostStore = useRoomPostStore();
  const locationStore = useLocationStore();

  const goTo = useGoTo();

  //#region Filters
  // Lấy các cấu hình bộ lọc từ roomSearchCommon
  const { filters } = useRoomSearchCommon();
  // Lưu trữ các giá trị bộ lọc đã chọn
  const filterVals = ref([]);

  // Model chứa các tham số lọc: số người thuê, số phương tiện, phòng ngủ, loại phòng, địa chỉ
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

  // Cấu hình tìm kiếm với các tùy chọn: loại phòng và địa chỉ (tỉnh, huyện, xã)
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

  /**
   * onSelectFilter - Xử lý khi người dùng chọn bộ lọc
   * Cập nhật các quận, huyện, xã dựa trên tỉnh được chọn
   * @param {String|Number} selectedVal - Giá trị được chọn
   * @param {Number} type - Loại bộ lọc (Tỉnh, Huyện, Xã)
   */
  const onSelectFilter = (selectedVal, type) => {
    let config = null;
    switch (type) {
      case LocationType.Province:
        // Cập nhật tỉnh được chọn và làm tươi danh sách quận
        locationStore.selectProvinceById(selectedVal);
        config = searchConfig.find(
          (x) => x.locationType === LocationType.District
        );
        if (config) {
          config.items = locationStore.districtItems;
        }
        break;
      case LocationType.District:
        // Cập nhật quận được chọn và làm tươi danh sách xã
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
  // Số lượng bản ghi hiển thị trong mỗi trang
  const pageSize = ref(10);
  // Chỉ số trang hiện tại (bắt đầu từ 1)
  const pageIndex = ref(1);
  // Tổng số bản ghi tìm kiếm được từ API
  const totalCount = ref(20);
  // Tính toán tổng số trang dựa trên tổng số bản ghi và kích thước trang
  const pageTotal = computed(() =>
    Math.ceil(totalCount.value / pageSize.value)
  );

  /**
   * changePage - Lấy dữ liệu phòng trọ cho trang được chỉ định
   * @description Gọi API với các bộ lọc, phân trang và sắp xếp
   *              Cập nhật danh sách postDetails và cuộn lên đầu danh sách
   * @param {Number} pageIndex - Chỉ số trang cần lấy dữ liệu
   * @param {Boolean} isFirstLoad - Nếu true, không cuộn (lần tải đầu tiên)
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
      // Cuộn đến phần tử có id là "list"
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

  /**
   * getPagingPayload - Xây dựng payload cho request phân trang
   * @description Tạo object payload chứa thông tin phân trang, bộ lọc (giá, diện tích, địa chỉ, v.v) và sắp xếp
   * @param {Number} pageIndex - Chỉ số trang
   * @returns {Object} Payload chứa PagingItem (Skip, Take, Filters, Sorts) và FilterVals
   */
  const getPagingPayload = (pageIndex) => {
    const payload = {
      PagingItem: {
        // Số bản ghi bỏ qua = (trang - 1) * kích thước trang
        Skip: (pageIndex - 1) * pageSize.value,
        // Số bản ghi lấy = kích thước trang
        Take: pageSize.value,
        // Mảng các bộ lọc: chỉ lấy phòng có trạng thái "Posted"
        Filters: [
          {
            Field: "post_status",
            Operator: FilterOperator.Equal,
            Value: PostStatus.Posted,
          },
        ],
        Sorts: [],
      },
    };

    // Thêm các bộ lọc tùy chỉnh nếu có
    if (filterVals.value.length > 0) {
      payload.FilterVals = [...(payload.FilterVals || []), ...filterVals.value];
    }

    // Thêm bộ lọc loại phòng nếu có
    if (filterModel.room_type_id.length > 0) {
      payload.PagingItem.Filters.push({
        Field: "room_type_id",
        Operator: FilterOperator.IN,
        Value: filterModel.room_type_id.join(","),
      });
    }

    // Thêm các bộ lọc địa chỉ (tỉnh, huyện, xã) nếu có
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

    // Thêm bộ lọc giá theo lựa chọn (dưới 1 triệu, trên 20 triệu, hoặc khoảng chỉ định)
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

    // Thêm bộ lọc diện tích theo lựa chọn
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

    // Thêm bộ lọc số người thuê nếu > 1
    if (filterModel.noOfRenters > 1) {
      payload.PagingItem.Filters.push({
        Field: "room_people_limit",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: filterModel.noOfRenters,
      });
    }

    // Thêm bộ lọc số phương tiện nếu > 0
    if (filterModel.noOfVehicles > 0) {
      payload.PagingItem.Filters.push({
        Field: "room_vehicle_limit",
        Operator: FilterOperator.GreaterThanOrEqual,
        Value: filterModel.noOfVehicles,
      });
    }

    // Thêm bộ lọc số phòng ngủ nếu có
    if (filterModel.noOfBedRooms && filterModel.noOfBedRooms > 0) {
      payload.PagingItem.Filters.push({
        Field: "no_of_bed_rooms",
        Operator: FilterOperator.Equal,
        Value: filterModel.noOfBedRooms,
      });
    }

    // Thêm sắp xếp theo ngày đăng (mới nhất trước) nếu bật sortByNew
    if (sortByNew.value) {
      payload.PagingItem.Sorts.push({
        Column: "posted_date",
        IsAscending: false,
      });
    }

    // Thêm sắp xếp theo giá (tăng dần hoặc giảm dần)
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

  /**
   * scrollToIndex - Cuộn danh sách ảo đến chỉ mục được chỉ định
   * @description Sử dụng virtual scroller để cuộn đến hàng thứ index
   * @param {Number} index - Chỉ mục hàng cần cuộn đến
   */
  const scrollToIndex = (index) => {
    const me = proxy;
    const vs = me?.$refs?.virtualScroll;
    if (vs && typeof vs.scrollToIndex === "function") {
      try {
        vs.scrollToIndex(index);
      } catch (err) {
        console.warn("scrollToIndex failed:", err);
      }
    }
  };
  //#endregion

  const tabVal = ref(1);

  /**
   * clearFilters - Xóa tất cả các bộ lọc và quay lại trang đầu tiên
   */
  const clearFilters = () => {
    filterVals.value = [];
    changePage(1);
  };

  // Menu các tùy chọn sắp xếp theo giá
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

  // Icon hiển thị loại sắp xếp hiện tại (up/down)
  const sortIcon = ref("");

  /**
   * sortPrice - Sắp xếp phòng trọ theo giá
   * @description Cập nhật icon sắp xếp và tải lại trang đầu tiên
   * @param {Object} item - Item được chọn từ menu
   */
  const sortPrice = (item) => {
    sortIcon.value = item.icon;
    changePage(1);
  };

  // Nút hiển thị mức giá đã chọn (mặc định là "Mức giá")
  const priceRangeBtn = ref("Mức giá");
  // Khoảng giá (triệu): từ 1 đến 20 triệu
  const priceRange = ref([1, 20]);

  /**
   * selectPriceRange - Cập nhật hiển thị text khoảng giá
   * @description Định dạng lại nút hiển thị thành "Từ X đến Y triệu"
   */
  const selectPriceRange = () => {
    priceRangeBtn.value = `Từ ${priceRange.value[0]} đến ${priceRange.value[1]} triệu`;
  };

  // Nút hiển thị diện tích đã chọn (mặc định là "Diện tích")
  const areaRangeBtn = ref("Diện tích");
  // Khoảng diện tích (m²): từ 10 đến 100
  const areaRange = ref([10, 100]);

  /**
   * selectAreaRange - Cập nhật hiển thị text khoảng diện tích
   * @description Định dạng lại nút hiển thị thành "Từ X đến Y m²"
   */
  const selectAreaRange = () => {
    areaRangeBtn.value = `Từ ${areaRange.value[0]} đến ${areaRange.value[1]} m²`;
  };

  // Watch khoảng giá: cập nhật text khi giá thay đổi
  watch(priceRange, (newVal) => {
    priceRangeBtn.value = `Từ ${newVal[0]} đến ${newVal[1]} triệu`;
  });

  // Watch khoảng diện tích: cập nhật text khi diện tích thay đổi
  watch(areaRange, (newVal) => {
    areaRangeBtn.value = `Từ ${newVal[0]} đến ${newVal[1]} m²`;
  });

  // Cờ để bật/tắt sắp xếp theo ngày đăng mới nhất
  const sortByNew = ref(false);

  /**
   * onSortByNewest - Chuyển đổi sắp xếp theo ngày đăng mới nhất
   * @description Bật/tắt sortByNew và tải lại trang đầu tiên
   */
  const onSortByNewest = () => {
    sortByNew.value = !sortByNew.value;
    changePage(1);
  };

  /**
   * onMounted - Hook chạy khi component được mount
   * @description Tải dữ liệu phòng trọ cho trang đầu tiên
   */
  onMounted(async () => {
    changePage(1, true);
  });

  /**
   * Return object chứa tất cả các biến và hàm dùng trong component
   * Được destructure trong component để sử dụng trong template và logic
   */
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
