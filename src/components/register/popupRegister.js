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

//#region management
const HouseholdDetail = defineAsyncComponent(() =>
  import("@/views/roomManagement/innkeeper/household/HouseholdDetail.vue")
);
const PaymentDetail = defineAsyncComponent(() =>
  import("@/views/roomManagement/innkeeper/fee/PaymentDetail.vue")
);
const FeeDetail = defineAsyncComponent(() =>
  import("@/views/roomManagement/innkeeper/fee/FeeDetail.vue")
);
const VehicleDetail = defineAsyncComponent(() =>
  import("@/views/roomManagement/innkeeper/household/VehicleDetail.vue")
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
const RoomDetail = defineAsyncComponent(() =>
  import("@/views/roomManagement/innkeeper/dictionary/room/RoomDetail.vue")
);
const ContractDetail = defineAsyncComponent(() =>
  import(
    "@/views/roomManagement/innkeeper/dictionary/contract/ContractDetail.vue"
  )
);
const ContractResidentsPopup = defineAsyncComponent(() =>
  import(
    "@/views/roomManagement/innkeeper/dictionary/contract/ContractResidentsPopup.vue"
  )
);
const ResidentDetail = defineAsyncComponent(() =>
  import(
    "@/views/roomManagement/innkeeper/dictionary/resident/ResidentDetail.vue"
  )
);
const ExpenseDetail = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/expense/ExpenseDetail.vue")
);
const ExpenseCategoryDetail = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/dictionary/ExpenseCategoryDetail.vue")
);
const AppointmentScheduleDetail = defineAsyncComponent(() =>
  import("@/views/auth/schedule/AppointmentScheduleDetail.vue")
);
const BuildingDetail = defineAsyncComponent(() =>
  import(
    "@/views/roomManagement/innkeeper/dictionary/building/BuildingDetail.vue"
  )
);

//#endregion
//#endregion
export function registerPopup(app) {
  app.component("RoomInfo", RoomInfo);
  app.component("Expense", Expense);
  app.component("Calculation", Calculation);
  app.component("VehicleFeeDetail", VehicleFeeDetail);
  app.component("ServiceFeeDetail", ServiceFeeDetail);
  app.component("RoomCategoryDetail", RoomCategoryDetail);
  app.component("RoomDetail", RoomDetail);
  app.component("ContractDetail", ContractDetail);
  app.component("ContractResidentsPopup", ContractResidentsPopup);
  app.component("ResidentDetail", ResidentDetail);
  app.component("HouseholdDetail", HouseholdDetail);
  app.component("VehicleDetail", VehicleDetail);
  app.component("PaymentDetail", PaymentDetail);
  app.component("FeeDetail", FeeDetail);
  app.component("ExpenseCategoryDetail", ExpenseCategoryDetail);
  app.component("ExpenseDetail", ExpenseDetail);
  app.component("AppointmentScheduleDetail", AppointmentScheduleDetail);
  app.component("BuildingDetail", BuildingDetail);
}
