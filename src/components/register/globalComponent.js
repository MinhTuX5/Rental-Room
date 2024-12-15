import DataTable from "@/components/base/table/DataTable.vue";

export function registerGlobalComponent(app) {
  app.component(DataTable.name, DataTable);
}
