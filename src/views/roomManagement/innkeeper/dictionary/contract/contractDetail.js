import { getCurrentInstance, onMounted, ref, watch } from "vue";
// store
import { useContractStore } from "@/stores/roomManagement/dictionary/ContractStore";
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";

export const useContractDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useContractStore();
  const roomStore = useRoomStore();

  const title = ref("Hợp đồng");

  const defaultModel = {};

  const allRooms = ref([]);
  onMounted(async () => {
    allRooms.value = await roomStore.getAllItems();
  });

  return {
    title,
    store,
    defaultModel,
    roomStore,
    allRooms,
  };
};
