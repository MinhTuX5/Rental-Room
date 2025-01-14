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

const store = new BaseDicStore(api);

export const useBuildingStore = defineStore("building", {
  state: () => ({
    ...store.state,
    userID: useContextStore().$state.userID,
    idField: "building_id",
    nameField: "building_name",
    searchFields: ["building_name", "building_address"],
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
          Field: "status",
        },
        {
          Field: state.nameField,
        },
      ];
    },
    defaultFilters(state) {
      return [
        {
          Field: "user_id",
          Value: state.userID,
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
        if (key) {
          const col = `displayed_${x.field}`;
          item[col] = key;
        }
      });
      return item;
    },
    standardItem(item) {
      const me = this;
      item = me.getEnumItem(item);

      switch (item.status) {
        case BuildingStatus.Using:
          item.statusColor = "green";
          break;
        case BuildingStatus.Hide:
          item.statusColor = "red";
          break;
      }

      return item;
    },
  },
});
