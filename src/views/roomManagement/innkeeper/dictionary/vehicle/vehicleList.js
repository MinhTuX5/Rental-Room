import { onMounted, reactive, ref } from "vue";
// store
import { useVehicleStore } from "@/stores/dictionary/vehicleStore";

export const usVehicleList = () => {
  const detailForm = "VehicleFeeDetail";

  const store = useVehicleStore();

  const searchFields = ref([store.$state.codeField, store.$state.nameField]);

  const headers = reactive([
    {
      prop: "vehicle_code",
      label: "Mã phương tiện",
      sortable: true,
      width: 200,
      align: "center",
    },
    {
      prop: "vehicle_name",
      label: "Loại phương tiện",
      minWidth: 150,
    },
    {
      prop: "vehicle_price",
      label: "Mức giá gửi xe / tháng",
      width: 300,
      align: "right",
    },
  ]);

  onMounted(() => {});

  return { headers, detailForm, store, searchFields, items };
};
