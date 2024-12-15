import { getCurrentInstance, onMounted, reactive, ref } from "vue";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();
  const menuItems = [{ title: "Tìm phòng trọ" }, { title: "Đăng xuất" }];

  const features = reactive([
    {
      title: "Danh sách phòng",
      componentId: "RoomList",
      icon: "mdi-list-box-outline",
    },
    {
      title: "Thông tin phòng",
      componentId: "RoomInfo",
      icon: "mdi-information-variant-circle-outline",
    },
    {
      title: "Lịch biểu",
      componentId: "AppointmentSchedule",
      icon: "mdi-calendar-account-outline",
    },
    {
      title: "Quản lý chi tiêu",
      componentId: "Expense",
      icon: "mdi-calendar-account-outline",
    },
    { title: "Tính toán", componentId: "Calculation", icon: "mdi-calculator" },
    {
      title: "Danh mục",
      icon: "mdi-cloud-print-outline",
      isGroup: true,
      children: [
        {
          title: "Phương tiện",
          componentId: "VehicleList",
          icon: "mdi-atv",
        },
      ],
    },
  ]);
  const componentId = ref(features[0].componentId);

  /**
   * @description Xử lý sự kiện chọn tab khác
   * @author nvthinh 03.08.2024
   */
  const handleSelected = (value) => {
    const selectedItem = features.find((x) => x.active);
    if (Array.isArray(value) && value.length) {
      componentId.value = value[0];
      if (selectedItem && componentId.value != selectedItem.componentId) {
        selectedItem.active = false;
      }
    }
  };

  const open = [];

  onMounted(() => {
    window._container = proxy;
  });

  return {
    menuItems,
    features,
    componentId,
    handleSelected,
    open,
  };
};
