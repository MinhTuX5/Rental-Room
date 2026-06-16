import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";

export const useRoomList = () => {
  const detailForm = "RoomDetail";

  const store = useRoomStore();

  const headers = [
    { key: "room_code", title: "Mã phòng", align: "center" },
    { key: "room_name", title: "Tên phòng", align: "center" },
    { key: "room_category_code", title: "Loại phòng", align: "center" },
    { key: "room_position", title: "Vị trí", align: "center" },
    { key: "room_area", title: "Diện tích", align: "center" }, // kiểu số
    { key: "room_price", title: "Giá phòng", align: "center" }, // kiểu số
    { key: "no_of_bed_rooms", title: "Số phòng ngủ", align: "center" }, // kiểu số
    { key: "is_empty", title: "Còn trống", align: "center", sortable: false },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 120,
    },
  ];

  return { headers, detailForm, store };
};
