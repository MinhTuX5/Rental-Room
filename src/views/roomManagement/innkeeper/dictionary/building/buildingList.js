import { useBuildingStore } from "../../../../../stores/roomManagement/dictionary/buildingStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";
import { getManagementContext } from "../../../../../common/commonFunction";
import BuildingStatus from "../../../../../common/enum/BuildingStatus";
import { showMessage } from "@/common/commonFunction";

export const useBuildingList = () => {
  const detailForm = "BuildingDetail";

  const store = useBuildingStore();

  const useItem = async (item, refresh) => {
    if (item.status === BuildingStatus.Using) return;
    try {
      await store.setActive(item.building_id);

      const context = getManagementContext();
      context.user.building_id = item.building_id;
      context.user.building_name = item.building_name;
      localStorage.setItem("context_management", JSON.stringify(context));

      const contextStore = useContextManageStore();
      contextStore.$state.user = context.user;

      useRoomStore().$state.invalidCache = true;

      showMessage("Đã chọn sử dụng tòa nhà!");
      if (typeof refresh === "function") refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const headers = [
    { key: "building_code", title: "Mã" },
    { key: "building_name", title: "Tên" },
    { key: "building_address", title: "Địa chỉ" },
    { key: "province_name", title: "Tỉnh/TP" },
    { key: "district_name", title: "Quận/Huyện" },
    { key: "ward_name", title: "Xã/Phường" },
    {
      key: "displayed_status",
      title: "Trạng thái",
      align: "center",
    },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 148,
    },
  ];

  return { headers, detailForm, store, useItem, BuildingStatus };
};
