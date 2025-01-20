import { onMounted, ref } from "vue";
// store
import { useVehicleFeeStore } from "@/stores/roomManagement/dictionary/vehicleFeeStore";
// resources
import { RoomPriceUnitMapping } from "@/common/mapping/amountUnitMapping";

export const useVehicleFeeDetail = () => {
  const store = useVehicleFeeStore();

  const title = ref("Phí gửi xe");

  const unitItems = ref(RoomPriceUnitMapping.map((x) => x.key));

  const defaultModel = {
    unit: unitItems.value[0],
  };

  onMounted(() => {});

  return {
    title,
    store,
    unitItems,
    defaultModel,
  };
};
