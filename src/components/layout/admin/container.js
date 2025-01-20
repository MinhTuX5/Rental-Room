import { getCurrentInstance, onMounted, ref } from "vue";
// stores
import { useContextAdminStore } from "../../../stores/contextAdminStore";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const showPopup = ref(false);

  const openPage = (isHomePage = true) => {
    const originLink = window.location.origin;
    let newLink = `${originLink}`;

    if (!isHomePage) {
      newLink = `${originLink}/dang-nhap`;
    }

    window.open(newLink, "_blank");
  };

  const openHomePage = () => {
    openPage(true);
  };

  const openManagementPage = () => {
    openPage(false);
  };

  const logout = () => {
    useContextAdminStore().$reset();
    localStorage.removeItem("context_admin");
    window.location.href = "/";
  };

  const menuItems = ref([
    {
      title: "Đăng và tìm trọ",
      onClick: openHomePage,
      icon: "mdi-home-search",
    },
    {
      title: "Quản lý trọ",
      onClick: openManagementPage,
      icon: "mdi-home-edit-outline",
    },
    {
      title: "Đổi mật khẩu",
      onClick: () => {
        showPopup.value = true;
      },
      icon: "mdi-lock-reset",
    },
    { title: "Đăng xuất", onClick: logout, icon: "mdi-logout" },
  ]);

  const features = ref([
    // {
    //   title: "Tổng quan",
    //   componentId: "RoomListOverview",
    //   icon: "mdi-chart-areaspline",
    //   value: "RoomListOverview",
    // },
    {
      title: "Phê duyệt bài đăng",
      componentId: "PostApproval",
      icon: "mdi-clipboard-check-multiple-outline",
      value: "PostApproval",
      path: "/admin/phe-duyet",
    },
  ]);

  /**
   * @description Xử lý sự kiện chọn tab khác
   */
  const handleSelected = ([target, ...args]) => {
    const me = proxy;
    me.$router.push({ name: target });
  };

  const rail = ref(false);

  onMounted(() => {});

  return {
    menuItems,
    features,
    handleSelected,
    showPopup,
    rail,
  };
};
