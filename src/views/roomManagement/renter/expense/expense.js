import { ref, onMounted, getCurrentInstance, watch } from "vue";
import { useExpenseStore } from "@/stores/roomManagement/expenseStore.js";
import { useContextManageStore } from "@/stores/contextManageStore";

export const useExpense = () => {
  const { proxy } = getCurrentInstance();

  const store = useExpenseStore();

  const headers = [
    { key: "expense_category_name", title: "Tên loại chi", align: "start" },
    { key: "expense_amount", title: "Số tiền chi", align: "end" },
    { key: "displayed_expense_date", title: "Ngày chi", align: "center" },
    { key: "displayed_created_at", title: "Ngày tạo", align: "center" },
    { key: "expense_description", title: "Ghi chú", align: "start" },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 120,
    },
  ];

  const tabValues = {
    general: 1,
    room: 2,
    personal: 3,
  };

  const tabConfig = [
    {
      value: 1,
      text: "Tổng quan",
    },
    {
      value: 2,
      text: "Phòng trọ",
    },
    {
      value: 3,
      text: "Cá nhân",
    },
  ];

  const tab = ref();
  const roomKey = ref(1);
  const personKey = ref(1);
  watch(tab, (newVal) => {});

  const searchLabel = "Loại phí chi, ghi chú";

  const gradients = [
    ["#222"],
    ["#42b3f4"],
    ["red", "orange", "yellow"],
    ["purple", "violet"],
    ["#00c6ff", "#F0F", "#FF0"],
    ["#f72047", "#ffd200", "#1feaea"],
  ];

  const width = ref(1);
  const radius = ref(10);
  const padding = ref(10);
  const lineCap = ref("round");
  const gradient = ref(gradients[5]);
  const labels = ["22/10", "18/08", "25/06", "15/04", "10/02"];
  const value = [450000, 550000, 400000, 900000, 600000];
  const gradientDirection = ref("top");
  const fill = ref(false);
  const type = ref("trend");
  const autoLineWidth = ref(false);
  const chartCols = ref(9);

  const roomLabels = ref([]);
  const roomValues = ref([]);

  const timeStep = ref("10:10");
  const allowedStep = (m) => m % 10 === 0;

  onMounted(() => {
    const payload = {
      year: new Date().getFullYear(),
      userId: useContextManageStore().$state.user.user_id,
    };
    store.getExpenseStatistic(payload);
  });

  return {
    headers,
    tabConfig,
    tab,
    tabValues,
    store,
    searchLabel,
    roomKey,
    personKey,
    width,
    // radius,
    padding,
    lineCap,
    gradient,
    gradientDirection,
    fill,
    type,
    autoLineWidth,
    value,
    labels,
    chartCols,
    timeStep,
    allowedStep,
  };
};
