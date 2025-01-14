import { getCurrentInstance, onMounted, reactive, ref } from "vue";
// resources
import Role from "@/common/enum/Role";
import { useContextManageStore } from "@/stores/contextManageStore";
import renterAPI from "../../../apis/roomManagementAPI/renterAPI";
import { showMessage } from "../../../common/commonFunction";
import notificationAPI from "../../../apis/notificationAPI/notificationAPI";
import NotificationType from "../../../common/enum/NotificationType";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const contextStore = useContextManageStore();

  const rail = ref(false);
  const showPopup = ref(false);

  const openHomePage = () => {
    const originLink = window.location.origin;
    let newLink = `${originLink}`;
    window.open(newLink, "_blank");
  };

  const logout = () => {
    contextStore.$reset();
    localStorage.removeItem("context_management");
    window.location.href = "/dang-nhap";
  };

  const menuItems = ref([
    {
      title: "Đăng và tìm trọ",
      onClick: openHomePage,
      icon: "mdi-home-search",
    },
    { title: "Đăng xuất", onClick: logout, icon: "mdi-logout" },
  ]);

  const onShowPopup = () => {
    showPopup.value = true;
  };
  const renterMenuItems = ref([
    {
      title: contextStore?.$state.user?.building_linking_id
        ? "Hủy liên kết tới tòa nhà"
        : "Liên kết tới tòa nhà",
      icon: contextStore?.$state.user?.building_linking_id
        ? "mdi-link-off"
        : "mdi-link",
      onClick: onShowPopup,
    },
  ]);

  const features = ref([]);
  const linkingBuildingId = ref("");

  const renterFeatures = reactive([
    {
      title: "Thông tin phòng",
      componentId: "RoomInfo",
      icon: "mdi-information-variant-circle-outline",
    },
    {
      title: "Danh sách phòng",
      componentId: "RoomListOverview",
      icon: "mdi-list-box-outline",
      value: "RoomListOverview",
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
          icon: "mdi-home-account",
          componentId: "HouseholdList",
          value: "HouseholdList",
        },
        {
          title: "Quản lý thu phí",
          icon: "mdi-cash-sync",
          componentId: "FeeList",
          value: "FeeList",
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
    switch (window.PageRole) {
      case Role.Innkeeper:
        features.value = innkeeperFeatures;
        break;
      case Role.Renter:
        menuItems.value.splice(1, 0, ...renterMenuItems.value);
        renterFeatures.forEach((x) => {
          if (
            x.componentId === "RoomListOverview" &&
            !linkingBuildingId.value
          ) {
            x.isHide = true;
          }
        });
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

  const buildingCode = ref("");
  const phoneNumber = ref("");

  const onLinkToBuilding = async () => {
    const payload = {
      BuildingCode: buildingCode.value,
      PhoneNumber: phoneNumber.value,
    };
    try {
      const innkeeper = await renterAPI.linkToBuilding(payload);
      if (innkeeper) {
        showMessage("Đã gửi yêu cầu đến chủ phòng!");

        const notification = {
          from_user_id: contextStore.$state.user.user_id,
          to_user_id: innkeeper.user_id,
          notification_message: `Người thuê <b>${innkeeper.user_name}</b> muốn liên kết tới tòa nhà có mã <b>${buildingCode.value}</b>.`,
          notification_type: NotificationType.confirmation,
        };
        notificationAPI.sendNotify(notification);
      }
      showPopup.value = false;
    } catch (error) {
      console.error(error);
    }
  };

  const notificationList = ref([]);
  const getNotifications = async () => {
    const res = await notificationAPI.getPaging(
      contextStore.$state.user.user_id
    );
    if (Array.isArray(res.data)) {
      notificationList.value = res.data.map((x) => {
        return {
          prependAvatar: "https://picsum.photos/1920/1080?random",
          title: x.notification_title,
          subtitle: x.notification_message,
        };
      });
    }
  };
  const items = [
    {
      prependAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
      title: "Brunch this weekend?",
      subtitle: `<span class="text-primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
    },
    { type: "divider", inset: true },
    {
      prependAvatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
      title: "Summer BBQ",
      subtitle: `<span class="text-primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
    },
    { type: "divider", inset: true },
    {
      prependAvatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
      title: "Oui oui",
      subtitle:
        '<span class="text-primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
    },
    { type: "divider", inset: true },
    {
      prependAvatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
      title: "Birthday gift",
      subtitle:
        '<span class="text-primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
    },
    { type: "divider", inset: true },
    {
      prependAvatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
      title: "Recipe to try",
      subtitle:
        '<span class="text-primary">Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos.',
    },
  ];

  onMounted(() => {
    if (contextStore.$state.user?.building_linking_id) {
      linkingBuildingId.value = contextStore.$state.user.building_linking_id;
    }

    getMenu();

    getNotifications();

    window._container = proxy;
  });

  return {
    menuItems,
    features,
    handleSelected,
    open,
    rail,
    showPopup,
    buildingCode,
    phoneNumber,
    onLinkToBuilding,
    items,
    notificationList,
  };
};
