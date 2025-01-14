import { getCurrentInstance, onMounted, ref, reactive } from "vue";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useAppStore } from "../../../stores/appStore";
import { useContextStore } from "../../../stores/contextStore";
// resource
import { showMessage } from "@/common/commonFunction";
import { useRoomSearchCommon } from "@/views/roomSearch/roomSearchCommon";
import { usePostOverviewCommon } from "./postOverviewCommon";
import { formatNumberWithCommas } from "../../../common/commonFunction";

export const usePostOverview = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();
  const appStore = useAppStore();
  const contextStore = useContextStore();

  const { featureBtns } = usePostOverviewCommon();

  const viewDetail = () => {
    const me = proxy;
    me.$router.push({
      name: me.$props.detailPageName,
      params: { id: me.$props.item.room_post_id },
    });
  };

  const showDialog = ref(false);
  const dialogConfig = reactive({
    title: "",
    text: "",
    icon: "",
  });

  const showDeleteDialog = () => {
    dialogConfig.title = "Xóa bài viết";
    dialogConfig.text = "Bạn có chắc muốn xóa bài viết này?";
    dialogConfig.icon = "mdi-trash-can-outline";
    showDialog.value = true;
  };

  /**
   * @description Xóa bài đăng
   */
  const deletePost = async () => {
    const me = proxy;

    try {
      const postID = me.$props.item.room_post_id;
      if (postID) {
        await store.deleteAsync(postID);
        showMessage("Xóa bài đăng thành công");
        me.$emit("delete", postID);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description Yêu thích bài viết
   */
  const likePost = async (item) => {
    const me = proxy;

    
    if (!contextStore.$state.token) {
      appStore.toggleLoginPopup();
      return;
    }

    const { lovePost } = useRoomSearchCommon();
    const param = {
      favorite_post_id: item.favorite_post_id,
      room_post_id: item.room_post_id,
    };

    try {
      const favoritePostID = await lovePost(param);
      me.$props.item.favorite_post_id = favoritePostID;
      if (!favoritePostID) {
        me.$emit("unlikePost", item.room_post_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickItem = () => {
    const me = proxy;
    me.$emit("onClickItem");
  };

  onMounted(() => {});

  return {
    viewDetail,
    deletePost,
    likePost,
    onClickItem,
    featureBtns,
    showDialog,
    dialogConfig,
    showDeleteDialog,
    formatNumberWithCommas
  };
};
