// store
import { useRoomCategoryStore } from "@/stores/roomManagement/dictionary/roomCategoryStore";

export const useRoomCategoryList = () => {
  const detailForm = "RoomCategoryDetail";

  const store = useRoomCategoryStore();

  const headers = [
    { key: "room_category_code", title: "Mã loại phòng" },
    { key: "room_category_name", title: "Tên loại phòng" },
    { key: "room_price", title: "Giá phòng", align: "end" },
    { key: "room_area", title: "Diện tích phòng", align: "end" },
    { key: "no_of_bed_rooms", title: "Số phòng ngủ", align: "end" },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 140,
    },
  ];

  return { headers, detailForm, store };
};
