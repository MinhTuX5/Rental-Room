import { onMounted, reactive, ref } from "vue";
// store
import { useVehicleStore } from "@/stores/dictionary/vehicleStore";

export const usVehicleList = () => {
  const detailForm = "VehicleFeeDetail";

  const store = useVehicleStore();

  const searchFields = ref([store.$state.codeField, store.$state.nameField]);

  const headers = ref([
    { title: "Ngày chi tiêu", key: "spendingDate" },
    { title: "Người chi", key: "spender" },
    { title: "Số tiền", key: "amount" },
    { title: "Ghi chú", key: "note" },
  ]);

  const items = [
    {
      spendingDate: new Date().toISOString().split("T")[0],
      spender: "John Doe",
      amount: 200000,
      note: "Chi tiêu tháng 1",
    },
  ];

  onMounted(() => {});

  return { headers, detailForm, store, searchFields, items };
};
