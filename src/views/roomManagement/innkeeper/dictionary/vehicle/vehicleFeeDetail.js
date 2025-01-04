import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useVehicleFeeStore } from "@/stores/roomManagement/dictionary/vehicleFeeStore";
// resources
import { RoomPriceUnitMapping } from "@/common/mapping/amountUnitMapping";

export const useVehicleFeeDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useVehicleFeeStore();

  const title = ref("Phí gửi xe");

  const unitItems = ref(RoomPriceUnitMapping.map((x) => x.key));

  const defaultModel = {
    unit: unitItems.value[0],
  };

  const feePrice = ref(0);
  watch(feePrice, (newVal) => {
    proxy.model.fee_price = newVal;
  });

  onMounted(() => {
    const me = proxy;
    if (me._formParam?.model?.fee_price) {
      feePrice.value = me._formParam?.model?.fee_price;
    }
  });

  return {
    title,
    store,
    unitItems,
    defaultModel,
    feePrice,
  };
};
