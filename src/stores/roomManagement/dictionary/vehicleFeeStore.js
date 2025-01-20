import { defineStore } from "pinia";
// base
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// api
import api from "@/apis/dictionaryAPI/vehicleFeeAPI";
// resource
import { convertCurrencyFormat } from "@/common/commonFunction";
import FilterOperator from "@/common/enum/FilterOperator";
// enum
import _enum from "@/common/enum";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useVehicleFeeStore = defineStore("vehicle-fee", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
    idField: "vehicle_fee_id",
    codeField: "vehicle_fee_code",
    nameField: "vehicle_type",
    searchFields: ["vehicle_fee_code", "vehicle_type"],
    numberFields: ["fee_price"],
    enumFields: [
      {
        column: "unit",
        field: "price_unit",
        enum: "PriceUnit",
      },
    ],
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
          Value: state.building_id,
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
