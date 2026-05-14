import { reactive, ref, onMounted } from "vue";
import { useContextStore } from "@/stores/contextStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import profileAPI from "@/apis/profileAPI";
import { showMessage, MessageType } from "@/common/commonFunction";

export const useInfoUpdating = () => {
  const model = reactive({
    user_name: "",
    user_email: "",
    phone_number: "",
    second_phone_number: "",
    user_facebook: "",
    user_zalo: "",
  });

  const loading = ref(false);
  const tab = ref(1);

  const getUserId = () => {
    const contextStore = useContextStore();
    if (contextStore.user?.user_id) return contextStore.user.user_id;

    const manageStore = useContextManageStore();
    if (manageStore.user?.user_id) return manageStore.user.user_id;

    return null;
  };

  const loadProfile = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      loading.value = true;
      const res = await profileAPI.getProfile(userId);
      if (res?.data) {
        Object.assign(model, {
          user_name: res.data.user_name ?? "",
          user_email: res.data.user_email ?? "",
          phone_number: res.data.phone_number ?? "",
          second_phone_number: res.data.second_phone_number ?? "",
          user_facebook: res.data.user_facebook ?? "",
          user_zalo: res.data.user_zalo ?? "",
        });
      }
    } catch (error) {
      showMessage("Không thể tải thông tin người dùng!", MessageType.Error);
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const submit = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      loading.value = true;
      await profileAPI.updateProfile(userId, model);
      showMessage("Cập nhật thông tin thành công!");
    } catch (error) {
      showMessage("Cập nhật thất bại!", MessageType.Error);
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const handleReset = () => {
    loadProfile();
  };

  onMounted(() => {
    loadProfile();
  });

  return { model, loading, submit, handleReset, tab };
};
