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
      componentId: "RoomListOverview",
      icon: "mdi-list-box-outline",
      value: "RoomListOverview",
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
      title: "Danh sách phòng",
      componentId: "RoomListOverview",
      icon: "mdi-list-box-outline",
      value: "RoomListOverview",
    },
    {
      title: "Quản lý thông tin",
      icon: "mdi-cloud-print-outline",
      isGroup: true,
      parentVal: "infoManagement",
      children: [
        {
          title: "Quản lý hộ gia đình",
          icon: "mdi-home-city",
          componentId: "BuildingList",
          value: "BuildingList",
        },
        {
          title: "Quản lý thu phí",
          icon: "mdi-home-city",
          componentId: "BuildingList",
          value: "BuildingList",
        },
      ],
    },
    {
      title: "Danh mục",
      icon: "mdi-cloud-print-outline",
      isGroup: true,
      parentVal: "dictionary",
      children: [
        {
          title: "Tòa nhà",
          icon: "mdi-home-city",
          componentId: "BuildingList",
          value: "BuildingList",
        },
        {
          title: "Loại phòng",
          componentId: "RoomCategoryList",
          icon: "mdi-home-circle-outline",
          value: "RoomCategoryList",
        },
        {
          title: "Phòng",
          componentId: "RoomList",
          icon: "mdi-home-group",
          value: "RoomList",
        },
        {
          title: "Hợp đồng cho thuê",
          componentId: "ContractList",
          icon: "mdi-file-sign",
          value: "ContractList",
        },
        {
          title: "Người thuê",
          componentId: "ResidentList",
          icon: "mdi-account-group-outline",
          value: "ResidentList",
        },
        {
          title: "Phí gửi xe",
          componentId: "VehicleFeeList",
          icon: "mdi-atv",
          value: "VehicleFeeList",
        },
        {
          title: "Phí dịch vụ",
          componentId: "ServiceFeeList",
          icon: "mdi-currency-usd",
          value: "ServiceFeeList",
        },
      ],
    },
  ]);

  /**
   * @description Xử lý sự kiện chọn tab khác
   */
  const handleSelected = ([target, ...args]) => {
    const me = proxy;
    me.$router.push({ name: target });
  };

  const open = [];

  const getMenu = () => {
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
  };

  const activeMenuItem = () => {
    const me = proxy;
    const { name } = me.$route;
    if (name) {
      var menuItem = features.value.find(
        (x) =>
          x.componentId == name ||
          x.children?.some((y) => y.componentId == name)
      );
      if (menuItem) {
        if (Array.isArray(menuItem.children)) {
          menuItem.children.forEach((x) => (x.active = false));
          const childItem = menuItem.children.find(
            (x) => x.componentId == name
          );
          if (childItem) {
            childItem.active = true;
          } else {
            menuItem.children[0].active = true;
          }
        } else {
          menuItem.active = true;
        }
      }
    }
  };

  onMounted(() => {
    getMenu();

    // activeMenuItem();

    window._container = proxy;
  });

  return {
    menuItems,
    features,
    handleSelected,
    open,
  };
};
