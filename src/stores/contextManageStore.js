import { defineStore } from "pinia";

export const useContextManageStore = defineStore({
  id: "contextManageStore",
  state: () => ({
    token: "",
    user: {},
  }),
  actions: {},
});
