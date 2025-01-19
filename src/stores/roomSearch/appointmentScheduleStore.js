import { defineStore } from "pinia";
// store
import BaseDicStore from "@/stores/baseDicStore";
// resource
import FilterOperator from "@/common/enum/FilterOperator";
import api from "../../apis/roomSearchAPI/roomPostAPI/appointmentScheduleAPI";
import { useContextStore } from "../contextStore";

const store = new BaseDicStore(api);
const contextStore = useContextStore();

export const useAppointmentScheduleStore = defineStore("appointmentSchedule", {
  state: () => ({
    ...store.state,
    idField: "appointment_schedule_id",
    isTakeAll: true,
  }),
  getters: {},
  actions: {
    ...store.actions,
    async getEvents({ start, end }) {
      const payload = {
        Filters: [
          {
            Field: "user_id",
            Operator: FilterOperator.Equal,
            Value: contextStore.$state.user.user_id,
          },
          {
            Field: "appointment_date",
            Operator: FilterOperator.Between,
            Value: [start, end],
          },
        ],
        Sorts: [
          {
            Column: "appointment_date",
          },
          {
            Column: "appointment_time",
          },
        ],
      };
      const response = await api.getPaging(payload);
      return response.data;
    },
  },
});
