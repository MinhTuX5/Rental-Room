import { getCurrentInstance, onMounted, ref, computed } from "vue";
// store
import { useExpenseStore } from "@/stores/roomManagement/expenseStore";
import { useExpenseCategoryStore } from "@/stores/roomManagement/dictionary/expenseCategoryStore";
import { useContextManageStore } from "@/stores/contextManageStore";
// resources
import { formatDate } from "@/common/commonFunction";

export const useExpenseDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useExpenseStore();
  const expenseCategoryStore = useExpenseCategoryStore();

  const title = ref("Khoản chi");

  const defaultModel = {
    expense_date: new Date(),
    is_personal: store.$state.isPersonal,
  };

  const expenseDate = computed(() => {
    return formatDate(proxy.model.expense_date);
  });

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

  const customBeforeSubmit = () => {
    proxy.model.user_id = useContextManageStore().$state.user.user_id;
    proxy.model.is_personal = store.$state.isPersonal;
  };

  const customAfterBeforeOpen = () => {
    if (proxy.editMode === proxy._enum.Mode.Add) {
      proxy.model.is_personal = store.$state.isPersonal;
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
    expenseDate,
    customBeforeSubmit,
    customAfterBeforeOpen,
  };
};
