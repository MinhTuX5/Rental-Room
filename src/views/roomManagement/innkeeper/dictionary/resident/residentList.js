import { onMounted } from "vue";
// store
import { useResidentStore } from "../../../../../stores/roomManagement/dictionary/residentStore";

export const usResidentList = () => {
  const store = useResidentStore();

  const detailForm = "ResidentDetail";

  const headers = [
    { key: "resident_code", title: "Mã người thuê", align: "center" },
    { key: "resident_name", title: "Họ tên", align: "center" },
    { key: "room_name", title: "Tên phòng", align: "center", sortable: false },
    { key: "phone_number", title: "SĐT", align: "center" },
    { key: "is_owner", title: "Chủ hộ", align: "center", sortable: false }, // kiểu bit
    { key: "identity_number", title: "Số CCCD", align: "center" },
    { key: "displayed_resident_gender", title: "Giới tính", align: "center" },
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
