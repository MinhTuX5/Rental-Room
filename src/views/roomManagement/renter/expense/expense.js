import { ref, onMounted, getCurrentInstance, computed } from "vue";

export const useExpense = () => {
  const { proxy } = getCurrentInstance();
  const headers = ref([
    { title: "Ngày chi tiêu", key: "spendingDate" },
    { title: "Người chi", key: "spender" },
    { title: "Số tiền", key: "amount" },
    { title: "Ghi chú", key: "note" },
  ]);

  const items = [
    {
      spendingDate: new Date().toISOString().split("T")[0],
      spender: "John Doe",
      amount: 200000,
      note: "Chi tiêu tháng 1",
    }
  ];

  const contentHeight = ref(0);
  const getContentOfMainHeight = () => {
    const me = proxy;
    const element = me.$refs["child-container"];

    if (!element) return 0;

    const elementStyle = getComputedStyle(element.$el, null);
    if (!elementStyle) return 0;

    const contentHeight =
      parseFloat(elementStyle.height) -
      parseFloat(elementStyle.paddingTop) -
      parseFloat(elementStyle.paddingBottom);
    return contentHeight ?? 0;
  };

  onMounted(() => {
    const me = proxy;
    contentHeight.value = getContentOfMainHeight();
    window._debugger = {
      contentHeight: contentHeight.value
    };
  });

  return { headers, items, contentHeight };
};
