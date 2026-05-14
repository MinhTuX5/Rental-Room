import { computed, getCurrentInstance, onMounted, ref } from "vue";
import moment from "moment";
// Resources
import { useRoomSearchCommon } from "../roomSearchCommon";
// store
import { useRoomPostStore } from "@/stores/roomSearch/roomPostStore.js";
// resources
import { isJson } from "@/common/commonFunction";
import PostStatus from "../../../common/enum/PostStatus";
import { sendNotify, showMessage } from "../../../common/commonFunction";
import NotificationType from "../../../common/enum/NotificationType";
import { useContextAdminStore } from "../../../stores/contextAdminStore";

export const usePostDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useRoomPostStore();
  const contextStore = useContextAdminStore();

  const { filters, lovePost } = useRoomSearchCommon();

  const model = ref({});

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

  const imageLinks = computed(() => {
    return proxy.model?.images?.split(",") ?? [];
  });

  const isFromAdmin = ref(false);

  const approve = async () => {
    const me = proxy;
    try {
      const roomPostId = me.$route.params.id;
      const payload = {
        RoomPostId: roomPostId,
        PostStatus: PostStatus.Posted,
      };
      await store.updatePostStatus(payload);
      showMessage("Phê duyệt bài đăng thành công!");

      const notification = {
        from_user_id: contextStore.$state.user.user_id,
        to_user_id: me.model.user_id,
        notification_type: NotificationType.info,
        notification_message: `Bài đăng <b>#${me.model.post_code}</b> của bạn đã được phê duyệt`,
        notification_title: "Phê duyệt bài đăng",
        is_related: true,
        user_avatar: contextStore.$state.user.user_avatar,
      };
      sendNotify(notification);

      me.$router.push({ name: "PostApproval" });
    } catch (error) {
      console.log(error);
    }
  };

  const showDialog = ref(false);
  const rejectMessage = ref("");
  const reject = () => {
    showDialog.value = true;
  };

  const onSubmitDialog = async () => {
    const me = proxy;
    try {
      const roomPostId = me.$route.params.id;
      const payload = {
        RoomPostId: roomPostId,
        PostStatus: PostStatus.Posted,
        RejectMessage: rejectMessage.value,
      };
      await store.updatePostStatus(payload);

      const notification = {
        from_user_id: contextStore.$state.user.user_id,
        to_user_id: me.model.user_id,
        notification_type: NotificationType.info,
        notification_message: `Bài đăng <b>#${me.model.post_code}</b> của bạn đã bị từ chối với lý do: ${rejectMessage.value}`,
        notification_title: "Từ chối bài đăng",
        is_related: true,
        user_avatar: contextStore.$state.user.user_avatar,
      };
      sendNotify(notification);

      showMessage("Từ chối bài đăng thành công!");
      me.$router.push({ name: "PostApproval" });
    } catch (error) {
      console.log(error);
    } finally {
      showDialog.value = false;
    }
  };

  onMounted(async () => {
    const me = proxy;

    if (me.$route.matched.some((x) => x.meta.isAdmin)) {
      isFromAdmin.value = true;
    }

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
    contextStore,
    likePost,
    isFromAdmin,
    imageLinks,
    approve,
    showDialog,
    rejectMessage,
    reject,
    onSubmitDialog,
  };
};
