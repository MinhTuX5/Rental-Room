import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useServiceFeeStore } from "@/stores/roomManagement/dictionary/serviceFeeStore";
// enum
import _enum from "../@/common/enum";

export const useServiceFeeDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useServiceFeeStore();

  const title = ref("Phí dịch vụ");

  const unitItems = ref(Object.keys(_enum.ServicePriceUnit));

  const defaultModel = {
    price_unit: 0,
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
