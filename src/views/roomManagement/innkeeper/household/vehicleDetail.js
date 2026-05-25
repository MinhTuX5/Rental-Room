import { onMounted, ref, getCurrentInstance } from "vue";
// store
import { useVehicleStore } from "../../../../stores/roomManagement/vehicleStore";
import { useVehicleFeeStore } from "@/stores/roomManagement/dictionary/vehicleFeeStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// enum
import _enum from "@/common/enum";

export const useVehicleDetail = () => {
  const { proxy } = getCurrentInstance();
  const store = useVehicleStore();
  const vehicleFeeStore = useVehicleFeeStore();

  const title = ref("Thông tin xe");

  const defaultModel = {
    resident_id: "",
    resident_name: "",
    vehicle_type: "",
    vehicle_type_id: "",
    license_plate: "",
    color: "",
    vehicle_brand: "",
  };

  const customAfterBeforeOpen = () => {
    const me = proxy;
    console.log("[VehicleDetail] customAfterBeforeOpen called. _formParam:", me._formParam);
    if (me._formParam?.residents) {
      me.residents = me._formParam.residents;
      console.log("[VehicleDetail] residents loaded into proxy data:", me.residents);
      if (me.editMode === _enum.Mode.Add && me.residents.length > 0) {
        me.model.resident_id = me.residents[0].resident_id;
        me.model.resident_name = me.residents[0].resident_name;
        console.log("[VehicleDetail] model initialized with first resident:", me.model);
      }
    } else {
      console.log("[VehicleDetail] _formParam.residents is missing!");
    }
  };

  const onSelectResident = (val) => {
    const me = proxy;
    console.log("[VehicleDetail] onSelectResident called. Selected ID:", val);
    const selected = me.residents.find((x) => x.resident_id === val);
    if (selected) {
      me.model.resident_name = selected.resident_name;
      console.log("[VehicleDetail] Updated resident name to:", selected.resident_name);
    }
  };

  const customBeforeSubmit = () => {
    const me = proxy;
    console.log("[VehicleDetail] customBeforeSubmit called. model:", me.model);
    if (Array.isArray(me.fees) && me.model.vehicle_type) {
      const matchedFee = me.fees.find(
        (f) => f.vehicle_type && f.vehicle_type.trim().toLowerCase() === me.model.vehicle_type.trim().toLowerCase()
      );
      if (matchedFee) {
        me.model.vehicle_type_id = matchedFee.vehicle_fee_id;
        console.log("[VehicleDetail] Matched vehicle_type_id:", me.model.vehicle_type_id);
      } else if (me.fees.length > 0) {
        me.model.vehicle_type_id = me.fees[0].vehicle_fee_id;
        console.log("[VehicleDetail] Fallback vehicle_type_id assigned:", me.model.vehicle_type_id);
      }
    } else if (Array.isArray(me.fees) && me.fees.length > 0) {
      me.model.vehicle_type_id = me.fees[0].vehicle_fee_id;
      console.log("[VehicleDetail] Default vehicle_type_id assigned:", me.model.vehicle_type_id);
    }
  };

  onMounted(async () => {
    const me = proxy;
    console.log("[VehicleDetail] onMounted called. editMode:", me.editMode);
    try {
      const fees = await vehicleFeeStore.getAll();
      console.log("[VehicleDetail] Loaded fees from store:", fees);
      if (Array.isArray(fees)) {
        // Filter fees by the active building_id
        const contextStore = useContextManageStore();
        const activeBuildingId = contextStore.$state.user?.building_id;
        console.log("[VehicleDetail] activeBuildingId:", activeBuildingId);

        const filteredFees = fees.filter(
          (f) => f.building_id === activeBuildingId
        );
        console.log("[VehicleDetail] filteredFees for activeBuildingId:", filteredFees);
        me.fees = filteredFees;

        // Get unique vehicle types
        const types = filteredFees.map((f) => f.vehicle_type).filter(Boolean);
        me.vehicleTypes = [...new Set(types)];
        console.log("[VehicleDetail] Unique vehicle types extracted:", me.vehicleTypes);

        // In Add mode, pre-populate vehicle_type if available
        if (me.editMode === _enum.Mode.Add && me.vehicleTypes.length > 0) {
          me.model.vehicle_type = me.vehicleTypes[0];
          console.log("[VehicleDetail] Prepopulated vehicle type:", me.model.vehicle_type);
        }
      }
    } catch (error) {
      console.error("[VehicleDetail] Error loading vehicle types:", error);
    }
  });

  return {
    title,
    store,
    defaultModel,
    customAfterBeforeOpen,
    onSelectResident,
    customBeforeSubmit,
    _enum,
  };
};
