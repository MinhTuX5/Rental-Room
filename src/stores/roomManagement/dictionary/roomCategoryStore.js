import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useAppStore } from "../../appStore";
// resource
import { convertCurrencyFormat } from "@/common/commonFunction";
// enum
import _enum from "@/common/enum";
import FilterOperator from "@/common/enum/FilterOperator";
// api
import api from "../../../apis/roomManagementAPI/dictionary/roomCategoryAPI";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useRoomCategoryStore = defineStore("room_category", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
    idField: "room_category_id",
    codeField: "room_category_code",
    nameField: "room_category_name",
    searchFields: ["room_category_code", "room_category_name"],
    numberFields: ["room_price"],
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
        item = me.standardItem(item);
        Object.assign(curItem, item);
      }
      me.invalidCache = true;
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
    async getAllItems() {
      const me = this;
      const appStore = useAppStore();
      if (me.invalidCache) {
        try {
          const res = await me.getAll();
          if (Array.isArray(res)) {
            me.invalidCache = false;
            appStore.$state.allRoomCategories = res;
            return res;
          } else {
            return [];
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        return appStore.$state.allRoomCategories;
      }
    },
  },
});
