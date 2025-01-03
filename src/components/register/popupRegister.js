import { defineAsyncComponent } from "vue";

const RoomInfo = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/roomInfo/RoomInfo.vue")
);

const Expense = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/expense/Expense.vue")
);
const Calculation = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/calculation/Calculation.vue")
);

//#region dictionary
const VehicleFeeDetail = defineAsyncComponent(() =>
  import(
    "@/views/roomManagement/innkeeper/dictionary/vehicle/VehicleFeeDetail.vue"
  )
);
const ServiceFeeDetail = defineAsyncComponent(() =>
  import(
    "@/views/roomManagement/innkeeper/dictionary/service/ServiceFeeDetail.vue"
  )
);
const RoomCategoryDetail = defineAsyncComponent(() =>
  import(
    "@/views/roomManagement/innkeeper/dictionary/roomCategory/RoomCategoryDetail.vue"
  )
);
//#endregion

export function registerPopup(app) {
  app.component("RoomInfo", RoomInfo);
  app.component("Expense", Expense);
  app.component("Calculation", Calculation);
  app.component("VehicleFeeDetail", VehicleFeeDetail);
  app.component("ServiceFeeDetail", ServiceFeeDetail);
  app.component("RoomCategoryDetail", RoomCategoryDetail);
}
