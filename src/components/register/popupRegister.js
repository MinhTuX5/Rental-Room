import { defineAsyncComponent } from "vue";

const RoomList = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/roomList/RoomList.vue")
);

const RoomInfo = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/roomInfo/RoomInfo.vue")
);

const Expense = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/expense/Expense.vue")
);
const Calculation = defineAsyncComponent(() =>
  import("@/views/roomManagement/renter/calculation/Calculation.vue")
);

//#region Account
const PasswordUpdating = defineAsyncComponent(() =>
  import("@/views/auth/updating/PasswordUpdating.vue")
);
//#endregion

//#region dictionary
// C:\Users\thinh\OneDrive\Máy tính\Rental-Room\src\views\roomManagement\innkeeper\dictionary\vehicle\VehicleList.vue
const VehicleList = defineAsyncComponent(() =>
  import("@/views/roomManagement/innkeeper/dictionary/vehicle/VehicleList.vue")
);
//#endregion

export function registerPopup(app) {
  app.component("PasswordUpdating", PasswordUpdating);
  app.component("RoomList", RoomList);
  app.component("RoomInfo", RoomInfo);
  app.component("Expense", Expense);
  app.component("Calculation", Calculation);
  app.component("VehicleList", VehicleList);
}
