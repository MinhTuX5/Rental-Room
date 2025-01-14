import { defineStore } from "pinia";

export const useContextAdminStore = defineStore({
  id: "context_admin",
  state: () => ({
    token: "",
    user: {},
  }),
  actions: {},
});
