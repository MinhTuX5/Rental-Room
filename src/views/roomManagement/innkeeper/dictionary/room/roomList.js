import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";

export const useRoomList = () => {
  const detailForm = "RoomDetail";

  const store = useRoomStore();

  const headers = [
    { key: "room_code", title: "Mã phòng", align: "start" },
    { key: "room_name", title: "Tên phòng", align: "start" },
    { key: "room_category_code", title: "Loại phòng", align: "start" },
    { key: "room_position", title: "Vị trí", align: "start" },
    { key: "room_area", title: "Diện tích", align: "end" }, // kiểu số
    { key: "room_price", title: "Giá phòng", align: "end" }, // kiểu số
    { key: "no_of_bed_rooms", title: "Số phòng ngủ", align: "end" }, // kiểu số
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
