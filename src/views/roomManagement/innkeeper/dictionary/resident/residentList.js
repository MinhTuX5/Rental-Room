import { onMounted } from "vue";
// store
import { useResidentStore } from "../../../../../stores/roomManagement/dictionary/residentStore";

export const usResidentList = () => {
  const store = useResidentStore();

  const detailForm = "ResidentDetail";

  const headers = [
    { key: "resident_code", title: "Mã cư dân", align: "start" },
    { key: "resident_name", title: "Họ và Tên", align: "start" },
    { key: "phone_number", title: "Số điện thoại", align: "start" },
    { key: "is_owner", title: "Chủ hộ", align: "center", sortable: false }, // kiểu bit
    { key: "identity_number", title: "Số CMT/CCCD", align: "start" },
    { key: "gender", title: "Giới tính" },
    { key: "bod", title: "Ngày sinh", align: "start" },
    { key: "career", title: "Nghề nghiệp", align: "start" },
    { key: "onLeave", title: "Tạm vắng", align: "center", sortable: false }, // kiểu bit
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 140,
    },
  ];

  onMounted(() => {});

  return { headers, detailForm, store };
};
