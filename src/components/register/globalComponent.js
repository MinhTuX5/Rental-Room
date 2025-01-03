import DataTable from "@/components/base/table/DataTable.vue";
import TDynamicPopup from "@/components/base/popup/TDynamicPopup.vue";
import { VNumberInput } from "vuetify/labs/VNumberInput";

export function registerGlobalComponent(app) {
  app.component(DataTable.name, DataTable);
  app.component(TDynamicPopup.name, TDynamicPopup);
  app.component(VNumberInput.name, VNumberInput);
}
