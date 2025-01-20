import { computed, getCurrentInstance, onMounted, ref } from "vue";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextStore } from "@/stores/contextStore";
import { usePostOverviewCommon } from "@/components/views/postOverView/postOverviewCommon.js";
// enum
import PostStatus from "../../../common/enum/PostStatus";
import { MessageType, showMessage } from "../../../common/commonFunction";

export const usePostManagement = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();
  const contextStore = useContextStore();
  const isLinked = ref(false);
  if (contextStore.$state.user.innkeeper_id) {
    isLinked.value = true;
  }

  const { featureBtns } = usePostOverviewCommon();

  const tabIndex = ref(1);
  const tabVals = {
    favoritePosts: 5,
  };
  const heightOfList = "calc(100vh - 32px - 48px - 16px)";

  const postDetails = ref([]);

  const postedPosts = computed(() => {
    return postDetails.value.filter((x) => x.post_status == 1);
  });

  const savedPosts = computed(() => {
    return postDetails.value.filter((x) => x.post_status == 0);
  });

  const waitingPosts = computed(() => {
    return postDetails.value.filter(
      (x) => x.post_status === PostStatus.WaitingForApproval
    );
  });

  /**
   * @description Xóa bài viết
   * @param {String} postID
   */
  const onAfterDelete = (postID) => {
    loadData();
  };

  const onPost = () => {
    tabIndex.value = PostStatus.WaitingForApproval;
    loadData();
  };

  const hidePost = () => {
    tabIndex.value = PostStatus.Saved;
    loadData();
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
    const { user } = contextStore.$state;

    if (user?.user_id) {
      if (tabIndex.value == tabVals.favoritePosts) {
        if (!favoritePosts.value.length) {
          me.loading = true;
          try {
            const res = await store.getMyFavoritePosts(user.user_id);
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
        // if (!postDetails.value.length) {
        // }

        me.loading = true;
        try {
          var res = await store.getMyPosts(user.user_id);
          if (Array.isArray(res)) {
            postDetails.value = res;
          }
        } catch (error) {
          console.error(error);
        } finally {
          me.loading = false;
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

  const showDialog = ref(false);
  const overlay = ref(false);
  const buildingCode = ref(0);
  const genPostsFromManagement = async () => {
    try {
      overlay.value = true;
      const payload = {
        BuildingCode: buildingCode.value,
        UserId: contextStore.$state.user.user_id,
        InnkeeperId: contextStore.$state.user.innkeeper_id,
      };
      var res = await store.genPostsFromManagement(payload);
      if (res > 0) {
        showMessage(`Sinh thành công ${res} bài đăng`);
      } else if (res == 0) {
        showMessage(
          `Không có thông tin để sinh dữ liệu. Vui lòng kiểm tra lại.`,
          MessageType.Warning
        );
      } else if (res < 0) {
        showMessage(`Thông tin đầu vào không hợp lệ!`, MessageType.Error);
      }
      await loadData();
    } catch (error) {
      console.error(error);
      showMessage(`Có lỗi xảy ra!`, MessageType.Error);
    } finally {
      overlay.value = false;
      showDialog.value = false;
    }
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
    featureBtns,
    waitingPosts,
    PostStatus,
    isLinked,
    genPostsFromManagement,
    showDialog,
    buildingCode,
    onPost,
    hidePost,
  };
};
