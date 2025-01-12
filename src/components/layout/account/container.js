import { getCurrentInstance, onMounted, reactive, ref } from "vue";
// resources
import { moveToTop } from "@/common/commonFunction";
import { logout } from "../../../common/commonFunction";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const headerHeight = 70;
  const navWidth = 200;
  const drawer = ref();

  const features = reactive([
    { title: "Đăng bài", componentId: "PostDetailPopup" },
    {
      title: "Quản lý bài đăng",
      componentId: "PostManagement",
    },
    {
      title: "Quản lý thông tin",
      componentId: "InfoUpdating",
      path: "cap-nhat-thong-tin",
    },
    { title: "Lịch hẹn", componentId: "AppointmentSchedule", path: "lich-hen" },
  ]);

  const onClickTab = (value) => {
    console.log(value);
  };

  const model = reactive({});
  const componentId = ref(features[0].componentId);

  /**
   * @description Xử lý sự kiện chọn tab khác
   */
  const handleUpdateSelected = ([routerName, ...args]) => {
    const me = proxy;
    const selectedItem = features.find((x) => x.active);
    if (selectedItem) {
      selectedItem.active = false;
    }

    if (routerName) {
      me.$router.push({ name: routerName });
    }
  };

  onMounted(() => {
    const me = proxy;

    moveToTop();

    const { name } = me.$route;
    if (name) {
      switch (name) {
        case "PostManagement":
          features[1].active = true;
          break;
        case "InfoUpdating":
          features[2].active = true;
          break;
        default:
          features[0].active = true;
          break;
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
    logout,
    drawer,
  };
};
