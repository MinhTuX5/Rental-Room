import { getCurrentInstance, onMounted, ref } from "vue";
// stores
import { useRoomStore } from "../../../stores/roomManagement/dictionary/roomStore";
import Role from "../../../common/enum/Role";

export const useRoomManagementList = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomStore();

  const items = ref([]);

  const show = ref(false);
  const overlay = ref(true);

  const showRoomPost = (item) => {
    const me = proxy;
    me.$router.push({
      name: "Management_PostDetail",
      query: { roomPostId: item.room_post_id, roomId: item.room_id },
    });
  };

  const isShowUpdateBtn = ref(true);

  onMounted(async () => {
    items.value = await store.getAllItems();
    items.value.forEach((x) => {
      if (x.images) {
        const firstImg = x.images.split(",")[0];
        x.first_image = firstImg;
      }
    });
    overlay.value = false;
    if (Array.isArray(items.value)) {
      items.value.sortByField("room_name");
    }

    if (window.PageRole === Role.Renter) {
      isShowUpdateBtn.value = false;
    }
  });

  return { items, show, showRoomPost, overlay, isShowUpdateBtn };
};
