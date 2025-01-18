import { onMounted, ref, getCurrentInstance } from "vue";
// store
import { useExpenseCategoryStore } from "@/stores/roomManagement/dictionary/expenseCategoryStore";
import { useContextManageStore } from "@/stores/contextManageStore";

export const useExpenseCategoryDetail = () => {
  const { proxy } = getCurrentInstance();
  const store = useExpenseCategoryStore();

  const title = ref("Loại phí chi");

  const customBeforeSubmit = () => {
    proxy.model.user_id = useContextManageStore().$state.user.user_id;
  };

  onMounted(() => {});

  return {
    title,
    store,
    customBeforeSubmit,
  };
};
