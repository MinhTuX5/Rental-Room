import { getCurrentInstance, onMounted, reactive, ref } from "vue";
// resources
import { useRoomSearchCommon } from "@/views/roomSearch/roomSearchCommon";

export const useContainer = () => {
  const { proxy } = getCurrentInstance();

  const { logout } = useRoomSearchCommon();

  const headerHeight = 70;
  const navWidth = 200;

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
    logout
  };
};
