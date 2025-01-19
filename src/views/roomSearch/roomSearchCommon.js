import { reactive, ref } from "vue";
// resources
import { showMessage } from "@/common/commonFunction";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextStore } from "@/stores/contextStore";
import LocationType from "@/common/enum/LocationType";
import { useLocationStore } from "@/stores/location/locationStore";

export const useRoomSearchCommon = () => {
  const contextStore = useContextStore();
  const locationStore = useLocationStore();

  const filters = [
    {
      label: "Đặc điểm nổi bật",
      children: [
        {
          label: "Không chung chủ",
          value: 0,
        },
        {
          label: "Phòng khép kín",
          value: 1,
        },
        {
          label: "Giờ giấc tự do",
          value: 2,
        },
        {
          label: "Bảo vệ 24/7",
          value: 13,
        },
        {
          label: "Đầy đủ PCCC",
          value: 16,
        },
      ],
    },
    {
      id: 2,
      label: "Tiện ích",
      children: [
        {
          label: "Chỗ để xe miễn phí",
          value: 3,
        },
        {
          label: "Khu vực nấu ăn",
          value: 4,
        },
        {
          label: "Khóa vân tay",
          value: 5,
        },
        {
          label: "Camera",
          value: 6,
        },
        {
          label: "Thang máy",
          value: 12,
        },
      ],
    },
    {
      label: "Trang thiết bị",
      children: [
        {
          label: "Bình nóng lạnh",
          value: 7,
        },
        {
          label: "Điều hòa",
          value: 8,
        },
        {
          label: "Tủ lạnh",
          value: 9,
        },
        {
          label: "Giường/Tủ",
          value: 10,
        },
        {
          label: "Kệ bếp",
          value: 14,
        },
      ],
    },
    {
      label: "Vị trí",
      children: [
        {
          label: "Gần chợ",
          value: 11,
        },
        {
          label: "Gần công viên",
          value: 15,
        },
      ],
    },
  ];

  /**
   * @description Yêu thích/Hủy yêu thích bài viết
   */
  const lovePost = async (param) => {
    if (!param) {
      param = {};
    }

    const roomPostStore = useRoomPostStore();
    if (typeof roomPostStore.lovePost === "function") {
      const payload = {
        ...param,
        user_id: contextStore.$state.user?.user_id,
      };

      if (!payload.room_post_id || !payload.user_id) {
        return;
      }

      try {
        const favoritePostID = await roomPostStore.lovePost(payload);

        if (favoritePostID) {
          showMessage("Đã yêu thích bài viết");
        } else {
          showMessage("Đã hủy yêu thích bài viết");
        }

        return favoritePostID;
      } catch (error) {
        console.log(error);
      }
    }
  };

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

  /**
   * @description Lựa chọn combobox vị trí
   * @param {String} selectedVal tên vị trí được chọn
   * @param {Number} locationType Loại vị trí đc chọn
   */
  const onSelectLocation = (selectedVal, locationType) => {
    let selectedLocation = {};
    let config = null;
    switch (locationType) {
      case LocationType.Province:
        selectedLocation = locationStore.selectProvinceById(selectedVal);
        config = addressInfo.find(
          (x) => x.locationType === LocationType.District
        );
        if (config) {
          config.items = locationStore.districtItems;
        }
        updateLocationParts(selectedLocation[locationStore.nameField], 5);
        break;
      case LocationType.District:
        selectedLocation = locationStore.selectDistrictById(selectedVal);
        config = addressInfo.find((x) => x.locationType === LocationType.Ward);
        if (config) {
          config.items = locationStore.wardItems;
        }
        updateLocationParts(selectedLocation[locationStore.nameField], 4);
        break;
      case LocationType.Ward:
        selectedLocation = locationStore.getWardById(selectedVal);
        updateLocationParts(selectedLocation[locationStore.nameField], 3);
        break;
    }
  };

  const locationParts = ref(new Array(5).fill(""));
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
    model.room_address = locationParts.value.filter((x) => x).join(", ");
  };

  return { filters, lovePost, addressInfo, onSelectLocation };
};
