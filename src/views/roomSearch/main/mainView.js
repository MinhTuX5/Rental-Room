import { ref } from "vue";
import { useRoomSearchCommon } from "../roomSearchCommon";

export const useMainView = () => {
  const roomSearchCommon = useRoomSearchCommon();

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
      image: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    },
    {
      location: "Đà Nẵng",
      image: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    },
    {
      location: "Hồ Chí Minh",
      image: "https://cdn.vuetifyjs.com/images/parallax/material.jpg",
    },
  ];

  const postDetails = [
    {
      title:
        "Chung cư mini thoáng mát 35m2 tại sô nhà 46 ngõ 204 Trần Duy Hưng",
      price: 1200000,
      area: 30,
      description:
        "Cho thuê phòng , NHẬN PHÒNG Ở LUÔN TỪ 1.5.24. Diện tích phòng 12m2, KHÔNG KHÉP KÍN. CÓ ĐIỀU HOÀ. Phòng sạch sẽ, không gian thoáng mát, yên tĩnh,…",
      author: "Nguyễn Huệ",
      address:
        "Số 25A, ngõ 139 Nguyễn Ngọc Vũ, phường Trung Hòa, quận Cầu Giấy, thành phố Hà Nội",
    },
    {
      title: "CCMN đầy đủ tiện nghi không cần nghĩ suy",
      price: 5000000,
      area: 35,
      description:
        "Cho thuê phòng , NHẬN PHÒNG Ở LUÔN TỪ 1.5.24. Diện tích phòng 12m2, KHÔNG KHÉP KÍN. CÓ ĐIỀU HOÀ. Phòng sạch sẽ, không gian thoáng mát, yên tĩnh,…",
      author: "Nguyễn Tất Thành",
      address:
        "Số 25A, ngõ 139 Nguyễn Ngọc Vũ, phường Trung Hòa, quận Cầu Giấy, thành phố Hà Nội",
    },
  ];

  const tabVal = ref(1);

  return {
    searchConfig,
    tabVal,
    popularPlaces,
    postDetails,
    roomSearchCommon,
  };
};
