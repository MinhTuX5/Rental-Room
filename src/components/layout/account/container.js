import { getCurrentInstance, onMounted, reactive, ref } from "vue";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const headerHeight = 70;
  const navWidth = 200;

  const features = [
    { title: "Đăng bài", componentId: "PostDetailPopup" },
    { title: "Quản lý bài đăng", componentId: "1" },
    { title: "Sửa thông tin cá nhân", componentId: "3" },
    { title: "Đổi mật khẩu", componentId: "4" },
    { title: "Lịch hẹn", componentId: "5" },
  ];

  const onClickTab = (value) => {
    console.log(value);
  };

  const model = reactive({});
  const componentId = ref("");

  const handleUpdateSelected = (value) => {
    if (Array.isArray(value) && value.length) {
      componentId.value = value[0];
    }
  };

  onMounted(() => {
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
