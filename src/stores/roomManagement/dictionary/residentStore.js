import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// enum
import _enum from "@/common/enum";
import FilterOperator from "@/common/enum/FilterOperator";
import Gender from "../../../common/enum/Gender";
// api
import api from "../../../apis/dictionaryAPI/residentAPI";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useResidentStore = defineStore("resident", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
    idField: "resident_id",
    codeField: "resident_code",
    nameField: "resident_name",
    searchFields: ["resident_code", "resident_name", "phone_number"],
    enumFields: [
      {
        column: "gender",
        field: "resident_gender",
        enum: "ResidentGender",
      },
    ],
    dateFields: ["resident_bod"],
  }),
  getters: {
    defaultSorts(state) {
      return [
        {
          Column: state.codeField,
          IsAscending: true,
        },
      ];
    },
    defaultFilters(state) {
      return [
        {
          Field: "building_id",
          Value: contextStore.$state.user.building_id,
          Operator: FilterOperator.Equal,
        },
      ];
    },
  },
  actions: {
    ...store.actions,
    afterGetPaging(result) {
      const me = this;

      me.items = result.data;
      me.items.forEach((item) => {
        item = me.standardItem(item);
      });
      me.totalItems = result.totalCount;
    },
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
    standardItem(item) {
      switch (item.resident_gender) {
        case Gender.Male:
          item.color = "blue";
          break;
        case Gender.Female:
          item.color = "pink";
          break;
      }
      return item;
    },
  },
});
