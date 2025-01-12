import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
// enum
import _enum from "@/common/enum";
// api
import api from "../../apis/roomManagementAPI/vehicleAPI";

const store = new BaseDicStore(api);

export const useVehicleStore = defineStore("vehicle", {
  state: () => ({
    ...store.state,
    idField: "vehicle_id",
    nameField: "vehicle_type",
  }),
  getters: {},
  actions: {
    ...store.actions,
    afterInsertAsync(item) {
      const me = this;
      me.items.unshift(item);
      me.totalItems++;
    },
    afterDeleteAsync(id) {
      const me = this;
      me.items = me.items.filter((x) => x[me.idField] != id);
      me.totalItems--;
    },
    afterUpdate(item) {
      const me = this;
      const curItem = me.items.find((x) => x[me.idField] == item[me.idField]);
      if (curItem) {
        Object.assign(curItem, item);
      }
    },
  },
});
