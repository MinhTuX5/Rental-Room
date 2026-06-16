import { useHouseholdStore } from "@/stores/roomManagement/householdStore";
// ánh xạ tới component HouseholdDetail để mở form chi tiết khi click vào một hàng trong bảng
export const useHouseholdList = () => {
  const detailForm = "HouseholdDetail";

  const store = useHouseholdStore();

  const headers = [
    { key: "room_name", title: "Tên phòng", align: "center" },
    { key: "resident_name", title: "Tên cư dân", align: "center" },
    { key: "phone_number", title: "Số điện thoại", align: "center" },
    { key: "member_count", title: "Số thành viên", align: "center" },
    { key: "vehicle_count", title: "Số phương tiện", align: "center" },
    {
      title: "Chi tiết",
      key: "actions",
      sortable: false,
      align: "center",
      width: 110,
    },
  ];

  return { headers, detailForm, store };
};
