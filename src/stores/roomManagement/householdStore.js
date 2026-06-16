import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// api
import api from "../../apis/roomManagementAPI/householdAPI";
import residentAPI from "@/apis/dictionaryAPI/residentAPI";
import vehicleAPI from "@/apis/roomManagementAPI/vehicleAPI";
import roomAPI from "@/apis/dictionaryAPI/roomAPI";
// resource
import FilterOperator from "@/common/enum/FilterOperator";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

const getCurrentBuildingId = () => {
  return useContextManageStore().$state.user?.building_id;
};

const getBuildingResidents = async () => {
  const buildingId = getCurrentBuildingId();
  if (!buildingId) {
    return [];
  }

  const response = await residentAPI.getPaging({
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

const getVehicles = async () => {
  const response = await vehicleAPI.getAsync();
  return response?.data ?? [];
};

const getBuildingRooms = async () => {
  const buildingId = getCurrentBuildingId();
  if (!buildingId) {
    return [];
  }

  const response = await roomAPI.getPaging({
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

const enrichResidentRowsWithCounts = async (residentRows) => {
  if (!Array.isArray(residentRows) || residentRows.length === 0) {
    return residentRows ?? [];
  }

  const [residents, vehicles, rooms] = await Promise.all([
    getBuildingResidents(),
    getVehicles(),
    getBuildingRooms(),
  ]);

  const roomById = rooms.reduce((result, room) => {
    if (room?.room_id) {
      result[room.room_id] = room;
    }
    return result;
  }, {});

  const residentsByRoomId = residents.reduce((result, resident) => {
    if (!resident?.room_id) {
      return result;
    }

    if (!result[resident.room_id]) {
      result[resident.room_id] = [];
    }
    result[resident.room_id].push(resident);
    return result;
  }, {});

  const roomIdByResidentId = residents.reduce((result, resident) => {
    if (resident?.resident_id && resident?.room_id) {
      result[resident.resident_id] = resident.room_id;
    }
    return result;
  }, {});

  const vehicleCountByRoomId = vehicles.reduce((result, vehicle) => {
    const roomId = roomIdByResidentId[vehicle?.resident_id];
    if (!roomId || !vehicle?.vehicle_id) {
      return result;
    }

    result[roomId] = (result[roomId] ?? 0) + 1;
    return result;
  }, {});

  return residentRows.map((resident) => {
    const roomResidents = residentsByRoomId[resident.room_id] ?? [];
    const room = roomById[resident.room_id] ?? {};
    return {
      ...resident,
      room_name: resident.room_name || room.room_name,
      member_count: roomResidents.length,
      vehicle_count: vehicleCountByRoomId[resident.room_id] ?? 0,
    };
  });
};

const normalizeSearchText = (value) => {
  return String(value ?? "")
    .trim()
    .toLowerCase();
};

const matchesKeyword = (item, keyword, fields) => {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) {
    return true;
  }

  return fields.some((field) =>
    normalizeSearchText(item?.[field]).includes(normalizedKeyword)
  );
};

export const useHouseholdStore = defineStore("household", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
    idField: "room_id",
    codeField: "room_code",
    searchFields: ["room_name", "room_code", "resident_name"],
  }),
  getters: {
    defaultFilters(state) {
      return [
        {
          Field: "building_id",
          Value: getCurrentBuildingId(),
          Operator: FilterOperator.Equal,
        },
      ];
    },
    defaultSorts(state) {
      return [
        {
          Column: state.codeField,
        },
        {
          Column: "resident_code",
        },
      ];
    },
  },
  actions: {
    ...store.actions,
    async getPaging(config) {
      const me = this;
      const keyword = config?.searchItem?.value;
      const shouldSearchLocally = Boolean(normalizeSearchText(keyword));
      const pagingConfig = shouldSearchLocally
        ? {
            ...config,
            skip: 0,
            take: 100000,
            searchItem: {
              columns: [],
              value: "",
            },
          }
        : config;

      const response = await residentAPI.getPaging(pagingConfig);
      let data = await enrichResidentRowsWithCounts(response.data);

      if (shouldSearchLocally) {
        data = data.filter((item) =>
          matchesKeyword(item, keyword, me.searchFields)
        );
      }

      const totalCount = shouldSearchLocally ? data.length : response.totalCount ?? 0;
      const pageIndex = Number(config?.skip ?? 0);
      const pageSize = Number(config?.take ?? data.length);
      const start = shouldSearchLocally ? pageIndex * pageSize : 0;

      const result = {
        data: shouldSearchLocally ? data.slice(start, start + pageSize) : data,
        totalCount,
      };
      me.afterGetPaging(result);
      return result;
    },
    afterGetPaging(result) {
      const me = this;
      me.items = result.data;
      me.totalItems = result.totalCount;
    },
  },
});
