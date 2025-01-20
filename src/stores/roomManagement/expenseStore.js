import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
// resource
import FilterOperator from "@/common/enum/FilterOperator";
// enum
import _enum from "@/common/enum";
// api
import api from "@/apis/roomManagementAPI/expenseAPI.js";
import { useContextManageStore } from "@/stores/contextManageStore";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useExpenseStore = defineStore("Expense", {
  state: () => ({
    ...store.state,
    idField: "expense_id",
    searchFields: ["expense_description", "expense_category_name"],
    isPersonal: false,
    isRoom: false,
    numberFields: ["expense_amount"],
    dateFields: ["expense_date", "created_at"],
  }),
  getters: {
    defaultSorts(state) {
      const sorts = [
        {
          Column: "expense_date",
          IsAscending: false,
        },
        {
          Column: "created_at",
          IsAscending: false,
        },
      ];
      return sorts;
    },
    defaultFilters(state) {
      const filters = [
        {
          Field: "user_id",
          Value: contextStore.$state.user.user_id,
          Operator: FilterOperator.Equal,
        },
      ];
      if (state.isPersonal) {
        filters.push({
          Field: "is_personal",
          Value: 1,
          Operator: FilterOperator.Equal,
        });
      } else if (state.isRoom) {
        filters.push({
          Field: "is_personal",
          Value: 0,
          Operator: FilterOperator.Equal,
        });
      }
      return filters;
    },
    personalItems(state) {
      return state.items.filter((x) => x.is_personal);
    },
    roomItems(state) {
      return state.items.filter((x) => !x.is_personal);
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
    async getExpenseStatistic(payload) {
      return api.getExpenseStatistic(payload);
    }
  },
});
