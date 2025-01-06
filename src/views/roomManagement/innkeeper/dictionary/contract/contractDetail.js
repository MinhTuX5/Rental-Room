// libraries
import { getCurrentInstance, onMounted, ref, computed } from "vue";
// store
import { useContractStore } from "@/stores/roomManagement/dictionary/ContractStore";
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";
// resources
import { formatDate } from "../../../../../common/commonFunction";

export const useContractDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useContractStore();
  const roomStore = useRoomStore();

  const title = ref("Hợp đồng");

  const defaultModel = {
    start_date: new Date(),
  };

  const startDate = computed(() => {
    return formatDate(proxy.model.start_date);
  });

  const endDate = computed(() => {
    return formatDate(proxy.model.end_date);
  });

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
    startDate,
    endDate
  };
};
