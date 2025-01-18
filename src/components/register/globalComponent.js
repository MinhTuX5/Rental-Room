import DataTable from "@/components/base/table/DataTable.vue";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import { VCalendar } from "vuetify/labs/VCalendar";
import { VTimePicker } from 'vuetify/labs/VTimePicker'
// custom
import TDynamicPopup from "@/components/base/popup/TDynamicPopup.vue";
import TCurrencyInput from "@/components/base/input/TCurrencyInput.vue";
import TFeature from "@/components/base/views/TFeature.vue";

export function registerGlobalComponent(app) {
  app.component(DataTable.name, DataTable);
  app.component(TDynamicPopup.name, TDynamicPopup);
  app.component(VNumberInput.name, VNumberInput);
  app.component(VCalendar.name, VCalendar);
  app.component(VTimePicker.name, VTimePicker);
  app.component(TCurrencyInput.name, TCurrencyInput);
  app.component(TFeature.name, TFeature);
}
