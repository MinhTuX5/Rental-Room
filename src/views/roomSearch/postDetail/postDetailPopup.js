import { ref } from "vue";
// Resources
import { useRoomSearchCommon } from "../roomSearchCommon";

export const usePostDetailPopup = () => {
  const roomSearchCommon = useRoomSearchCommon();

  const model = ref({});

  const addressInfo = [
    {
      label: "Chọn Tỉnh/Thành phố",
      items: [
        {
          title: "Hà Nội",
          value: 0,
        },
        {
          title: "Bắc Ninh",
          value: 1,
        },
      ],
    },
    {
      label: "Chọn Quận/Huyện",
      items: [
        {
          title: "Cầu Giấy",
          value: 0,
        },
        {
          title: "Hai Bà Trưng",
          value: 1,
        },
      ],
    },
    {
      label: "Chọn Phường/Xã",
      items: [
        {
          title: "Yên Hòa",
          value: 0,
        },
        {
          title: "Bách khoa",
          value: 1,
        },
      ],
    },
    {
      label: "Chọn Đường/Phố",
      items: [
        {
          title: "Nguyễn Ngọc Vũ",
          value: 0,
        },
        {
          title: "Lê Thanh Nghị",
          value: 1,
        },
      ],
    },
  ];

  const genders = [
    {
      title: "Tất cả",
      value: 0,
    },
    {
      title: "Nam",
      value: 1,
    },
    {
      title: "Nữ",
      value: 2,
    },
  ];

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

  return {
    model,
    addressInfo,
    roomSearchCommon,
    genders,
    imageRules,
    validImageTypes,
  };
};
