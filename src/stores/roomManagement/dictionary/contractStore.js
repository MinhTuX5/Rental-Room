import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextStore } from "@/stores/contextStore";
// resource
import { convertCurrencyFormat } from "@/common/commonFunction";
import FilterOperator from "@/common/enum/FilterOperator";
// enum
import _enum from "@/common/enum";
// api
import api from "../../../apis/dictionaryAPI/contractAPI";

const store = new BaseDicStore(api);

export const useContractStore = defineStore("contract", {
  state: () => ({
    ...store.state,
    buildingID: useContextStore().$state.buildingID,
    idField: "contract_id",
    codeField: "contract_code",
    searchFields: ["contract_code", "room_code"],
    numberFields: ["room_price", "room_deposit", "deposit_amount_paid"],
    dateFields: ["start_date", "end_date", "created_date"],
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
