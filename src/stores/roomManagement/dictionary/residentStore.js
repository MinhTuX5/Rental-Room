import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextStore } from "@/stores/contextStore";
// resource
import { convertCurrencyFormat } from "@/common/commonFunction";
// enum
import _enum from "@/common/enum";
import FilterOperator from "@/common/enum/FilterOperator";
// api
import api from "../../../apis/dictionaryAPI/residentAPI";

const store = new BaseDicStore(api);
const contextStore = useContextStore();

export const useResidentStore = defineStore("resident", {
  state: () => ({
    ...store.state,
    buildingID: contextStore.$state.buildingID,
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
          Field: state.codeField,
          IsAscending: true,
        },
      ];
    },
    defaultFilters(state) {
      return [
        {
          Field: "building_id",
          Value: state.buildingID,
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
      item = me.standardItem(item);
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
        item = me.standardItem(item);
        Object.assign(curItem, item);
      }
    },
    getEnumItem(item) {
      const me = this;
      me.enumFields.forEach((x) => {
        const keys = Object.keys(_enum[x.enum]);
        const key = keys.find((y) => _enum[x.enum][y] == item[x.field]);
        if (key) item[x.column] = key;
      });
      return item;
    },
    getAmountItem(item) {
      const me = this;
      me.numberFields.forEach((y) => {
        item[y] = convertCurrencyFormat(item[y]);
      });
      return item;
    },
    standardItem(item) {
      const me = this;
      item = me.getEnumItem(item);
      item = me.getAmountItem(item);
      return item;
    },
  },
});
