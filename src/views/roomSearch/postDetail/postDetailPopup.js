import axios from "axios";
import { onMounted, reactive, ref, onUnmounted, getCurrentInstance } from "vue";
import { cloneDeep } from "lodash";
// Resources
import { useRoomSearchCommon } from "../roomSearchCommon";
import RoomCategoryConfig from "@/common/config/roomCategoryConfig";
// stores
import { useLocationStore } from "@/stores/location/locationStore";
import { useContextStore } from "@/stores/contextStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import i18nApp from "@/constant/resource/i18nApp";
// enum
import LocationType from "@/common/enum/LocationType";
import RoomType from "../../../common/enum/RoomType";
import PostStatus from "../../../common/enum/PostStatus";
import { useRoomStore } from "../../../stores/roomManagement/dictionary/roomStore";

export const usePostDetailPopup = () => {
  const { proxy } = getCurrentInstance();

  // config
  const isManagement = ref(false);
  const form = ref(false);

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
      items: locationStore.provinceItems,
      noDataText: "Không có dữ liệu",
      autofocus: true,
      valueField: "province_id",
    },
    {
      label: "Chọn Quận/Huyện",
      locationType: LocationType.District,
      items: [],
      noDataText: "Chưa có Tỉnh/Thành phố nào được chọn",
      valueField: "district_id",
    },
    {
      label: "Chọn Phường/Xã",
      locationType: LocationType.Ward,
      items: locationStore.wardItems,
      noDataText: "Chưa có Quận/Huyện nào được chọn",
      valueField: "ward_id",
    },
  ]);

  const roomCategories = RoomCategoryConfig.filter((x) => x.value > 0);

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
        value[0].size < 2000000 || "Hình ảnh phải có dung lượng nhỏ hơn 2MB!";
      return validMessage;
    },
  ];

  const locationParts = ref(new Array(5).fill(""));

  /**
   * @description Lựa chọn combobox vị trí
   * @param {String} selectedVal tên vị trí được chọn
   * @param {Number} locationType Loại vị trí đc chọn
   */
  const onSelectLocation = (selectedVal, locationType) => {
    let selectedLocation = {};
    let config = null;
    let result = "";
    switch (locationType) {
      case LocationType.Province:
        selectedLocation = locationStore.selectProvinceById(selectedVal);
        config = addressInfo.find(
          (x) => x.locationType === LocationType.District
        );
        if (config) {
          config.items = locationStore.districtItems;
        }
        result = updateLocationParts(
          selectedLocation[locationStore.nameField],
          5
        );
        break;
      case LocationType.District:
        selectedLocation = locationStore.selectDistrictById(selectedVal);
        config = addressInfo.find((x) => x.locationType === LocationType.Ward);
        if (config) {
          config.items = locationStore.wardItems;
        }
        result = updateLocationParts(
          selectedLocation[locationStore.nameField],
          4
        );
        break;
      case LocationType.Ward:
        selectedLocation = locationStore.getWardById(selectedVal);
        result = updateLocationParts(
          selectedLocation[locationStore.nameField],
          3
        );
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
      case 3:
      case 4:
        for (var i = 1; i < index; i++) {
          locationParts.value[i - 1] = "";
        }
        break;
      case 5:
        locationParts.value = new Array(5).fill("");
        break;
    }

    locationParts.value[index - 1] = customVal;
    model.value.room_address = locationParts.value.filter((x) => x).join(", ");
  };

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

    me.model.RoomCharacteristic = cloneDeep(roomCharacteristic.value);
    me.model.room_characteristic = JSON.stringify(roomCharacteristic.value);

    // Loại bỏ dấu phẩy trong chuỗi
    const numberWithoutCommas = roomPrice.value.replace(/,/g, "");
    // Chuyển đổi chuỗi thành số
    me.model.room_price = parseInt(numberWithoutCommas);

    me.model.from_management = isManagement.value ? 1 : 0;
  };

  const submitPopup = async (postStatus) => {
    const me = proxy;
    overlay.value = true;
    try {
      // Trạng thái là đăng bài hay lưu bài
      me.model.post_status = postStatus;

      await me.submit();

      if (!isManagement.value) {
        me.$router.push({
          name: "PostManagement",
          query: { tab: postStatus },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rules = {
    required: (v) => !!v || i18nApp.rules.required,
    min: (v) => v.length >= minLength || i18nApp.rules.min.format(minLength),
    max255: (v) => v.length <= 255 || i18nApp.rules.max.format(255),
    min0: (v) => v > 0 || i18nApp.rules.minNumber.format(0),
  };

  const allowEdit = ref(false);
  const toggleAllowEdit = () => {
    allowEdit.value = !allowEdit.value;
  };

  const model = ref({
    room_gender: 0,
    room_price_unit: 0,
    no_of_bed_rooms: 1,
    room_people_limit: 100,
    room_vehicle_limit: 100,
    room_type: RoomType.RentalRoom,
  });

  const customAfterSubmit = async (data) => {
    const me = proxy;

    // Lưu hình ảnh
    saveImages(data);

    // Lưu vị trí
    const payload = {
      province_id: me.model.province_id,
      district_id: me.model.district_id,
      ward_id: me.model.ward_id,
      street_name: me.model.street_name,
      house_number: me.model.house_number,
      room_post_id: data.room_post_id,
    };
    store.saveLocation(payload).catch((error) => {
      console.error(error);
    });
  };

  const overlay = ref(false);
  const files = ref([]);
  const imageLinks = ref([]);

  const saveImages = async (data) => {
    const formData = new FormData();

    const api = `https://api.cloudinary.com/v1_1/dbm4qpzc1/image/upload`;

    formData.append("upload_preset", "rentalRoomSystemProject");

    for (let i = 0; i < files.value.length; i++) {
      formData.append("file", files.value[i]);
      let rs = await axios.post(api, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (rs?.data?.secure_url) {
        imageLinks.value.push(rs.data.secure_url);
      }
    }

    // Lấy cả những ảnh đã lưu
    savedImages.value.forEach((x) => {
      imageLinks.value.push(x);
    });

    if (imageLinks.value.length) {
      const payload = {
        ...data,
        images: imageLinks.value.join(","),
      };
      store
        .putAsync(payload)
        .then(() => {
          if (isManagement.value) {
            useRoomStore().$state.invalidCache = true;
            proxy.$router.push({ name: "RoomListOverview" });
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          overlay.value = false;
        });
    }
  };

  const deletedImages = ref([]);
  const removeImg = (index) => {
    deletedImages.value.push(savedImages.value[index]);
    savedImages.value.splice(index, 1);
  };

  const isReadOnly = ref(false);
  const savedImages = ref([]);
  const isUpdating = ref(false);

  onMounted(async () => {
    const me = proxy;

    const roomPostId =
      me.$route.params.roomPostId ?? me.$route.query.roomPostId;
    if (me.$route.name === "Management_PostDetail") {
      isReadOnly.value = roomPostId ? true : false;
      isManagement.value = true;
      title.value = "Chi tiết phòng";
      me.updateText = "";
      me.addText = "";

      model.value.room_id = me.$route.query.roomId;
      model.value.user_id = useContextManageStore().$state.user.user_id;

      if (!roomPostId) {
        me.editMode = 1;
        const data = await store.getRoomPostByRoomId(model.value.room_id);
        onSelectLocation(data.province_id, LocationType.Province);
        onSelectLocation(data.district_id, LocationType.District);
        model.value = { ...model.value, ...data };
        roomPrice.value = data.room_price.toString();
        formatAmount();
      }
    } else {
      model.value.user_id = useContextStore().$state.user.user_id;
    }

    if (roomPostId) {
      me.editMode = 2;
      const data = await store.getById(roomPostId);
      onSelectLocation(data.province_id, LocationType.Province);
      onSelectLocation(data.district_id, LocationType.District);
      model.value = data;
      roomPrice.value = data.room_price.toString();
      formatAmount();
      savedImages.value = data.images.split(",");

      if (me.$route.name === "PostDetailUpdating") {
        title.value = 'Sửa bài đăng'
        isUpdating.value = true;
      }
    }

    priceUnit.value = unitList[0];
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
    form,
    model,
    rules,
    allowEdit,
    toggleAllowEdit,
    customAfterSubmit,
    files,
    saveImages,
    PostStatus,
    overlay,
    isManagement,
    isReadOnly,
    savedImages,
    removeImg,
    isUpdating
  };
};
