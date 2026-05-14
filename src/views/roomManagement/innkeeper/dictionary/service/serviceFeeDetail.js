import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useServiceFeeStore } from "@/stores/roomManagement/dictionary/serviceFeeStore";
// enum
import _enum from "@/common/enum";

export const useServiceFeeDetail = () => {
  const store = useServiceFeeStore();

  const title = ref("Phí dịch vụ");

  const unitItems = ref([]);

  const defaultModel = {
    price_unit: 1,
  };

  onMounted(() => {
    Object.keys(_enum.ServicePriceUnit).forEach((key) => {
      unitItems.value.push({
        key: key,
        value: _enum.ServicePriceUnit[key],
      });
    });
  });

  return {
    title,
    store,
    unitItems,
    defaultModel,
  };
};
