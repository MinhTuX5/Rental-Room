import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useServiceFeeStore } from "@/stores/roomManagement/dictionary/serviceFeeStore";
// enum
import _enum from "@/common/enum";

export const useServiceFeeDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useServiceFeeStore();

  const title = ref("Phí dịch vụ");

  const unitItems = ref(Object.keys(_enum.ServicePriceUnit));

  const defaultModel = {
    price_unit: 0,
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
