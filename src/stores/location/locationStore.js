import { defineStore } from "pinia";
// api
import api from "@/apis/locationAPI";
// enum
import LocationType from "@/common/enum/LocationType";

export const useLocationStore = defineStore("location", {
  state: () => ({
    items: [],
    idField: "location_id",
    codeField: "location_code",
    nameField: "location_name",
    selectedProvinceCode: "",
    selectedDistrictCode: "",
  }),
  getters: {
    // Tỉnh/Thành phố
    provinceItems: (state) => {
      return state.items.filter(
        (x) => x.location_type === LocationType.Province
      );
    },
    // Quận/Huyện
    districtItems: (state) => {
      return state.items.filter(
        (x) =>
          x.location_type === LocationType.District &&
          x.parent_code === state.selectedProvinceCode
      );
    },
    // Phường/Xã
    wardItems: (state) => {
      return state.items.filter(
        (x) =>
          x.location_type === LocationType.Ward &&
          x.parent_code === state.selectedDistrictCode
      );
    },
  },
  actions: {
    resetState() {
      const me = this;
      me.selectedProvinceCode = "";
      me.selectedDistrictCode = "";
    },
    setItems(data) {
      const me = this;
      me.items = data;
    },
    selectProvinceById(id) {
      const me = this;
      const province = me.provinceItems.find((x) => x[me.idField] === id);
      if (province) {
        me.selectedProvinceCode = province[me.codeField];
      }
      return province;
    },
    selectDistrictById(id) {
      const me = this;
      const district = me.districtItems.find((x) => x[me.idField] === id);
      if (district) {
        me.selectedDistrictCode = district[me.codeField];
      }
      return district;
    },
    async getAllLocations() {
      const me = this;
      try {
        const result = await api.getAllLocations();
        me.setItems(result.data);
        return result.data;
      } catch (error) {
        console.log(error);
      }
      return [];
    },
  },
});
