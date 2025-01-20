import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// api
import api from "../../apis/roomManagementAPI/feeAPI";
// resource
import FilterOperator from "@/common/enum/FilterOperator";
import FeeStatus from "../../common/enum/FeeStatus";

const store = new BaseDicStore(api);
const contextStore = useContextManageStore();

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
    afterGetPaging(result) {
      const me = this;

      if (Array.isArray(result.data)) {
        result.data.forEach((x) => {
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
