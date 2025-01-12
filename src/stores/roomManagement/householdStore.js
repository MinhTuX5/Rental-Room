import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextStore } from "@/stores/contextStore";
// api
import api from "../../apis/roomManagementAPI/householdAPI";
// resource
import FilterOperator from "@/common/enum/FilterOperator";

const store = new BaseDicStore(api);

export const useHouseholdStore = defineStore("household", {
  state: () => ({
    ...store.state,
    buildingID: useContextStore().$state.buildingID,
    idField: "room_id",
    codeField: "room_code",
    searchFields: ["room_code", "room_position", "resident_code", 'resident_name'],
  }),
  getters: {
    defaultFilters(state) {
      return [
        {
          Field: "building_id",
          Value: state.buildingID,
          Operator: FilterOperator.Equal,
        },
      ];
    },
    defaultSorts(state) {
      return [
        {
          Field: state.codeField,
        },
        {
          Field: "resident_code",
        },
      ];
    },
  },
  actions: {
    ...store.actions,
    afterGetPaging(result) {
      const me = this;
      me.items = result.data;
      me.totalItems = result.totalCount;
    },
  },
});
