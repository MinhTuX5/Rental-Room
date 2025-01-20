import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useAppStore } from "../../appStore";
// api
import api from "@/apis/dictionaryAPI/serviceFeeAPI";
// enum
import _enum from "@/common/enum";
import FilterOperator from "@/common/enum/FilterOperator";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useServiceFeeStore = defineStore("service-fee", {
  state: () => ({
    ...store.state,
    ...contextStore.$state,
    idField: "service_fee_id",
    codeField: "service_fee_code",
    nameField: "service_type",
    searchFields: ["service_fee_code", "service_type"],
    numberFields: ["fee_price"],
    enumFields: [
      {
        column: "unit",
        field: "price_unit",
        enum: "ServicePriceUnit",
      },
    ],
    invalidCache: true,
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
      me.totalItems = result.totalCount;
    },
    afterInsertAsync(item) {
      const me = this;
      me.items.unshift(item);
      me.totalItems++;
      me.invalidCache = true;
    },
    afterDeleteAsync(id) {
      const me = this;
      me.items = me.items.filter((x) => x[me.idField] != id);
      me.totalItems--;
      me.invalidCache = true;
    },
    afterUpdate(item) {
      const me = this;
      const curItem = me.items.find((x) => x[me.idField] == item[me.idField]);
      if (curItem) {
        Object.assign(curItem, item);
      }
      me.invalidCache = true;
    },
    async getAllItems() {
      const me = this;
      const appStore = useAppStore();
      if (me.invalidCache) {
        try {
          const res = await me.getAll();
          if (Array.isArray(res)) {
            me.invalidCache = false;
            const orderedItems = res.sort(
              (a, b) => a[me.codeField] < b[me.codeField]
            );
            appStore.$state.allServiceFees = orderedItems;
            return orderedItems;
          } else {
            return [];
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        return appStore.$state.allServiceFees;
      }
    },
  },
});
