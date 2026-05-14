import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// resource
import BuildingStatus from "../../../common/enum/BuildingStatus";
import FilterOperator from "@/common/enum/FilterOperator";
// enum
import _enum from "@/common/enum";
// api
import api from "../../../apis/dictionaryAPI/buildingAPI";
import { useAppStore } from "../../appStore";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

export const useBuildingStore = defineStore("building", {
  state: () => ({
    ...store.state,
    idField: "building_id",
    codeField: "building_code",
    nameField: "building_name",
    searchFields: ["building_code", "building_name", "building_address"],
    enumFields: [
      {
        field: "status",
        enum: "BuildingStatus",
      },
    ],
  }),
  getters: {
    defaultSorts(state) {
      return [
        {
          Column: "status",
        },
        {
          Column: state.nameField,
        },
      ];
    },
    defaultFilters() {
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

    standardItem(item) {
      switch (item.status) {
        case BuildingStatus.Using:
          item.statusColor = "green";
          break;
        case BuildingStatus.Hide:
          item.statusColor = "red";
          break;
      }

      item.province_name = item.province_name?.replace("Thành phố ", "");
      item.district_name = item.district_name?.replace("Quận ", "");
      item.ward_name = item.ward_name?.replace("Phường ", "");

      return item;
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
