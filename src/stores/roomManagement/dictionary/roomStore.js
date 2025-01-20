import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useAppStore } from "../../appStore";
// enum
import _enum from "@/common/enum";
import FilterOperator from "@/common/enum/FilterOperator";
// api
import api from "../../../apis/dictionaryAPI/roomAPI";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useRoomStore = defineStore("room", {
  state: () => ({
    ...store.state,
    idField: "room_id",
    codeField: "room_code",
    nameField: "room_name",
    searchFields: ["room_code", "room_name"],
    numberFields: ["room_price", "room_area", "no_of_bed_rooms"],
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
      me.items.forEach((item) => {
        item.is_empty = item.member_count === 0;
      });
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
          const pagingPayload = {
            filters: me.defaultFilters,
            sorts: me.defaultSorts,
          };
          const res = await me.getPaging(pagingPayload);
          if (Array.isArray(res.data)) {
            me.invalidCache = false;
            const orderedItems = res.data.sort(
              (a, b) => a[me.codeField] < b[me.codeField]
            );
            appStore.$state.allRooms = orderedItems;
            return orderedItems;
          } else {
            return [];
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        return appStore.$state.allRooms;
      }
    },
  },
});
