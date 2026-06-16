import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useRoomStore } from "@/stores/roomManagement/dictionary/roomStore";
// enum
import _enum from "@/common/enum";
import FilterOperator from "@/common/enum/FilterOperator";
import Gender from "../../../common/enum/Gender";
// api
import api from "../../../apis/dictionaryAPI/residentAPI";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

const invalidateRoomCache = () => {
  useRoomStore().$state.invalidCache = true;
};

const enrichResidentsWithRoomName = async (residents) => {
  if (!Array.isArray(residents) || residents.length === 0) {
    return residents ?? [];
  }

  const rooms = await useRoomStore().getAllItems();
  const roomById = rooms.reduce((result, room) => {
    if (room?.room_id) {
      result[room.room_id] = room;
    }
    return result;
  }, {});
  const roomByCode = rooms.reduce((result, room) => {
    if (room?.room_code) {
      result[room.room_code] = room;
    }
    return result;
  }, {});

  return residents.map((resident) => {
    const room = roomById[resident.room_id] ?? roomByCode[resident.room_code] ?? {};
    return {
      ...resident,
      room_name: resident.room_name || room.room_name || "",
    };
  });
};

export const useResidentStore = defineStore("resident", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
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
    async getPaging(config) {
      const me = this;
      const response = await api.getPaging(config);
      const result = {
        data: await enrichResidentsWithRoomName(response.data),
        totalCount: response.totalCount ?? 0,
      };
      me.afterGetPaging(result);
      return result;
    },
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
      me.items.unshift(item);
      me.totalItems++;
      invalidateRoomCache();
    },
    afterDeleteAsync(id) {
      const me = this;
      me.items = me.items.filter((x) => x[me.idField] != id);
      me.totalItems--;
      invalidateRoomCache();
    },
    afterUpdate(item) {
      const me = this;
      const curItem = me.items.find((x) => x[me.idField] == item[me.idField]);
      if (curItem) {
        Object.assign(curItem, item);
      }
      invalidateRoomCache();
    },
    standardItem(item) {
      switch (item.resident_gender) {
        case Gender.Male:
          item.color = "blue";
          break;
        case Gender.Female:
          item.color = "pink";
          break;
      }
      return item;
    },
  },
});
