import { getCurrentInstance, onMounted, reactive, ref } from "vue";
// store
import { useVehicleFeeStore } from "@/stores/roomManagement/dictionary/vehicleFeeStore";

export const usVehicleList = () => {
  const { proxy } = getCurrentInstance();

  const detailForm = "VehicleFeeDetail";

  const store = useVehicleFeeStore();

  const headers = reactive([
    {
      key: "vehicle_fee_code",
      title: "Mã phương tiện",
      align: "center",
    },
    {
      key: "vehicle_type",
      title: "Loại phương tiện",
      sort: "asc",
      align: "center",
    },
    {
      key: "fee_price",
      title: "Mức giá gửi xe",
      align: "center",
    },
    {
      key: "unit",
      title: "Đơn vị tính",
      align: "center",
    },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 108,
    },
  ]);

  onMounted(() => {});

  return { headers, detailForm, store };
};
