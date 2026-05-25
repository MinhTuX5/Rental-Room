import { getCurrentInstance, onMounted, ref } from "vue";
// store
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";
import { useRoomCategoryStore } from "../../../../../stores/roomManagement/dictionary/roomCategoryStore";
import { convertCurrencyFormat } from "@/common/commonFunction";

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

  const parseNumber = (value) => {
    const parsedValue = convertCurrencyFormat(value);
    return Number(parsedValue ?? 0);
  };

  const onSelectRoomCategory = (itemVal) => {
    const me = proxy;
    const roomCategory = allRoomCategories.value.find(
      (r) => r[roomCategoryStore.idField] === itemVal
    );
    if (roomCategory) {
      me.model.room_price = parseNumber(roomCategory.room_price);
      me.model.room_area = parseNumber(roomCategory.room_area);
      me.model.no_of_bed_rooms = parseNumber(roomCategory.no_of_bed_rooms);
    }
  };

  const allRoomCategories = ref([]); // list of all room categories
  onMounted(async () => {
    allRoomCategories.value = await roomCategoryStore.getAllItems();
  });

  return {
    title,
    store,
    defaultModel,
    roomCategoryStore,
    allRoomCategories,
    onSelectRoomCategory,
  };
};
