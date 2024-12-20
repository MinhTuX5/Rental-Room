import { getCurrentInstance, onMounted, ref } from "vue";
import moment from "moment";
// Resources
import { useRoomSearchCommon } from "../roomSearchCommon";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
import { useContextStore } from "@/stores/contextStore";
// resources
import { isJson } from "@/common/commonFunction";

export const usePostDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();
  const contextStore = useContextStore();

  const { filters, lovePost } = useRoomSearchCommon();

  const model = ref({});

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

  /**
   * @description Yêu thích bài viết
   */
  const likePost = async () => {
    const param = {
      favorite_post_id: model.value.favorite_post_id,
      room_post_id: model.value.room_post_id,
    };

    try {
      model.value.favorite_post_id = await lovePost(param);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    model,
    moment,
    filters,
    contextStore,
    likePost,
  };
};
