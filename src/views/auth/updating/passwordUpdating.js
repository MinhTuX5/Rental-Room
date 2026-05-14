import { reactive, ref } from "vue";
import i18nApp from "@/constant/resource/i18nApp";
import profileAPI from "@/apis/profileAPI";
import { useContextStore } from "@/stores/contextStore";
import { useContextManageStore } from "@/stores/contextManageStore";
import { showMessage, MessageType } from "@/common/commonFunction";

export const usePasswordUpdating = () => {
  const minWidth = 232;
  const loading = ref(false);

  const model = reactive({
    currentPassword: { value: "", errorMessage: "" },
    newPassword: { value: "", errorMessage: "" },
    newPasswordConfirmation: { value: "", errorMessage: "" },
  });

  const showPassword = reactive({
    currentPassword: false,
    newPassword: false,
    newPasswordConfirmation: false,
  });

  const minLength = 8;
  const rules = {
    required: (value) => !!value || i18nApp.rules.required,
    min: (v) => v.length >= minLength || i18nApp.rules.min.format(minLength),
  };

  const getUserId = () => {
    const contextStore = useContextStore();
    if (contextStore.user?.user_id) return contextStore.user.user_id;

    const manageStore = useContextManageStore();
    if (manageStore.user?.user_id) return manageStore.user.user_id;

    return null;
  };

  const clearErrors = () => {
    model.currentPassword.errorMessage = "";
    model.newPassword.errorMessage = "";
    model.newPasswordConfirmation.errorMessage = "";
  };

  const validate = () => {
    clearErrors();
    let valid = true;

    if (!model.currentPassword.value) {
      model.currentPassword.errorMessage = i18nApp.rules.required;
      valid = false;
    }

    if (!model.newPassword.value) {
      model.newPassword.errorMessage = i18nApp.rules.required;
      valid = false;
    } else if (model.newPassword.value.length < minLength) {
      model.newPassword.errorMessage = i18nApp.rules.min.format(minLength);
      valid = false;
    }

    if (!model.newPasswordConfirmation.value) {
      model.newPasswordConfirmation.errorMessage = i18nApp.rules.required;
      valid = false;
    } else if (model.newPasswordConfirmation.value !== model.newPassword.value) {
      model.newPasswordConfirmation.errorMessage = "Mật khẩu xác nhận không khớp";
      valid = false;
    }

    return valid;
  };

  const submit = async () => {
    if (!validate()) return;

    const userId = getUserId();
    if (!userId) {
      showMessage("Không xác định được người dùng!", MessageType.Error);
      return;
    }

    try {
      loading.value = true;
      await profileAPI.changePassword(userId, {
        current_password: model.currentPassword.value,
        new_password: model.newPassword.value,
      });
      showMessage("Đổi mật khẩu thành công!");
      model.currentPassword.value = "";
      model.newPassword.value = "";
      model.newPasswordConfirmation.value = "";
    } catch (error) {
      const msg = error?.response?.data?.UserMsg || "Đổi mật khẩu thất bại!";
      showMessage(msg, MessageType.Error);
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const form = ref(false);

  return { model, submit, showPassword, rules, minWidth, form, loading };
};
