import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    alertMessage: "",
    alertType: "error", // or 'success', 'info', 'warning'
    showAlert: false,
    showLoginPopup: false,
    allRoomCategories: [],
    allRooms: [],
    allServiceFees: [],
  }),
  actions: {
    setAlert({ message, type }) {
      this.alertMessage = message;
      this.alertType = type;
      this.showAlert = true;
    },
    hideAlert() {
      this.showAlert = false;
    },
    toggleLoginPopup() {
      this.showLoginPopup = !this.showLoginPopup;
    },
  },
});
