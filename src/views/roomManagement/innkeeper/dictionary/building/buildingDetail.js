import { getCurrentInstance, onMounted, ref } from "vue";
import { useBuildingStore } from "../../../../../stores/roomManagement/dictionary/buildingStore";
import { useLocationStore } from "@/stores/location/locationStore";
import { useRoomSearchCommon } from "@/views/roomSearch/roomSearchCommon";
import i18nApp from "@/constant/resource/i18nApp";
import LocationType from "@/common/enum/LocationType";
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextManageStore } from "@/stores/contextManageStore";
import BuildingStatus from "../../../../../common/enum/BuildingStatus";
import { getManagementContext } from "../../../../../common/commonFunction";
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";

export const useBuildingDetail = () => {
  const { proxy } = getCurrentInstance();

  const locationStore = useLocationStore();
  const store = useBuildingStore();
  const roomPostStore = useRoomPostStore();
  const roomStore = useRoomStore();

  const { addressInfo, onSelectLocation, updateLocationParts } =
    useRoomSearchCommon();

  const title = ref("Tòa nhà");

  const selectLocation = (selectedVal, locationType) => {
    const me = proxy;
    me.model.building_address = onSelectLocation(selectedVal, locationType);
  };

  const updateLocation = (a, b) => {
    const me = proxy;
    me.model.building_address = updateLocationParts(a, b);
  };

  const rules = {
    required: (v) => !!v || i18nApp.rules.required,
  };

  const customBeforeSubmit = () => {
    const me = proxy;
    debugger;
    me.model.user_id = useContextManageStore().$state.user.user_id;
    me.model.status = isUsing.value
      ? BuildingStatus.Using
      : BuildingStatus.NoUsing;
  };

  const customAfterSubmit = (data) => {
    const me = proxy;
    if (me.editMode == 1) {
      const payload = {
        province_id: me.model.province_id,
        district_id: me.model.district_id,
        ward_id: me.model.ward_id,
        street_name: me.model.street_name,
        house_number: me.model.house_number,
        building_id: data.building_id,
      };
      roomPostStore.saveLocation(payload).catch((error) => {
        console.error(error);
      });
    }

    if (data.status === BuildingStatus.Using) {
      const context = getManagementContext();
      context.user.building_id = data.building_id;
      context.user.building_name = data.building_name;
      localStorage.setItem("context_management", JSON.stringify(context));

      const contextStore = useContextManageStore();

      contextStore.$state.user = context.user;

      console.log(contextStore);
      

      roomStore.$state.invalidCache = true;
    }

    if (typeof me._formParam.refresh === "function") {
      me._formParam.refresh();
    }
  };

  const isUsing = ref(false);
  const disableUsingBtn = ref(false);

  onMounted(() => {
    const me = proxy;
    if (me.editMode === 2) {
      onSelectLocation(me.model.province_id, LocationType.Province);
      onSelectLocation(me.model.district_id, LocationType.District);
      isUsing.value = me.model.status === BuildingStatus.Using;
      if (isUsing.value) {
        disableUsingBtn.value = true;
      }
    }
  });

  return {
    title,
    store,
    selectLocation,
    locationStore,
    addressInfo,
    rules,
    updateLocation,
    customAfterSubmit,
    customBeforeSubmit,
    isUsing,
    disableUsingBtn,
  };
};
