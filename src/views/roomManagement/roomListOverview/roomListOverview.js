import { getCurrentInstance, onMounted, ref } from "vue";
// stores
import { useRoomStore } from "../../../stores/roomManagement/dictionary/roomStore";

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
      params: { roomID: item.room_id },
    });
  };

  onMounted(async () => {
    items.value = await store.getAllItems();
    overlay.value = false;
    if (Array.isArray(items.value)) {
      items.value.sortByField("room_name");
    }
  });

  return { items, show, showRoomPost, overlay };
};
