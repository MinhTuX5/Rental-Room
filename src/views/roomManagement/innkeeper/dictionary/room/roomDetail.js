import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";
import { useRoomCategoryStore } from "../../../../../stores/roomManagement/dictionary/roomCategoryStore";

export const useRoomDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomStore();
  const roomCategoryStore = useRoomCategoryStore();

  const title = ref("Phòng");

  const defaultModel = {
    no_of_bed_rooms: 1,
    room_area: 0,
    is_empty: true,
  };

  const roomPrice = ref(0);
  watch(roomPrice, (newVal) => {
    proxy.model.room_price = newVal;
  });

  const onSelectRoomCategory = (itemVal) => {
    const me = proxy;
    const roomCategory = allRoomCategories.value.find(
      (r) => r[roomCategoryStore.idField] === itemVal
    );
    if (roomCategory) {
      roomPrice.value = roomPrice.value || roomCategory.room_price;
      me.model.room_area = me.model.room_area || roomCategory.room_area;
      me.model.no_of_bed_rooms =
        me.model.no_of_bed_rooms || roomCategory.no_of_bed_rooms;
    }
  };

  const allRoomCategories = ref([]); // list of all room categories
  onMounted(async () => {
    const me = proxy;
    if (me._formParam?.model?.room_price) {
      roomPrice.value = me._formParam?.model?.room_price;
    }

    allRoomCategories.value = await roomCategoryStore.getAllItems();
  });

  return {
    title,
    store,
    roomPrice,
    defaultModel,
    roomCategoryStore,
    allRoomCategories,
    onSelectRoomCategory,
  };
};
