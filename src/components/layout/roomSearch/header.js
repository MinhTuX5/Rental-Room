import { getCurrentInstance, onMounted, ref, reactive } from "vue";
import moment from "moment";

import { useContextStore } from "../../../stores/contextStore";
import { useAppStore } from "../../../stores/appStore";
import notificationAPI from "../../../apis/notificationAPI/notificationAPI";
import { useContextAdminStore } from "../../../stores/contextAdminStore";
import Role from "../../../common/enum/Role";
import NotificationType from "../../../common/enum/NotificationType";
import { useRoomPostStore } from "../../../stores/roomSearch/roomPostStore";
import {
  getContext,
  showMessage,
  getNotifications,
  readNotify,
  sendNotify,
} from "../../../common/commonFunction";
import EventKey from "../../../common/enum/EventKey";

export const useHeader = () => {
  const { proxy } = getCurrentInstance();

  const contextStore = useContextStore();
  const user = contextStore.$state.user;

  const appStore = useAppStore();
  const adminContext = useContextAdminStore();

  const featureConfig = reactive({
    LinkToInnkeeper: {
      icon: contextStore.$state.user.innkeeper_id ? "mdi-link-off" : "mdi-link",
      title: contextStore.$state.user.innkeeper_id
        ? "Hủy liên kết tới chủ phòng"
        : "Liên kết tới tới chủ phòng",
      text: "Yêu cầu sẽ được gửi đến chủ trọ để chờ xác nhận",
      btnText: "Gửi yêu cầu",
      key: "LinkToInnkeeper",
    },
    MoveToAdminPage: {
      key: "MoveToAdminPage",
    },
  });

  const tabsConfig = [
    { display: "Tìm trọ" },
    { display: "Quản lý trọ" },
    { display: "Giới thiệu" },
  ];

  /**
   * @description Quản lý phòng trọ
   */
  const openManagePage = () => {
    const originLink = window.location.origin;
    const newLink = `${originLink}/dang-nhap`;
    window.open(newLink, "_blank");
  };

  const openAdminPage = () => {
    const openNewTab = () => {
      const originLink = window.location.origin;
      const newLink = `${originLink}/admin`;
      window.open(newLink, "_blank");
    };

    if (!adminContext.$state.token) {
      appStore.toggleLoginPopup();
      appStore.$state.LoginWithRole = Role.Admin;
      return;
    }

    openNewTab();
  };

  const onClickHomeBtn = () => {
    const me = proxy;
    me.$emit("onClickHomeBtn");
  };

  const moveToPage = (pageName, query = {}) => {
    const me = proxy;

    if (!contextStore.$state.token) {
      appStore.toggleLoginPopup();
      appStore.$state.moveToPageAfterLogin = pageName;
      return;
    }

    me.$router.push({ name: pageName, query });
  };

  const avatarLink = contextStore.$state.user?.user_avatar;

  const onClickMenu = (key) => {
    switch (key) {
      case featureConfig.LinkToInnkeeper.key:
        dialogConfig.value = { ...featureConfig.LinkToInnkeeper };
        showDialog.value = true;
        break;
      case featureConfig.MoveToAdminPage.key:
        openAdminPage();
        break;
    }
  };

  const phoneNumber = ref();
  const linkToInnkeeper = async () => {
    const payload = {
      PhoneNumber: phoneNumber.value,
    };
    try {
      const res = await useRoomPostStore().linkToInnkeeper(payload);
      if (res) {
        showMessage("Đã gửi yêu cầu đến chủ phòng!");

        const notification = {
          from_user_id: contextStore.$state.user.user_id,
          to_user_id: res.innkeeper_id,
          notification_message: `Người dùng <b>${contextStore.$state.user.user_name}</b> với số điện thoại <b>${contextStore.$state.user.phone_number}</b> muốn liên kết với tài khoản của bạn.`,
          notification_type: NotificationType.confirmation,
          notification_title: "Yêu cầu liên kết",
          notification_data: JSON.stringify({
            room_seeker_id: contextStore.$state.user.user_id,
          }),
          event_key: EventKey.LinkToAccount,
        };
        notificationAPI.sendNotify(notification);
      } else {
        showMessage("Không tìm thấy phòng chủ phòng!", MessageType.Warning);
      }
    } catch (error) {
      console.error(error);
      showMessage("Có lỗi xảy ra!", MessageType.Error);
    }
  };

  const menuItems = ref([
    {
      title: "Quản trị bài đăng",
      icon: "mdi-shield-account-outline",
      key: featureConfig.MoveToAdminPage.key,
    },
    {
      title: featureConfig.LinkToInnkeeper.title,
      icon: featureConfig.LinkToInnkeeper.icon,
      hide: !contextStore.$state.token || !contextStore.$state.user?.user_id,
      key: featureConfig.LinkToInnkeeper.key,
    },
  ]);

  const showDialog = ref(false);
  const dialogConfig = ref({
    icon: "",
    title: "",
    text: "",
    btnText: "",
    width: 500,
  });

  const onSubmitDialog = async () => {
    try {
      switch (dialogConfig.value.key) {
        case featureConfig.LinkToInnkeeper.key:
          if (!user?.innkeeper_id) {
            await linkToInnkeeper();
          } else {
            const res = await useRoomPostStore().cancelLinkToInnkeeper();
            if (res) {
              showMessage("Đã hủy liên kết tới chủ phòng!");
              delete contextStore.$state.user.innkeeper_id;
              const context = getContext();
              delete context.user.innkeeper_id;
              localStorage.set("context", JSON.stringify(context));
            }
          }
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      showDialog.value = false;
    }
  };

  const notificationList = ref([]);
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

  const onClickNotifyBtn = () => {
    const context = getContext();
    if (!context?.token) {
      appStore.toggleLoginPopup();
      return;
    }

    getNotify();
  };

  const onClickNotify = (item) => {
    var notify = notificationList.value.find(
      (x) => x.notification_id == item.notification_id
    );

    if (notify && !notify.read_at) {
      notify.read_at = new Date();
      readNotify(notify.notification_id);

      if (item.event_key === EventKey.LinkingSuccess) {
        if (item.notification_data) {
          const data = JSON.parse(item.notification_data);
          if (data.innkeeper_id) {
            const context = getContext();
            context.user.innkeeper_id = data.innkeeper_id;
            localStorage.setItem("context", JSON.stringify(context));
            // context store
            contextStore.$state.user = context.user;
          }
        }
      }
    }
  };

  onMounted(() => {
    if (contextStore.$state.user.user_id) {
      getNotify();
    }
    window._header = proxy;
  });

  return {
    tabsConfig,
    openManagePage,
    onClickHomeBtn,
    moveToPage,
    avatarLink,
    menuItems,
    dialogConfig,
    onSubmitDialog,
    showDialog,
    onClickMenu,
    featureConfig,
    phoneNumber,
    notificationList,
    getNotify,
    onClickNotifyBtn,
    onClickNotify,
    moment,
  };
};
