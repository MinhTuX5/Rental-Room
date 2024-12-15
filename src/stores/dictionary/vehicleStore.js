import { defineStore } from "pinia";
// base
import { BaseDicStore } from "./baseDicStore";
// api
import vehicleAPI from "@/apis/managementAPI/vehicleAPI";

const store = new BaseDicStore(vehicleAPI);

export const useVehicleStore = defineStore("vehicle", {
  state: () => ({ ...store.state }),
  getters: {},
  actions: {
    ...store.actions,
  },
});
