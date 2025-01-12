import { ref, computed, onMounted, getCurrentInstance } from "vue";
// store
import { useResidentStore } from "../../../../../stores/roomManagement/dictionary/residentStore";
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";
// enum
import Gender from "../../../../../common/enum/Gender";
// resource
import { formatDate } from "../../../../../common/commonFunction";

export const useResidentDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useResidentStore();
  const roomStore = useRoomStore();

  const title = ref("Thông tin người thuê");

  const defaultModel = {
    resident_gender: Gender.Male,
    is_owner: false,
  };

  const ownerDisable = ref(false);

  const onSelectRoom = (value) => {
    const me = proxy;

    if (checkExistOwner(value)) {
      ownerDisable.value = true;
      me.model.is_owner = false;
    } else {
      me.model.is_owner = true;
    }
  };

  // Check phòng đã tồn tại chủ phòng
  const checkExistOwner = (roomID) => {
    const isExist = store.$state.items.some(
      (item) =>
        item[roomStore.$state.idField] == roomID && item.is_owner == true
    );
    return isExist;
  };

  const onClickEdit = () => {
    const me = proxy;
    if (checkExistOwner(me.model.apartmentId) && me.model.is_owner == false) {
      ownerDisable.value = true;
    }
    me.commandClick(_enum.Mode.Update);
  };

  const bod = computed(() => {
    return formatDate(proxy.model.resident_bod);
  });

  const allRooms = ref([]);
  onMounted(async () => {
    allRooms.value = await roomStore.getAllItems();
  });

  return {
    title,
    defaultModel,
    store,
    onSelectRoom,
    ownerDisable,
    onClickEdit,
    roomStore,
    allRooms,
    bod,
    Gender
  };
};
