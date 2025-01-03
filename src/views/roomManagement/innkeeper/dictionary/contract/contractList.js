import { useContractStore } from "@/stores/roomManagement/dictionary/ContractStore";

export const useContractList = () => {
  const detailForm = "ContractDetail";

  const store = useContractStore();

  const headers = [
    { key: "contract_code", title: "Mã hợp đồng" },
    { key: "room_code", title: "Mã phòng" },
    { key: "room_price", title: "Giá phòng", align: "end" },
    { key: "room_deposit", title: "Tiền cọc", align: "end" },
    { key: "deposit_amount_paid", title: "Tiền cọc đã trả", align: "end" },
    { key: "displayed_start_date", title: "Ngày bắt đầu", align: "center" },
    { key: "displayed_end_date", title: "Ngày kết thúc", align: "center" },
    { key: "displayed_created_date", title: "Ngày tạo", align: "center" },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 140,
    },
  ];

  return { headers, detailForm, store };
};
