// libraries
import { getCurrentInstance, onMounted, ref, computed } from "vue";
// store
import { useContractStore } from "@/stores/roomManagement/dictionary/ContractStore";
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";
import { useRoomCategoryStore } from "@/stores/roomManagement/dictionary/roomCategoryStore";
// resources
import {
  convertCurrencyFormat,
  formatDate,
  showMessage,
  MessageType,
} from "../../../../../common/commonFunction";
import contractAPI from "@/apis/dictionaryAPI/contractAPI";
import _enum from "@/common/enum";

export const useContractDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useContractStore();
  const roomStore = useRoomStore();
  const roomCategoryStore = useRoomCategoryStore();

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
  const allRoomCategories = ref([]);

  const getBuildingContracts = async () => {
    const response = await contractAPI.getPaging({
      skip: 0,
      take: 100000,
      filters: store.defaultFilters,
    });

    return response?.data ?? [];
  };

  const isRentedRoom = (room) => {
    return room?.is_empty === false || Number(room?.member_count ?? 0) > 0;
  };

  const parseNumber = (value) => {
    const parsedValue = convertCurrencyFormat(value);
    return Number(parsedValue ?? 0);
  };

  const getRoomCategoryById = (roomCategoryId) => {
    return allRoomCategories.value.find(
      (item) => item[roomCategoryStore.$state.idField] === roomCategoryId
    );
  };

  const getRoomPrice = (room) => {
    const roomCategory = getRoomCategoryById(room?.room_category_id);
    return parseNumber(roomCategory?.room_price ?? room?.room_price);
  };

  const getAvailableContractRooms = async () => {
    const [rooms, contracts] = await Promise.all([
      roomStore.getAllItems(),
      getBuildingContracts(),
    ]);

    const currentRoomId = proxy.model?.[roomStore.$state.idField];
    const contractedRoomIds = new Set(
      contracts
        .filter((contract) => contract.room_id !== currentRoomId)
        .map((contract) => contract.room_id)
    );

    return rooms.filter(
      (room) => isRentedRoom(room) && !contractedRoomIds.has(room.room_id)
    );
  };

  const onSelectRoom = (roomID) => {
    const room = allRooms.value.find(
      (item) => item[roomStore.$state.idField] === roomID
    );

    if (room) {
      proxy.model.room_category_id = room.room_category_id;
      proxy.model.room_price = getRoomPrice(room);
    }
  };

  const validateBeforeSave = async () => {
    const [contracts, rooms] = await Promise.all([
      getBuildingContracts(),
      roomStore.getAllItems(),
    ]);
    const currentContractId = proxy.model?.[store.$state.idField];
    const roomID = proxy.model?.[roomStore.$state.idField];

    if (!roomID) {
      showMessage("Vui lòng chọn phòng", MessageType.Warning);
      return false;
    }

    const room = rooms.find((item) => item.room_id === roomID);
    if (!isRentedRoom(room)) {
      showMessage("Chỉ phòng đã thuê mới được tạo hợp đồng", MessageType.Warning);
      return false;
    }

    const otherContracts = contracts.filter(
      (contract) => contract.contract_id !== currentContractId
    );
    if (otherContracts.some((contract) => contract.room_id === roomID)) {
      showMessage("Phòng này đã có hợp đồng", MessageType.Warning);
      return false;
    }

    if (proxy.editMode === _enum.Mode.Add && contracts.length >= rooms.length) {
      showMessage(
        "Số hợp đồng không được vượt quá số phòng đã khai báo",
        MessageType.Warning
      );
      return false;
    }

    return true;
  };

  const submit = async () => {
    const me = proxy;
    if (!(await validateBeforeSave())) {
      return;
    }

    me.loading = true;
    me.handleCommon();
    try {
      switch (me.editMode) {
        case _enum.Mode.Update:
          await me.update();
          break;
        default:
          await me.insert();
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      me.loading = false;
    }
  };

  onMounted(async () => {
    const [rooms, roomCategories] = await Promise.all([
      getAvailableContractRooms(),
      roomCategoryStore.getAllItems(),
    ]);
    allRooms.value = rooms;
    allRoomCategories.value = roomCategories;

    const roomID = proxy.model?.[roomStore.$state.idField];
    if (roomID) {
      onSelectRoom(roomID);
    }
  });

  return {
    title,
    store,
    defaultModel,
    roomStore,
    roomCategoryStore,
    allRooms,
    allRoomCategories,
    startDate,
    endDate,
    onSelectRoom,
    submit,
  };
};
