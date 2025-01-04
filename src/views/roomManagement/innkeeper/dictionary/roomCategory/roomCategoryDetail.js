import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useRoomCategoryStore } from "@/stores/roomManagement/dictionary/roomCategoryStore";

export const useVehicleFeeDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomCategoryStore();

  const title = ref("Loại phòng");

  const defaultModel = {
    no_of_bed_rooms: 1,
    room_area: 0,
  };

  // Giá phòng
  const feePrice = ref(0);
  watch(feePrice, (newVal) => {
    proxy.model.room_price = newVal;
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
    feePrice,
    defaultModel,
  };
};
