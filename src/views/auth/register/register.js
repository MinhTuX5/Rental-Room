import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, email, sameAs } from "@vuelidate/validators";
import userAPI from "@/apis/userAPI";

export const useRegister = () => {
  const router = useRouter();
  const loading = ref(false);
  const errorMessage = ref("");

  const initialState = {
    phoneNumber: "",
    password: "",
    email: "",
    fullName: "",
    passwordConfirmation: "",
  };

  const state = reactive({ ...initialState });

  const rules = {
    email: { email },
    phoneNumber: {
      required,
      maxLength: maxLength(11),
      minLength: minLength(10),
    },
    password: { required, minLength: minLength(8) },
    passwordConfirmation: {
      required,
      minLength: minLength(8),
      sameAs: sameAs(() => state.password),
    },
    fullName: { required },
  };

  const v$ = useVuelidate(rules, state);

  const register = async () => {
    const isValid = await v$.$validate();
    if (!isValid) return;

    loading.value = true;
    errorMessage.value = "";

    try {
      const payload = {
        email: state.email,
        fullName: state.fullName,
        phoneNumber: state.phoneNumber,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      };
      await userAPI.register(payload);
      router.push("/dang-nhap");
    } catch (error) {
      errorMessage.value =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Đăng ký thất bại. Vui lòng thử lại.";
    } finally {
      loading.value = false;
    }
  };

  return { state, v$, loading, errorMessage, register };
};
