import {
  onMounted,
  reactive,
  ref,
  onUnmounted,
  computed,
  getCurrentInstance,
} from "vue";
import { cloneDeep } from "lodash";
// Resources
import { useRoomSearchCommon } from "../roomSearchCommon";
import RoomCategoryConfig from "@/common/config/roomCategoryConfig";
// stores
import { useLocationStore } from "@/stores/location/locationStore";
import { useContextStore } from "@/stores/contextStore";
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
// enum
import LocationType from "@/common/enum/LocationType";

export const usePostDetailPopup = () => {
  const { proxy } = getCurrentInstance();
  // stores
  const store = useRoomPostStore();
  const locationStore = useLocationStore();
  const roomSearchCommon = useRoomSearchCommon();
  // variables
  const priceUnit = ref("");
  const roomCharacteristic = ref([]);
  const roomPrice = ref("");
  const title = ref("Đăng tin mới");

  const addressInfo = reactive([
    {
      label: "Chọn Tỉnh/Thành phố",
      locationType: LocationType.Province,
      items: locationStore.provinceItems.map((x) => x.location_name),
      noDataText: "Không có dữ liệu",
      autofocus: true,
    },
    {
      label: "Chọn Quận/Huyện",
      locationType: LocationType.District,
      items: [],
      noDataText: "Chưa có Tỉnh/Thành phố nào được chọn",
    },
    {
      label: "Chọn Phường/Xã",
      locationType: LocationType.Ward,
      items: locationStore.wardItems.map((x) => x.location_name),
      noDataText: "Chưa có Quận/Huyện nào được chọn",
    },
  ]);

  const roomCategoryConfig = RoomCategoryConfig.filter(x => x.value > 0);
  const roomCategories = computed(() => {
    return roomCategoryConfig.map((x) => x.text);
  });
  const roomCategory = ref("");

  const validImageTypes = ["image/png", "image/jpeg", "image/bmp"];
  const imageRules = [
    (value) => {
      let validMessage = "";

      if (!value || !value.length) {
        return validMessage;
      }
      validMessage =
        validImageTypes.includes(value?.[0]?.type) || "Hình ảnh không hợp lệ!";

      if (validMessage) {
        return validMessage;
      }

      validMessage =
        value[0].size < 2000000 || "Hình ảnh nên có dung lượng nhỏ hơn 2MB!";
      return validMessage;
    },
  ];

  const locationParts = reactive(new Array(5).fill(""));

  /**
   * @description Lựa chọn combobox vị trí
   * @param {String} selectedVal tên vị trí được chọn
   * @param {Number} locationType Loại vị trí đc chọn
   */
  const onSelectLocation = (selectedVal, locationType) => {
    let config = null;
    switch (locationType) {
      case LocationType.Province:
        locationStore.selectProvinceByName(selectedVal);
        config = addressInfo.find(
          (x) => x.locationType === LocationType.District
        );
        if (config) {
          config.items = locationStore.districtItems.map(
            (x) => x.location_name
          );
        }
        updateLocationParts(selectedVal, 5);
        break;
      case LocationType.District:
        locationStore.selectDistrictByName(selectedVal);
        config = addressInfo.find((x) => x.locationType === LocationType.Ward);
        if (config) {
          config.items = locationStore.wardItems.map((x) => x.location_name);
        }
        updateLocationParts(selectedVal, 4);
        break;
      case LocationType.Ward:
        updateLocationParts(selectedVal, 3);
        break;
      default:
        break;
    }
  };

  const updateLocationParts = (value, index) => {
    if (index < 1 || index > 5) {
      return;
    }
    const lowerCaseVal = value.toLowerCase();
    let customVal = value;
    switch (index) {
      case 1:
        if (!lowerCaseVal.includes("số")) customVal = `Số ${value}`;
        break;
      case 2:
        if (!lowerCaseVal.includes("đường") && !lowerCaseVal.includes("phố"))
          customVal = `Đường ${value}`;
        break;
    }
    locationParts[index - 1] = customVal;
  };

  const roomAddress = computed(() => {
    return locationParts.filter((x) => x).join(", ");
  });

  const formatAmount = (event) => {
    // Xóa ký tự không phải số và dấu thập phân
    roomPrice.value = roomPrice.value.replace(/[^0-9.]/g, "");

    // Chỉ cho phép một dấu thập phân trong chuỗi
    const parts = roomPrice.value.split(".");
    if (parts.length > 2) {
      roomPrice.value = parts[0] + "." + parts[1];
    }

    // Định dạng số tiền
    if (roomPrice.value) {
      roomPrice.value = new Intl.NumberFormat().format(roomPrice.value);
    }
  };

  const unitList = ["đồng/tháng"];

  /**
   * @description Xử lý trước khi submit
   */
  const customBeforeSubmit = () => {
    const me = proxy;

    const contextStore = useContextStore();
    const { userID } = contextStore.$state;
    me.model.user_id = userID;

    me.model.RoomCharacteristic = cloneDeep(roomCharacteristic.value);
    me.model.room_characteristic = JSON.stringify(roomCharacteristic.value);
    me.model.room_address = roomAddress.value;

    // Lấy loại phòng cho thuê
    me.model.room_category = roomCategoryConfig.find(
      (x) => x.name === roomCategory.value
    ).value;

    // Loại bỏ dấu phẩy trong chuỗi
    const numberWithoutCommas = roomPrice.value.replace(/,/g, "");
    // Chuyển đổi chuỗi thành số
    me.model.room_price = parseInt(numberWithoutCommas);
  };

  const submitPopup = async (postStatus = true) => {
    const me = proxy;
    try {
      // Trạng thái là đăng bài hay lưu bài
      me.model.post_status = postStatus;
      await me.submit();
      me.$router.push({
        name: "PostManagement",
        query: { tab: postStatus ? 1 : 2 },
      });
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    const me = proxy;
    me.model = {
      ...me.model,
      room_gender: 0,
      room_price_unit: 0,
      no_of_bed_rooms: 1,
      room_people_limit: 0,
      room_vehicle_limit: 0,
    };

    priceUnit.value = unitList[0];

    roomCategory.value = roomCategoryConfig[0].text;
  });

  onUnmounted(() => {
    locationStore.resetState();
  });

  return {
    addressInfo,
    roomSearchCommon,
    imageRules,
    validImageTypes,
    locationStore,
    onSelectLocation,
    roomAddress,
    locationParts,
    updateLocationParts,
    formatAmount,
    unitList,
    priceUnit,
    store,
    customBeforeSubmit,
    roomCharacteristic,
    roomPrice,
    submitPopup,
    title,
    roomCategories,
    roomCategory
  };
};
