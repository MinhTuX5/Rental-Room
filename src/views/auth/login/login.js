import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
// api
import api from "@/apis/userAPI";
// resources
import { showMessage, MessageType } from "@/common/commonFunction";
import Role from "../../../common/enum/Role";

export const useLogin = () => {
  const { proxy } = getCurrentInstance();

  const model = reactive({
    account: "",
    password: "",
    role: Role.Renter,
  });

  const form = ref(false);

  const overlay = ref(false);
  const showPassword = ref(false);

  const login = async () => {
    const me = proxy;

    try {
      const payload = {
        ...me.model,
      };

      overlay.value = true;
      const rs = await api.login(payload);

      if (rs.data && typeof rs.data === "object") {
        const context = {
          ...rs.data,
        };
        localStorage.setItem("context", JSON.stringify(context));

        showMessage("Đăng nhập thành công!");

        me.$router.push({ name: "Management" });
      }
    } catch (error) {
      console.error(error);
      if (error.status === 400) {
        showMessage(
          "Tài khoản, mật khẩu hoặc vai trò không hợp lệ!",
          MessageType.Warning
        );
      } else {
        showMessage("Đã có lỗi xảy ra!", MessageType.Error);
      }
    } finally {
      overlay.value = false;
    }
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider).then((res) => {
      console.log(res.user);
    });
  };

  const signInWithFb = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(getAuth(), provider).then((res) => {
      console.log(res.user);
    });
  };

  const phoneNumberRules = [
    (value) => {
      if (value?.length >= 10) return true;
      return "Số điện thoại phải có ít nhất 10 ký tự";
    },
  ];

  const passwordRules = [
    (value) => {
      if (value?.length >= 8) return true;
      return "Mật khẩu phải có ít nhất 8 ký tự";
    },
  ];

  onMounted(() => {
    const previousTabData = window.previousTabData;
    if (previousTabData && typeof previousTabData === "object") {
      isManagementPage.value = previousTabData.isManagementPage ?? false;
      sessionStorage.setItem("isManagementPage", isManagementPage.value);
    }
  });

  return {
    login,
    signInWithGoogle,
    signInWithFb,
    phoneNumberRules,
    model,
    passwordRules,
    showPassword,
    overlay,
    form,
    Role,
  };
};
