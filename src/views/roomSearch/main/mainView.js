import { computed, ref } from "vue";
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
      is_liked: true,
    },
    {
      title: "Căn hộ view đẹp 40m2 tại số 10 đường Lê Lai",
      price: 1500000,
      area: 40,
      description:
        "Căn hộ mới xây, nội thất đầy đủ, view đẹp, gần trung tâm thành phố, thuận tiện đi lại.",
      author: "Trần Hương",
      address: "Số 10, đường Lê Lai, quận 1, thành phố Hồ Chí Minh",
      is_liked: false,
    },
    {
      title: "Chung cư tiện nghi 25m2 tại số 5 ngõ 68 Lê Thanh Nghị",
      price: 900000,
      area: 25,
      description:
        "Chung cư mới, đầy đủ tiện nghi, gần trường học và chợ, an ninh tốt.",
      author: "Nguyễn An",
      address:
        "Số 5, ngõ 68 Lê Thanh Nghị, quận Hai Bà Trưng, thành phố Hà Nội",
      is_liked: true,
    },
    {
      title: "Phòng trọ view biển 20m2 tại số 15 đường Trần Phú",
      price: 2000000,
      area: 20,
      description:
        "Phòng trọ view biển, thoáng mát, yên tĩnh, gần bãi biển, phù hợp cho người yêu biển.",
      author: "Lê Thị Lan",
      address: "Số 15, đường Trần Phú, thành phố Đà Nẵng",
      is_liked: false,
    },
    {
      title: "Căn hộ phong cách hiện đại 50m2 tại số 8 đường Trần Hưng Đạo",
      price: 1800000,
      area: 50,
      description:
        "Căn hộ thiết kế hiện đại, đầy đủ tiện nghi, view đẹp, gần trung tâm thành phố.",
      author: "Phạm Văn Nam",
      address: "Số 8, đường Trần Hưng Đạo, quận 5, thành phố Hồ Chí Minh",
      is_liked: true,
    },
    {
      title: "Nhà trọ giá rẻ 15m2 tại số 20 ngõ 30 Lê Văn Lương",
      price: 700000,
      area: 15,
      description:
        "Phòng trọ giá rẻ, sạch sẽ, thoáng mát, gần trường Đại học Quốc gia.",
      author: "Nguyễn Thị Hương",
      address: "Số 20, ngõ 30 Lê Văn Lương, quận Thanh Xuân, thành phố Hà Nội",
      is_liked: true,
    },
    {
      title: "Căn hộ view sông 45m2 tại số 30 đường Nguyễn Huệ",
      price: 2200000,
      area: 45,
      description:
        "Căn hộ view sông, yên tĩnh, gần công viên, thuận tiện di chuyển.",
      author: "Trần Văn Quân",
      address: "Số 30, đường Nguyễn Huệ, quận 1, thành phố Hồ Chí Minh",
      is_liked: false,
    },
    {
      title: "Phòng trọ tiện nghi 18m2 tại số 12 ngõ 5 Hoàng Cầu",
      price: 800000,
      area: 18,
      description:
        "Phòng trọ mới xây, đầy đủ tiện nghi, gần trung tâm thành phố, an ninh tốt.",
      author: "Trần Thị Mai",
      address: "Số 12, ngõ 5 Hoàng Cầu, quận Đống Đa, thành phố Hà Nội",
      is_liked: false,
    },
    {
      title: "Chung cư view thành phố 60m2 tại số 25 đường Lê Lai",
      price: 2500000,
      area: 60,
      description:
        "Chung cư cao cấp, view đẹp, gần trung tâm, tiện ích xung quanh đầy đủ.",
      author: "Nguyễn Văn A",
      address: "Số 25, đường Lê Lai, quận 1, thành phố Hồ Chí Minh",
      is_liked: true,
    },
    {
      title: "Nhà trọ gần trường học 22m2 tại số 18 ngõ 10 Trần Phú",
      price: 850000,
      area: 22,
      description:
        "Nhà trọ gần trường học, an ninh tốt, giao thông thuận tiện, phòng sạch sẽ.",
      author: "Lê Văn B",
      address: "Số 18, ngõ 10 Trần Phú, quận Hai Bà Trưng, thành phố Hà Nội",
      is_liked: true,
    },
    {
      title: "Nhà trọ gần trường học 22m2 tại số 18 ngõ 10 Trần Phú",
      price: 850000,
      area: 22,
      description:
        "Nhà trọ gần trường học, an ninh tốt, giao thông thuận tiện, phòng sạch sẽ.",
      author: "Lê Văn B",
      address: "Số 18, ngõ 10 Trần Phú, quận Hai Bà Trưng, thành phố Hà Nội",
      is_liked: true,
    },
  ];

  //#region Pagination
  const page = ref(1);
  const pageTotal = computed(() => (postDetails.length % 10) + 1);
  //#endregion

  const tabVal = ref(1);

  return {
    searchConfig,
    tabVal,
    popularPlaces,
    postDetails,
    roomSearchCommon,
    page,
    pageTotal,
  };
};
