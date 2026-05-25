import { onMounted, ref } from "vue";
// stores
import { useRoomStore } from "../../../stores/roomManagement/dictionary/roomStore";
import Role from "../../../common/enum/Role";
import FilterOperator from "../../../common/enum/FilterOperator";
import residentAPI from "../../../apis/dictionaryAPI/residentAPI";

export const useRoomManagementList = () => {
  const store = useRoomStore();

  const items = ref([]);
  const residents = ref([]);
  const selectedRoom = ref(null);
  const showResidentDialog = ref(false);

  const show = ref(false);
  const overlay = ref(true);

  const getResponseItems = (response) => {
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }
    return [];
  };

  const showRoomPost = async (item) => {
    selectedRoom.value = item;
    residents.value = [];
    showResidentDialog.value = true;
    overlay.value = true;

    try {
      const response = await residentAPI.getPaging({
        skip: 0,
        take: 1000,
        filters: [
          {
            Field: "room_id",
            Value: item.room_id,
            Operator: FilterOperator.Equal,
          },
        ],
      });

      residents.value = getResponseItems(response);
    } catch (error) {
      console.error(error);
    } finally {
      overlay.value = false;
    }
  };

  const closeResidentDialog = () => {
    showResidentDialog.value = false;
    selectedRoom.value = null;
    residents.value = [];
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

  return {
    items,
    show,
    showRoomPost,
    overlay,
    isShowUpdateBtn,
    residents,
    selectedRoom,
    showResidentDialog,
    closeResidentDialog,
  };
};
