import { getCurrentInstance } from "vue";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
// resource
import { showMessage } from "@/common/commonFunction";

export const usePostOverview = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();

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

  return {
    viewDetail,
    onDeletePost,
  };
};
