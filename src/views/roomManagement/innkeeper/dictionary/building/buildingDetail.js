import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useLocationStore } from "@/stores/location/locationStore";
import { useRoomCategoryStore } from "@/stores/roomManagement/dictionary/roomCategoryStore";
import { useRoomSearchCommon } from "@/views/roomSearch/roomSearchCommon";

export const useVehicleFeeDetail = () => {
  const { proxy } = getCurrentInstance();

  const locationStore = useLocationStore();
  const store = useRoomCategoryStore();

  const { addressInfo, onSelectLocation } = useRoomSearchCommon();

  const title = ref("Loại phòng");

  const selectLocation = (selectedVal, locationType) => {
    const me = proxy;
    me.model.building_address = onSelectLocation(selectedVal, locationType);
  };

  const defaultModel = {
    no_of_bed_rooms: 1,
    room_area: 0,
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
    feePrice,
    defaultModel,
    addressInfo,
    selectLocation,
    locationStore
  };
};
