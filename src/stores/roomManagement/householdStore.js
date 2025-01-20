import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// api
import api from "../../apis/roomManagementAPI/householdAPI";
// resource
import FilterOperator from "@/common/enum/FilterOperator";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useHouseholdStore = defineStore("household", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
    idField: "room_id",
    codeField: "room_code",
    searchFields: ["room_code", "room_position", "resident_code", 'resident_name'],
  }),
  getters: {
    defaultFilters(state) {
      return [
        {
          Field: "building_id",
          Value: state.building_id,
          Operator: FilterOperator.Equal,
        },
      ];
    },
    defaultSorts(state) {
      return [
        {
          Column: state.codeField,
        },
        {
          Column: "resident_code",
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
