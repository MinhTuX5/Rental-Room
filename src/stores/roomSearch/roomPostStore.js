import { defineStore } from "pinia";
// base
import BaseStore from "@/stores/baseStore";
// api
import api from "@/apis/roomSearchAPI/roomPostAPI";

const store = new BaseStore(api);
export const useRoomPostStore = defineStore("RoomPost", {
  state: () => ({ ...store.state }),
  getters: {},
  actions: {
    ...store.actions,
    lovePost: async (param) => {
      if (!param) {
        return;
      }

      const res = await api.lovePost(param);
      return res.data?.data;
    },
  },
});
