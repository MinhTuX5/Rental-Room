import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { useRoomSearchCommon } from "../roomSearchCommon";
// stores
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";

export const useMainView = () => {
  const { proxy } = getCurrentInstance();
  // stores
  const roomPostStore = useRoomPostStore();

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

  const postDetails = ref([]);

  //#region Pagination
  // số thứ tự của trang hiện tại
  const page = ref(1);
  // số lượng trang
  const pageTotal = computed(() => postDetails.value.length / 10);
  //#endregion

  const tabVal = ref(1);

  onMounted(async () => {
    const payload = {
      Skip: 0,
      Take: 10,
    };
    const res = await roomPostStore.getPaging(payload);
    postDetails.value = res.data;

    window._overview = proxy;
  });

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
