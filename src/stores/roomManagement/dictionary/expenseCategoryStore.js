import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
// resource
import FilterOperator from "@/common/enum/FilterOperator";
// enum
import _enum from "@/common/enum";
// api
import api from "@/apis/roomManagementAPI/dictionary/expenseCategoryAPI.js";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useAppStore } from "@/stores/appStore";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useExpenseCategoryStore = defineStore("ExpenseCategory", {
  state: () => ({
    ...store.state,
    idField: "expense_category_id",
    nameField: "expense_category_name",
    searchFields: ["expense_category_name"],
    invalidCache: true,
  }),
  getters: {
    defaultSorts(state) {
      return [
        {
          Column: state.nameField,
        },
      ];
    },
    defaultFilters(state) {
      return [
        {
          Field: "user_id",
          Value: contextStore.$state.user.user_id,
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
            const orderedItems = res.sort((a, b) => {
              const nameA = a[me.nameField] || "";
              const nameB = b[me.nameField] || "";
              return nameA.localeCompare(nameB);
            });
            appStore.$state.allExpenseCategories = orderedItems;
            return orderedItems;
          } else {
            return [];
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        return appStore.$state.allExpenseCategories;
      }
    },
  },
});
