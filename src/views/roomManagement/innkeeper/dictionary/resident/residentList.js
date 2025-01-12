import { onMounted } from "vue";
// store
import { useResidentStore } from "../../../../../stores/roomManagement/dictionary/residentStore";

export const usResidentList = () => {
  const store = useResidentStore();

  const detailForm = "ResidentDetail";

  const headers = [
    { key: "resident_code", title: "Mã người thuê", align: "start" },
    { key: "resident_name", title: "Họ tên", align: "start" },
    { key: "room_code", title: "Mã phòng", align: "start" },
    { key: "phone_number", title: "SĐT", align: "start" },
    { key: "is_owner", title: "Chủ hộ", align: "center", sortable: false }, // kiểu bit
    { key: "identity_number", title: "Số CCCD", align: "start" },
    { key: "gender", title: "Giới tính", align: "center" },
    { key: "on_leave", title: "Tạm vắng", align: "center", sortable: false }, // kiểu bit
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 120,
    },
  ];

  onMounted(() => {});

  return { headers, detailForm, store };
};
