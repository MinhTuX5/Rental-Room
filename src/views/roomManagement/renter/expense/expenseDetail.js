import { getCurrentInstance, onMounted, ref } from "vue";
// store
import { useExpenseStore } from "@/stores/expenseManagement/dictionary/expenseStore";
import { useExpenseCategoryStore } from "@/stores/expenseManagement/dictionary/expenseCategoryStore";

export const useExpenseDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useExpenseStore();
  const expenseCategoryStore = useExpenseCategoryStore();

  const title = ref("Phòng");

  const defaultModel = {
    expense_date: new Date(),
    is_personal: false,
  };

  const onSelectExpenseCategory = (itemVal) => {
    const me = proxy;
    const expenseCategory = allExpenseCategories.value.find(
      (r) => r[expenseCategoryStore.idField] === itemVal
    );
    if (expenseCategory) {
      me.model[expenseCategoryStore.$state.nameField] =
        expenseCategory[expenseCategoryStore.$state.nameField];
    }
  };

  const allExpenseCategories = ref([]); // list of all expense categories
  onMounted(async () => {
    allExpenseCategories.value = await expenseCategoryStore.getAllItems();
  });

  return {
    title,
    store,
    defaultModel,
    expenseCategoryStore,
    allExpenseCategories,
    onSelectExpenseCategory,
  };
};
