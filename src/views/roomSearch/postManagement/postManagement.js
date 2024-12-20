import { computed, getCurrentInstance, onMounted, ref } from "vue";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextStore } from "@/stores/contextStore";

export const usePostManagement = () => {
  const { proxy } = getCurrentInstance();
  const store = useRoomPostStore();

  const tab = ref(1);
  const heightOfList = "calc(100vh - 32px - 48px - 16px)";

  const postDetails = ref([]);

  const postedPosts = computed(() => {
    return postDetails.value.filter((x) => x.post_status == 1);
  });

  const savedPosts = computed(() => {
    return postDetails.value.filter((x) => x.post_status == 0);
  });

  const onAfterDelete = (postID) => {
    const me = proxy;
    postDetails.value = postDetails.value.filter(
      (x) => x[me.idField] === postID
    );
  };

  onMounted(async () => {
    const contextStore = useContextStore();
    const { userID } = contextStore.$state;
    if (userID) {
      postDetails.value = (await store.getMyPosts(userID)) ?? [];
    }
  });

  return { onAfterDelete, postedPosts, savedPosts, heightOfList, tab };
};
