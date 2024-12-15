import { getCurrentInstance, onMounted, ref } from "vue";
import moment from "moment";
// Resources
import { useRoomSearchCommon } from "../roomSearchCommon";
import { showMessage } from "@/common/commonFunction";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextStore } from "@/stores/contextStore";
// resources
import { isJson } from "@/common/commonFunction";

export const usePostDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();
  const contextStore = useContextStore();

  const { filters } = useRoomSearchCommon();

  const model = ref({});

  /**
   * @description Yêu thích/Hủy yêu thích bài viết
   */
  const lovePost = async () => {
    if (typeof store.lovePost === "function") {
      const param = {
        favorite_post_id: model.value.favorite_post_id,
        room_post_id: model.value.room_post_id,
        user_id: contextStore.$state.userID,
      };

      if (!param.room_post_id || !param.user_id) {
        return;
      }

      try {
        const favoritePostID = await store.lovePost(param);
        model.value.favorite_post_id = favoritePostID;
        if (favoritePostID) {
          showMessage("Đã yêu thích bài viết");
        } else {
          showMessage("Đã hủy yêu thích bài viết");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  onMounted(async () => {
    const me = proxy;
    const id = me.$route.params.id;
    if (id) {
      try {
        const rs = await store.getById(id);
        if (rs) {
          model.value = rs;
          if (isJson(rs.room_characteristic)) {
            model.value.room_characteristic = JSON.parse(
              rs.room_characteristic
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    window._detail = proxy;
  });

  return {
    model,
    moment,
    filters,
    lovePost,
    contextStore,
  };
};
