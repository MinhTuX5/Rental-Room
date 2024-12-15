import { onMounted, reactive, ref, getCurrentInstance } from "vue";
// Vue validate
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
// api
import api from "@/apis/userAPI";
// resources
import { showMessage } from "@/common/commonFunction";

export const useLogin = () => {
  const { proxy } = getCurrentInstance();

  const initialState = {
    account: "",
    password: "",
  };

  const state = reactive({
    ...initialState,
  });

  const rules = {
    account: {
      required,
      maxLength: maxLength(11),
      minLength: minLength(10),
    },
    password: { required, minLength: minLength(8) },
  };

  const v$ = useVuelidate(rules, state);

  const isManagementPage = ref(false);

  const login = async () => {
    const me = proxy;

    if (typeof v$.$validate === "function") {
      v$.$validate();
    }

    try {
      const payload = {
        account: state.account,
        password: state.password,
      };
      const rs = await api.login(payload);
      if (rs) {
        const context = {
          accessToken: "123456789",
          userID: "05349621-ae36-11ef-a600-c03eba18f2af",
        };
        localStorage.setItem("context", JSON.stringify(context));

        showMessage(MessageType.Success, "Đăng nhập thành công!");
        // handle login success
        setTimeout(() => {
          me.$router.push({ path: "/" });
        }, 100);
      }
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    const previousTabData = window.previousTabData;
    if (previousTabData && typeof previousTabData === "object") {
      isManagementPage.value = previousTabData.isManagementPage ?? false;
      sessionStorage.setItem("isManagementPage", isManagementPage.value);
    }
  });

  return { state, v$, isManagementPage, login };
};
