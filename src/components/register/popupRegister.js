import { defineAsyncComponent } from "vue";

const PostDetailPopup = defineAsyncComponent(() =>
  import("@/views/roomSearch/postDetail/PostDetailPopup.vue")
);

const PostManagement = defineAsyncComponent(() =>
  import("@/views/roomSearch/postManagement/PostManagement.vue")
);
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
const InfoUpdating = defineAsyncComponent(() =>
  import("@/views/auth/updating/InfoUpdating.vue")
);
const PasswordUpdating = defineAsyncComponent(() =>
  import("@/views/auth/updating/PasswordUpdating.vue")
);
const AppointmentSchedule = defineAsyncComponent(() =>
  import("@/views/auth/schedule/AppointmentSchedule.vue")
);
//#endregion

//#region dictionary
// C:\Users\thinh\OneDrive\Máy tính\Rental-Room\src\views\roomManagement\innkeeper\dictionary\vehicle\VehicleList.vue
const VehicleList = defineAsyncComponent(() =>
  import("@/views/roomManagement/innkeeper/dictionary/vehicle/VehicleList.vue")
);
//#endregion

export function registerPopup(app) {
  app.component("PostDetailPopup", PostDetailPopup);
  app.component("PostManagement", PostManagement);
  app.component("InfoUpdating", InfoUpdating);
  app.component("PasswordUpdating", PasswordUpdating);
  app.component("AppointmentSchedule", AppointmentSchedule);
  app.component("RoomList", RoomList);
  app.component("RoomInfo", RoomInfo);
  app.component("Expense", Expense);
  app.component("Calculation", Calculation);
  app.component("VehicleList", VehicleList);
}
