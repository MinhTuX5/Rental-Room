import { getCurrentInstance, onMounted, reactive, ref } from "vue";
// stores
import { useContextStore } from "@/stores/contextStore";
// resources
import Role from "@/common/enum/Role";
import { logout } from "@/common/commonFunction";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const contextStore = useContextStore();

  const moveToHomePage = () => {
    const me = proxy;
    me.$router.push({ path: "/" });
  };

  const menuItems = ref([
    { title: "Tìm trọ", onClick: moveToHomePage },
    { title: "Đăng xuất", onClick: logout },
  ]);

  const features = ref([]);
  const renterFeatures = reactive([
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
  ]);

  const innkeeperFeatures = reactive([
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

  const componentId = ref(renterFeatures[0].componentId);

  /**
   * @description Xử lý sự kiện chọn tab khác
   * @author nvthinh 03.08.2024
   */
  const handleSelected = (value) => {
    const selectedItem = renterFeatures.find((x) => x.active);
    if (Array.isArray(value) && value.length) {
      componentId.value = value[0];
      if (selectedItem && componentId.value != selectedItem.componentId) {
        selectedItem.active = false;
      }
    }
  };

  const open = [];

  onMounted(() => {
    const { role } = contextStore.$state;
    switch (role) {
      case Role.Innkeeper:
        features.value = innkeeperFeatures;
        break;
      case Role.Renter:
        features.value = renterFeatures;
        break;
      default:
        break;
    }

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
