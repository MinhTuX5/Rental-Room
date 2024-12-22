import { getCurrentInstance, onMounted } from "vue";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
// resource
import { showMessage } from "@/common/commonFunction";
import { useRoomSearchCommon } from "@/views/roomSearch/roomSearchCommon";
import { usePostOverviewCommon } from "./postOverviewCommon";

export const usePostOverview = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();

  const {featureBtns} = usePostOverviewCommon();

  const viewDetail = () => {
    const me = proxy;
    me.$router.push({
      name: "PostDetail",
      params: { id: me.$props.item.room_post_id },
    });
  };

  /**
   * @description Xóa bài đăng
   */
  const onDeletePost = async () => {
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
    onDeletePost,
    likePost,
    onClickItem,
    featureBtns
  };
};
