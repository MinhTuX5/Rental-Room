import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// resource
import { convertCurrencyFormat } from "@/common/commonFunction";
import FilterOperator from "@/common/enum/FilterOperator";
// enum
import _enum from "@/common/enum";
// api
import api from "../../../apis/dictionaryAPI/contractAPI";
import roomAPI from "@/apis/dictionaryAPI/roomAPI";
import residentAPI from "@/apis/dictionaryAPI/residentAPI";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

const getCurrentBuildingId = () => {
  return useContextManageStore().$state.user?.building_id;
};

const getBuildingItems = async (sourceAPI) => {
  const buildingId = getCurrentBuildingId();
  if (!buildingId) {
    return [];
  }

  const response = await sourceAPI.getPaging({
    skip: 0,
    take: 100000,
    filters: [
      {
        Field: "building_id",
        Value: buildingId,
        Operator: FilterOperator.Equal,
      },
    ],
  });

  return response?.data ?? [];
};

const enrichContracts = async (contracts) => {
  if (!Array.isArray(contracts) || contracts.length === 0) {
    return contracts ?? [];
  }

  const [rooms, residents] = await Promise.all([
    getBuildingItems(roomAPI),
    getBuildingItems(residentAPI),
  ]);

  const roomById = rooms.reduce((result, room) => {
    if (room?.room_id) {
      result[room.room_id] = room;
    }
    return result;
  }, {});

  const ownerByRoomId = residents.reduce((result, resident) => {
    if (!resident?.room_id) {
      return result;
    }

    if (resident.is_owner || !result[resident.room_id]) {
      result[resident.room_id] = resident;
    }

    return result;
  }, {});

  return contracts.map((contract) => {
    const room = roomById[contract.room_id] ?? {};
    const owner = ownerByRoomId[contract.room_id] ?? {};
    return {
      ...contract,
      room_name: contract.room_name || room.room_name,
      representative_name:
        contract.representative_name ||
        contract.resident_name ||
        owner.resident_name ||
        "",
    };
  });
};

export const useContractStore = defineStore("contract", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
    idField: "contract_id",
    codeField: "contract_code",
    searchFields: ["contract_code", "room_name", "representative_name"],
    numberFields: ["room_price", "room_deposit", "deposit_amount_received"],
    dateFields: ["start_date", "end_date", "created_date"],
  }),
  getters: {
    defaultSorts(state) {
      return [
        {
          Column: state.codeField,
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
        data: await enrichContracts(response.data),
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
