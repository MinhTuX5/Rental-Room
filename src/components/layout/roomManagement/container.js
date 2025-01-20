import { getCurrentInstance, onMounted, reactive, ref, computed } from "vue";
// resources
import {
  MessageType,
  showMessage,
  readNotify,
  sendNotify,
  getNotifications,
  getManagementContext,
} from "../../../common/commonFunction";
// stores
import { useContextManageStore } from "@/stores/contextManageStore";

import renterAPI from "../../../apis/roomManagementAPI/renterAPI";
import notificationAPI from "../../../apis/notificationAPI/notificationAPI";
import NotificationType from "../../../common/enum/NotificationType";
import EventKey from "../../../common/enum/EventKey";
import { renterFeatures, innkeeperFeatures } from "./resources";
import _ from "lodash";
import Role from "../../../common/enum/Role";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const contextStore = useContextManageStore();

  const linkToRoomConfig = computed(() => ({
    icon: contextStore.$state.user.innkeeper_id ? "mdi-link-off" : "mdi-link",
    title: contextStore.$state.user.innkeeper_id
      ? "Hủy liên kết tới phòng"
      : "Liên kết tới phòng",
    text: "Yêu cầu sẽ được gửi đến chủ trọ để chờ xác nhận",
    btnText: "Gửi yêu cầu",
    key: "LinkToRoom",
  }));

  const featureConfig = reactive({
    LinkToRoom: linkToRoomConfig.value,
    FeedBack: {
      icon: "mdi-message-alert-outline",
      title: "Gửi phản hồi",
      text: "Thông báo sẽ được gửi đến chủ trọ",
      btnText: "Gửi phản hồi",
      key: "FeedBack",
      width: 500,
    },
    LinkToAccount: {
      icon: "mdi-hand-okay",
      title: "Xác nhận liên kết",
      btnText: "Xác nhận",
      key: "LinkToAccount",
      width: 300,
    },
    GoToHomePage: {
      key: "GoToHomePage",
    },
    Logout: {
      key: "Logout",
    },
  });

  const rail = ref(false);
  const showDialog = ref(false);

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
      ...featureConfig.LinkToRoom,
    },
    {
      isHide: contextStore.$state.user.innkeeper_id ? false : true,
      ...featureConfig.FeedBack,
    },
  ]);

  const features = ref([]);

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
        features.value = renterFeatures;
        break;
      default:
        break;
    }
  };

  const roomCode = ref("");
  const phoneNumber = ref("");

  const onLinkToRoom = async () => {
    const payload = {
      roomCode: roomCode.value,
      PhoneNumber: phoneNumber.value,
    };
    try {
      const res = await renterAPI.linkToRoom(payload);
      if (res) {
        showMessage("Đã gửi yêu cầu đến chủ phòng!");

        const notification = {
          from_user_id: contextStore.$state.user.user_id,
          to_user_id: res.user_id,
          notification_message: `Người thuê <b>${res.user_name}</b> muốn liên kết tới phòng có mã <b>${roomCode.value}</b>.`,
          notification_type: NotificationType.confirmation,
          notification_title: "Yêu cầu liên kết",
          notification_data: JSON.stringify({
            room_id: res.room_id,
            user_id: contextStore.$state.user.user_id,
          }),
          event_key: EventKey.LinkToRoom,
        };
        notificationAPI.sendNotify(notification);
      }
    } catch (error) {
      console.error(error);
      showMessage("Có lỗi xảy ra!", MessageType.Error);
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

  const selectedMenu = ref();
  const dialogConfig = ref({
    icon: "",
    title: "",
    text: "",
    btnText: "",
    key: "",
    width: 500,
  });

  const feedBackText = ref();

  /**
   *
   */
  const onSubmitDialog = () => {
    try {
      switch (dialogConfig.value.key) {
        case featureConfig.FeedBack.key:
          onFeedBack();
          break;
        case featureConfig.LinkToRoom.key:
          if (window.PageRole === Role.Innkeeper) {
            confirmLinkingRoom();
          } else {
            onLinkToRoom();
          }
          break;
        case featureConfig.LinkToAccount.key:
          confirmLinkingAccount();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      showDialog.value = false;
    }
  };

  const confirmLinkingAccount = async () => {
    try {
      var payload = {
        room_seeker_id: dialogConfig.value.data?.room_seeker_id,
        innkeeper_id: contextStore.$state.user.user_id,
      };

      const res = await renterAPI.linkToAccount(payload);
      if (res) {
        showMessage("Xác nhận liên kết thành công!");
        const notification = {
          from_user_id: payload.innkeeper_id,
          to_user_id: payload.room_seeker_id,
          notification_message: `Liên kết tài khoản thành công!`,
          notification_type: NotificationType.info,
          notification_title: "Thông báo",
          notification_data: JSON.stringify({
            innkeeper_id: payload.innkeeper_id,
          }),
          event_key: EventKey.LinkingSuccess,
        };
        sendNotify(notification).then(() => {
          getNotify();
        });
      } else {
        showMessage("Xác nhận liên kết thất bại!", MessageType.Error);
      }
    } catch (error) {
      console.error(error);
      showMessage("Có lỗi xảy ra!", MessageType.Error);
    } finally {
      showDialog.value = false;
    }
  };

  // Chủ trọ xác nhận
  const confirmLinkingRoom = async () => {
    try {
      var payload = {
        user_id: dialogConfig.value.data.user_id,
        room_id: dialogConfig.value.data.room_id,
        notification_id: dialogConfig.value.notification_id,
        innkeeper_id: contextStore.$state.user.user_id,
      };

      const res = await renterAPI.createRoomLinking(payload);
      if (res) {
        showMessage("Xác nhận liên kết thành công!");
        const notification = {
          from_user_id: contextStore.$state.user.user_id,
          to_user_id: payload.user_id,
          notification_message: `Liên kết tài khoản thành công!`,
          notification_type: NotificationType.info,
          notification_title: "Thông báo",
          notification_data: JSON.stringify({
            innkeeper_id: contextStore.$state.user.user_id,
            room_name: res.room_name,
            building_name: res.building_name,
          }),
          event_key: EventKey.LinkingSuccess,
        };
        sendNotify(notification).then(() => {
          getNotify();
        });
      } else {
        showMessage("Xác nhận liên kết thất bại!", MessageType.Error);
      }
    } catch (error) {
      console.error(error);
      showMessage("Có lỗi xảy ra!", MessageType.Error);
    } finally {
      showDialog.value = false;
    }
  };

  const onClickMenu = (item) => {
    switch (item.key) {
      case featureConfig.FeedBack.key:
        dialogConfig.value = { ...featureConfig.FeedBack };
        showDialog.value = true;
        break;
      case featureConfig.LinkToRoom.key:
        dialogConfig.value = { ...featureConfig.LinkToRoom };
        showDialog.value = true;
        break;
      case featureConfig.GoToHomePage.key:
        openHomePage();
        break;
      case featureConfig.Logout.key:
        logout();
        break;
    }
  };

  const onClickNotify = (item) => {
    var notify = notificationList.value.find(
      (x) => x.notification_id == item.notification_id
    );

    if (notify && !notify.read_at) {
      notify.read_at = new Date();
      readNotify(notify.notification_id);
    }

    if (
      (item.event_key === EventKey.LinkToAccount ||
        item.event_key === EventKey.LinkToRoom) &&
      !item.is_completed
    ) {
      dialogConfig.value = _.cloneDeep(featureConfig.LinkToAccount);
      dialogConfig.value.key = item.event_key;
      if (item.notification_data) {
        dialogConfig.value.data = JSON.parse(item.notification_data);
      }
      dialogConfig.value.notification_id = item.notification_id;
      showDialog.value = true;
    } // Liên kết thành công
    else if (item.event_key === EventKey.LinkingSuccess) {
      if (item.notification_data) {
        const data = JSON.parse(item.notification_data);
        if (data.innkeeper_id) {
          const context = getManagementContext();
          context.user.innkeeper_id = data.innkeeper_id;
          localStorage.setItem("context_management", JSON.stringify(context));
          // context store
          contextStore.$state.user = context.user;
          // Cập nhật cấu hình
          featureConfig.LinkToRoom = linkToRoomConfig.value;
          menuItems.value.forEach((x) => {
            x.isHide = false;
          });
        }
      }
    }
  };

  const newNotifications = computed(() => {
    return notificationList.value.filter((x) => !x.read_at);
  });

  const getNotify = () => {
    getNotifications(contextStore.$state.user.user_id)
      .then((x) => {
        if (Array.isArray(x)) {
          notificationList.value = x;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const isRenterPage = window.PageRole == Role.Renter;

  onMounted(() => {
    getMenu();
    getNotify();
    window._container = proxy;
  });

  return {
    menuItems,
    features,
    handleSelected,
    open,
    rail,
    showDialog,
    roomCode,
    phoneNumber,
    onLinkToRoom,
    notificationList,
    selectedMenu,
    onSubmitDialog,
    dialogConfig,
    featureConfig,
    onClickMenu,
    feedBackText,
    onClickNotify,
    newNotifications,
    getNotify,
    contextStore,
    linkToRoomConfig,
    isRenterPage,
  };
};
