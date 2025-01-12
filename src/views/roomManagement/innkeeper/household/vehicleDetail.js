import { onMounted, ref } from "vue";
// store
import { useVehicleStore } from "../../../../stores/roomManagement/vehicleStore";

export const useVehicleDetail = () => {
  const store = useVehicleStore();

  const title = ref("Thông tin xe");

  const defaultModel = {};

  onMounted(() => {});

  return {
    title,
    store,
    defaultModel,
  };
};
