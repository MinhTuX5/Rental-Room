import { useHouseholdStore } from "@/stores/roomManagement/householdStore";

export const useHouseholdList = () => {
  const detailForm = "HouseholdDetail";

  const store = useHouseholdStore();

  const headers = [
    { key: store.codeField, title: "Mã phòng" },
    { key: "room_position", title: "Vị trí phòng" },
    { key: "resident_code", title: "Mã chủ phòng" },
    { key: "resident_name", title: "Tên chủ phòng" },
    { key: "phone_number", title: "Số điện thoại" },
    { key: "member_count", title: "Số thành viên", align: "end" },
    { key: "vehicle_count", title: "Số phương tiện", align: "end" },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 110,
    },
  ];

  return { headers, detailForm, store };
};
