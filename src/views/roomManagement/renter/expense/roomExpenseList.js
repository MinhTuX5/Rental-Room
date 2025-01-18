import { useExpenseStore } from "../../../../stores/roomManagement/expenseStore";
import { onUnmounted } from "vue";

export const useRoomExpenseList = () => {
  const detailForm = "ExpenseDetail";
  
  const store = useExpenseStore();
  store.$state.isRoom = true;

  onUnmounted(() => {
    store.$reset();
  });

  return { detailForm, store };
};
