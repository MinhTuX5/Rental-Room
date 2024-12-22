import { defineStore } from "pinia";

export const useContextStore = defineStore({
  id: "contextStore",
  state: () => ({
    userID: "",
    role: 1, // Người cho thuê
  }),
  actions: {},
});
