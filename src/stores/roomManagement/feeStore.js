import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// api
import api from "../../apis/roomManagementAPI/feeAPI";
import residentAPI from "@/apis/dictionaryAPI/residentAPI";
import { useRoomStore } from "@/stores/roomManagement/dictionary/roomStore";
// resource
import FilterOperator from "@/common/enum/FilterOperator";
import FeeStatus from "../../common/enum/FeeStatus";

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

const enrichFeeRowsWithOwnerNames = async (feeRows) => {
  if (!Array.isArray(feeRows) || feeRows.length === 0) {
    return feeRows ?? [];
  }

  const residents = await getBuildingResidents();
  const ownerByRoomId = residents.reduce((result, resident) => {
    if (!resident?.room_id) {
      return result;
    }

    if (resident.is_owner || !result[resident.room_id]) {
      result[resident.room_id] = resident;
    }

    return result;
  }, {});

  return feeRows.map((fee) => ({
    ...fee,
    resident_name:
      fee.resident_name || ownerByRoomId[fee.room_id]?.resident_name || "",
  }));
};

const enrichFeeRowsWithRoomNames = async (feeRows) => {
  if (!Array.isArray(feeRows) || feeRows.length === 0) {
    return feeRows ?? [];
  }

  const roomStore = useRoomStore();
  const rooms = await roomStore.getAllItems();
  const roomMap = rooms.reduce((result, room) => {
    result[room.room_id] = room;
    return result;
  }, {});

  return feeRows.map((fee) => ({
    ...fee,
    room_name: fee.room_name || roomMap[fee.room_id]?.room_name || "",
  }));
};

export const useFeeStore = defineStore("fee", {
  state: () => ({
    ...store.state,
    building_id: contextStore.$state.user.building_id,
    idField: "fee_id",
    searchFields: ["room_code", "contract_code"],
    dateFields: ["expired_date"],
    numberFields: ["total_fee", 'received_fee'],
    enumFields: [
      {
        column: "displayed_fee_status",
        field: "fee_status",
        enum: "FeeStatus",
      },
    ],
  }),
  getters: {
    defaultFilters(state) {
      return [
        {
          Field: "building_id",
          Value: contextStore.$state.user.building_id,
          Operator: FilterOperator.Equal,
        },
      ];
    },
    defaultSorts(state) {
      return [
        {
          Column: "contract_code",
        },
        {
          Column: "room_code",
        },
      ];
    },
  },
  actions: {
    ...store.actions,
    async getPaging(config) {
      const me = this;
      const response = await api.getPaging(config);
      let data = await enrichFeeRowsWithOwnerNames(response.data);
      data = await enrichFeeRowsWithRoomNames(data);
      const result = {
        data,
        totalCount: response.totalCount ?? 0,
      };
      me.afterGetPaging(result);
      return result;
    },
    afterGetPaging(result) {
      const me = this;

      if (Array.isArray(result.data)) {
        result.data.forEach((x) => {
          if (x?.fee_id && !x.electric_water) {
            x.electric_water =
              localStorage.getItem(`fee-electric-water-${x.fee_id}`) ?? "";
          }

          switch (x.fee_status) {
            case FeeStatus.NotYet:
              x.status_color = "red";
              break;
            case FeeStatus.InProgress:
              x.status_color = "orange";
              break;
            case FeeStatus.Completed:
              x.status_color = "green";
              break;
          }
        });
        me.items = result.data;
      }

      me.totalItems = result.totalCount;
    },
    afterDeleteAsync(id) {
      const me = this;
      me.items = me.items.filter((x) => x[me.idField] != id);
      me.totalItems--;
    },
    async genFees(buildingID) {
      return await api.genFees(buildingID);
    },
    async pay(payload) {
      return await api.pay(payload);
    },
    async getPaymentInfo(payload) {
      return await api.getPaymentInfo(payload);
    },
  },
});
