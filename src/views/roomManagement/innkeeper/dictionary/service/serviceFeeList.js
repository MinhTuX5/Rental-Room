import { reactive } from "vue";
// store
import { useServiceFeeStore } from "@/stores/roomManagement/dictionary/serviceFeeStore";
// Enum
import _enum from "@/common/enum";

export const usServiceFeeList = () => {
  const store = useServiceFeeStore();

  const detailForm = "ServiceFeeDetail";

  const headers = reactive([
    {
      key: "service_fee_code",
      title: "Mã dịch vụ",
      align: "center",
    },
    {
      key: "service_type",
      title: "Loại dịch vụ",
      sort: "asc",
      align: "center",
    },
    {
      key: "fee_price",
      title: "Mức giá dịch vụ",
      align: "center",
    },
    {
      key: "displayed_price_unit",
      title: "Đơn vị tính",
      align: "center",
    },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 140,
    },
  ]);

  return { detailForm, headers, store };
};
