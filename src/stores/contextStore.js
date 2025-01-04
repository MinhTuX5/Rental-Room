import { defineStore } from "pinia";

export const useContextStore = defineStore({
  id: "contextStore",
  state: () => ({
    userID: "05349621-ae36-11ef-a600-c03eba18f2af", // id tài khoản
    role: 1, // Người cho thuê
    buildingID: "02e90b5e-c241-11ef-a574-c03eba18f2af", // ID building đang hiển thị
  }),
  actions: {},
});
