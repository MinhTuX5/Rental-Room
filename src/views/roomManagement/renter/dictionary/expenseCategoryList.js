import { useExpenseCategoryStore } from "@/stores/roomManagement/dictionary/ExpenseCategoryStore";

export const useExpenseCategoryList = () => {
  const detailForm = "ExpenseCategoryDetail";

  const store = useExpenseCategoryStore();

  const headers = [
    { key: store.$state.nameField, title: "Tên loại phí chi" },
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
