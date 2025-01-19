import { getCurrentInstance, onMounted, reactive, ref, computed } from "vue";
// resources
import Role from "@/common/enum/Role";
import { useContextManageStore } from "@/stores/contextManageStore";
import renterAPI from "../../../apis/roomManagementAPI/renterAPI";
import { MessageType, showMessage } from "../../../common/commonFunction";
import notificationAPI from "../../../apis/notificationAPI/notificationAPI";
import NotificationType from "../../../common/enum/NotificationType";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const contextStore = useContextManageStore();
  const user = computed(() => contextStore.$state.user);

  const featureConfig = {
    LinkToBuilding: {
      icon: user?.innkeeper_id ? "mdi-link-off" : "mdi-link",
      title: user?.innkeeper_id
        ? "Hủy liên kết tới tòa nhà"
        : "Liên kết tới tòa nhà",
      text: "Yêu cầu sẽ được gửi đến chủ trọ để chờ xác nhận",
      btnText: "Gửi yêu cầu",
      key: "LinkToBuilding",
    },
    FeedBack: {
      icon: "mdi-message-alert-outline",
      title: "Gửi phản hồi",
      text: "Thông báo sẽ được gửi đến chủ trọ",
      btnText: "Gửi phản hồi",
      key: "FeedBack",
      width: 500,
    },
    GoToHomePage: {
      key: "GoToHomePage",
    },
    Logout: {
      key: "Logout",
    },
  };

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
      icon: "mdi-home-search",
      key: featureConfig.GoToHomePage.key,
    },
    {
      title: "Đăng xuất",
      icon: "mdi-logout",
      key: featureConfig.Logout.key,
    },
  ]);

  const renterMenuItems = ref([
    {
      ...featureConfig.LinkToBuilding,
    },
    {
      ...featureConfig.FeedBack,
    },
  ]);

  const features = ref([]);

  const renterFeatures = reactive([
    {
      title: "Thông tin phòng",
      componentId: "RoomInfo",
      icon: "mdi-information-variant-circle-outline",
      path: "/quan-ly/thong-tin-phong",
    },
    {
      title: "Danh sách phòng",
      componentId: "RoomListOverview",
      icon: "mdi-list-box-outline",
      value: "RoomListOverview",
      path: "/quan-ly/danh-sach-phong",
    },
    {
      title: "Lịch biểu",
      componentId: "AppointmentSchedule",
      icon: "mdi-calendar-account-outline",
      value: "AppointmentSchedule",
      path: "/quan-ly/lich-bieu",
    },
    {
      title: "Quản lý chi tiêu",
      componentId: "Expense",
      icon: "mdi-calendar-account-outline",
      path: "/quan-ly/chi-tieu",
    },
    {
      title: "Tính toán",
      componentId: "Calculation",
      icon: "mdi-calculator",
      path: "/quan-ly/tinh-toan",
    },
    {
      title: "Danh mục",
      icon: "mdi-book-alphabet",
      isGroup: true,
      parentVal: "dictionary",
      path: "quan-ly/danh-muc",
      children: [
        {
          title: "Loại chi phí",
          icon: "mdi-invoice-list-outline",
          value: "ExpenseCategoryList",
          componentId: "ExpenseCategoryList",
          path: "quan-ly/danh-muc/loai-chi-phi",
        },
      ],
    },
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
          if (x.componentId === "RoomListOverview" && !user.innkeeper_id) {
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

  const roomCode = ref("");
  const phoneNumber = ref("");

  const onLinkToBuilding = async () => {
    const payload = {
      roomCode: roomCode.value,
      PhoneNumber: phoneNumber.value,
    };
    try {
      const res = await renterAPI.linkToBuilding(payload);
      if (res) {
        showMessage("Đã gửi yêu cầu đến chủ phòng!");

        const notification = {
          from_user_id: contextStore.$state.user.user_id,
          to_user_id: res.user_id,
          notification_message: `Người thuê <b>${res.user_name}</b> muốn liên kết tới tòa nhà có mã <b>${roomCode.value}</b>.`,
          notification_type: NotificationType.confirmation,
          notification_title: "Yêu cầu liên kết",
          notification_data: JSON.stringify({
            room_id: res.room_id,
          }),
        };
        notificationAPI.sendNotify(notification);
      }
    } catch (error) {
      console.error(error);
      showMessage("Không tìm thấy phòng hoặc chủ phòng!", MessageType.Error);
    }
  };

  const onFeedBack = () => {
    const user = contextStore.$state.user;
    try {
      const notification = {
        from_user_id: user.user_id,
        to_user_id: user.innkeeper_id,
        notification_title: `Phản hồi từ người thuê`,
        notification_message: `Người thuê <b>${user.user_name}</b> tại phòng <b>${user.room_name}</b> thuộc tòa nhà <b>${user.building_name}</b>: ${feedBackText.value}`,
        notification_type: NotificationType.confirmation,
      };
      notificationAPI.sendNotify(notification);
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
      notificationList.value = res.data;
    }
  };

  const selectedMenu = ref();
  const dialogConfig = ref({
    icon: "",
    title: "",
    text: "",
    feature: "",
    btnText: "",
    width: 500,
  });

  const feedBackText = ref();

  const onSubmitDialog = () => {
    const me = proxy;
    try {
      switch (dialogConfig.value.feature) {
        case featureConfig.FeedBack.key:
          onFeedBack();
          break;
        case featureConfig.LinkToBuilding.key:
          onLinkToBuilding();
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      showPopup.value = false;
    }
  };

  const onClickMenu = (item) => {
    switch (item.key) {
      case featureConfig.FeedBack.key:
        dialogConfig.value = { ...featureConfig.FeedBack };
        break;
      case featureConfig.LinkToBuilding.key:
        dialogConfig.value = { ...featureConfig.LinkToBuilding };
        break;
      case featureConfig.GoToHomePage.key:
        openHomePage();
        break;
      case featureConfig.Logout.key:
        logout();
        break;
    }
    showPopup.value = true;
  };

  const onClickNotify = (item) => {
    var notify = notificationList.value.find(
      (x) => x.notification_id == item.id
    );
    if (notify) {
      notify.read_at = new Date();
      notificationAPI.readNotify(notify.notification_id);
    }
  };

  const newNotifications = computed(() => {
    return notificationList.value.filter((x) => !x.read_at);
  });

  onMounted(() => {
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
    roomCode,
    phoneNumber,
    onLinkToBuilding,
    notificationList,
    selectedMenu,
    onSubmitDialog,
    dialogConfig,
    featureConfig,
    onClickMenu,
    feedBackText,
    onClickNotify,
    newNotifications,
  };
};
