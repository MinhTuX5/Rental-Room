import { computed, getCurrentInstance, onMounted, ref } from "vue";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextStore } from "@/stores/contextStore";
import { usePostOverviewCommon } from "@/components/views/postOverView/postOverviewCommon.js";

export const usePostManagement = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();
  const contextStore = useContextStore();
  const { userID } = contextStore.$state;

  const { featureBtns } = usePostOverviewCommon();

  const tabIndex = ref(1);
  const tabVals = {
    postedPosts: 1,
    savedPosts: 2,
    favoritePosts: 3,
  };
  const heightOfList = "calc(100vh - 32px - 48px - 16px)";

  const postDetails = ref([]);

  const postedPosts = computed(() => {
    return postDetails.value.filter((x) => x.post_status == 1);
  });

  const savedPosts = computed(() => {
    return postDetails.value.filter((x) => x.post_status == 0);
  });

  /**
   * @description Xóa bài viết
   * @param {String} postID
   */
  const onAfterDelete = (postID) => {
    const me = proxy;
    postDetails.value = postDetails.value.filter(
      (x) => x[me.idField] === postID
    );
  };

  const favoritePosts = ref([]);
  const onChangeTab = async (tabIndex) => {
    const me = proxy;
    // replace: true => Không lưu lịch sử
    me.$router.push({ query: { tab: tabIndex }, replace: true });

    await loadData();
  };

  const loadData = async () => {
    const me = proxy;
    if (userID) {
      if (tabIndex.value == tabVals.favoritePosts) {
        if (!favoritePosts.value.length) {
          me.loading = true;
          try {
            const res = await store.getMyFavoritePosts(userID);
            if (Array.isArray(res) && res.length) {
              favoritePosts.value = res;
            }
          } catch (error) {
            console.error(error);
          } finally {
            me.loading = false;
          }
        }
      } else {
        if (!postDetails.value.length) {
          me.loading = true;
          try {
            var res = await store.getMyPosts(userID);
            if (Array.isArray(res)) {
              postDetails.value = res;
            }
          } catch (error) {
            console.error(error);
          } finally {
            me.loading = false;
          }
        }
      }
    } else {
      console.error("Không tìm thấy id người dùng");
    }
  };

  /**
   * @description Bỏ yêu thích bài đăng
   * @param {String} roomPostID
   */
  const onUnLikePost = (roomPostID) => {
    const me = proxy;
    favoritePosts.value = favoritePosts.value.filter(
      (x) => x[me.idField] !== roomPostID
    );
  };

  onMounted(async () => {
    const me = proxy;

    if (me.$route.query) {
      const { tab } = me.$route.query;
      if (!isNaN(parseInt(tab))) {
        tabIndex.value = parseInt(tab);
      }
    }

    await loadData();
  });

  return {
    onAfterDelete,
    postedPosts,
    savedPosts,
    favoritePosts,
    heightOfList,
    tabIndex,
    tabVals,
    onChangeTab,
    store,
    onUnLikePost,
    loadData,
    featureBtns
  };
};
