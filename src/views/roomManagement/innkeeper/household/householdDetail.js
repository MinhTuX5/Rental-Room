import { onMounted, ref, getCurrentInstance } from "vue";
// store
import { useHouseholdStore } from "@/stores/roomManagement/HouseholdStore";
import { useVehicleStore } from "@/stores/roomManagement/vehicleStore";
// resources
import { getEnumItem } from "@/common/commonFunction";
// enum
import _enum from "@/common/enum";
import FormState from "../../../../common/enum/FormState";
// enum
import Gender from "@/common/enum/Gender";

export const useHouseholdDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useHouseholdStore();
  const vehicleStore = useVehicleStore();

  const title = ref("Thông tin hộ gia đình");
  const updateText = "Cập nhật";

  const residentHeaders = [
    { key: "resident_code", title: "Mã người thuê", align: "start" },
    { key: "resident_name", title: "Họ và tên", align: "start" },
    { key: "phone_number", title: "Số điện thoại", align: "start" },
    { key: "gender", title: "Giới tính", align: "center" },
    { key: "on_leave", title: "Tạm vắng", align: "center", sortable: false }, // kiểu bit
  ];

  const vehicleHeaders = [
    { key: "resident_code", title: "Mã chủ xe", align: "start" },
    { key: "resident_name", title: "Chủ xe", align: "start" },
    { key: "vehicle_type", title: "Loại phương tiện", align: "start" },
    { key: "license_plate", title: "Biển số xe", align: "start" },
    { key: "color", title: "Màu sắc", align: "start" },
    { key: "vehicle_brand", title: "Mẫu xe", align: "start" },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 108,
    },
  ];

  const defaultModel = {
    residents: [],
    vehicles: [],
  };

  const editVehicle = (item) =>{
    const me = proxy;
    me.viewForm('VehicleDetail', {
      editMode: FormState.Update,
      model: item
    })
  }

  onMounted(async () => {
    const me = proxy;

    let enumFields = [];

    const roomID = me._formParam?.model?.room_id;
    if (roomID) {
      const details = await store.getById(roomID);
      if (Array.isArray(details?.residents)) {
        me.model.residents = details.residents;
        enumFields = [
          {
            column: "gender",
            field: "resident_gender",
            enum: "ResidentGender",
          },
        ];
        me.model.residents.forEach((x) => {
          x = getEnumItem(x, enumFields);
          switch (x.resident_gender) {
            case Gender.Male:
              x.color = "blue";
              break;
            case Gender.Female:
              x.color = "pink";
              break;
          }
        });
      }

      vehicleStore.$state.items = [];
      if (Array.isArray(details?.vehicles)) {
        details.vehicles.forEach((x) => {
          const resident = me.model.residents.find(
            (y) => y.resident_id === x.resident_id
          );
          if (resident) {
            x.resident_name = resident.resident_name;
            x.resident_code = resident.resident_code;
          }
        });

        vehicleStore.$state.items = details.vehicles;
      }
    }
  });

  return {
    title,
    store,
    updateText,
    residentHeaders,
    defaultModel,
    vehicleHeaders,
    vehicleStore,
    editVehicle
  };
};
