import { ref, computed, onMounted, getCurrentInstance } from "vue";
// store
import { useResidentStore } from "../../../../../stores/roomManagement/dictionary/residentStore";
import { useRoomStore } from "../../../../../stores/roomManagement/dictionary/roomStore";
import residentAPI from "@/apis/dictionaryAPI/residentAPI";
// enum
import Gender from "../../../../../common/enum/Gender";
import _enum from "@/common/enum";
import FilterOperator from "@/common/enum/FilterOperator";
// resource
import {
  formatDate,
  showMessage,
  MessageType,
} from "../../../../../common/commonFunction";

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

  const findRoomOwner = async (roomID) => {
    const me = proxy;
    if (!roomID) {
      return null;
    }

    const response = await residentAPI.getPaging({
      skip: 0,
      take: 100000,
      filters: [
        {
          Field: roomStore.$state.idField,
          Value: roomID,
          Operator: FilterOperator.Equal,
        },
      ],
    });

    const residents = response?.data ?? [];
    return residents.find(
      (resident) =>
        resident?.is_owner === true &&
        resident?.resident_id !== me.model?.resident_id
    );
  };

  const onSelectRoom = async (value) => {
    const me = proxy;

    if (await findRoomOwner(value)) {
      me.model.is_owner = false;
    } else {
      me.model.is_owner = true;
    }
  };

  const onOwnerChange = async (value) => {
    const me = proxy;
    if (!value) {
      return;
    }

    const owner = await findRoomOwner(me.model?.[roomStore.$state.idField]);
    if (!owner) {
      return;
    }

    me.model.is_owner = false;
    showMessage(
      `Cần bỏ chọn chủ phòng của ${owner.resident_name} để tiếp tục`,
      MessageType.Warning
    );
  };

  const onClickEdit = () => {
    const me = proxy;
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
    onOwnerChange,
    ownerDisable,
    onClickEdit,
    roomStore,
    allRooms,
    bod,
    Gender,
  };
};
