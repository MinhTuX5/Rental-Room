import { useContractStore } from "@/stores/roomManagement/dictionary/ContractStore";
import popupUtil from "@/common/popupUtil";

export const useContractList = () => {
  const detailForm = "ContractDetail";

  const store = useContractStore();

  const headers = [
    { key: "contract_code", title: "Mã hợp đồng", align: "center" },
    { key: "room_name", title: "Tên phòng", align: "center" },
    { key: "representative_name", title: "Tên người đại diện", align: "center" },
    { key: "room_price", title: "Giá phòng", align: "center" },
    { key: "room_deposit", title: "Tiền cọc", align: "center" },
    { key: "deposit_amount_received", title: "Đã nhận", align: "center" },
    { key: "displayed_start_date", title: "Ngày bắt đầu", align: "center" },
    { key: "displayed_end_date", title: "Ngày kết thúc", align: "center" },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 120,
    },
  ];

  const showResidentsPopup = (item) => {
    popupUtil.show("ContractResidentsPopup", {
      model: item,
    });
  };

  return { headers, detailForm, store, showResidentsPopup };
};
