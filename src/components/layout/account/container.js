import { getCurrentInstance, onMounted, reactive, ref } from "vue";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const headerHeight = 70;
  const navWidth = 200;

  const features = reactive([
    { title: "Đăng bài", componentId: "PostDetailPopup", path: "dang-bai" },
    {
      title: "Quản lý bài đăng",
      componentId: "PostManagement",
      path: "quan-ly-bai-dang",
    },
    {
      title: "Sửa thông tin cá nhân",
      componentId: "InfoUpdating",
      path: "cap-nhat-thong-tin",
    },
    { title: "Đổi mật khẩu", componentId: "PasswordUpdating", path: 'doi-mat-khau' },
    { title: "Lịch hẹn", componentId: "AppointmentSchedule", path: 'lich-hen' },
  ]);

  const onClickTab = (value) => {
    console.log(value);
  };

  const model = reactive({});
  const componentId = ref(features[0].componentId);

  /**
   * @description Xử lý sự kiện chọn tab khác
   * @author nvthinh 03.08.2024
   */
  const handleUpdateSelected = (value) => {
    const selectedItem = features.find((x) => x.active);
    if (Array.isArray(value) && value.length) {
      componentId.value = value[0];
      if (selectedItem && componentId.value != selectedItem.componentId) {
        selectedItem.active = false;
      }
    }
  };

  onMounted(() => {
    const me = proxy;
    const route = me.$route.params;

    if (route && typeof route === "object") {
      if (route.path) {
        const component = features.find((x) => x.path === route.path);
        if (component) {
          component.active = true;
          componentId.value = component.componentId;
        }
      }
    }

    window._accountContainer = proxy;
  });

  return {
    headerHeight,
    features,
    navWidth,
    onClickTab,
    model,
    handleUpdateSelected,
    componentId,
  };
};
