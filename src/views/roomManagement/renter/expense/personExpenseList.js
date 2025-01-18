import { onUnmounted } from "vue";
import { useExpenseStore } from "../../../../stores/roomManagement/expenseStore";

export const usePersonExpenseList = () => {
  const detailForm = "ExpenseDetail";

  const store = useExpenseStore();
  store.$state.isPersonal = true;

  onUnmounted(() => {
    store.$reset();
  });

  return { detailForm, store };
};
