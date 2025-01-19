import { useBuildingStore } from "../../../../../stores/roomManagement/dictionary/buildingStore";

export const useBuildingList = () => {
  const detailForm = "BuildingDetail";

  const store = useBuildingStore();

  const headers = [
    { key: "building_name", title: "Tên tòa nhà" },
    { key: "building_address", title: "Địa chỉ" },
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
      width: 108,
    },
  ];

  return { headers, detailForm, store };
};
