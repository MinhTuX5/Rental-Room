import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, email } from "@vuelidate/validators";
import userAPI from "@/apis/userAPI";
import Role from "@/common/enum/Role";

export const useRegister = () => {
  const router = useRouter();
  const loading = ref(false);
  const errorMessage = ref("");

  const initialState = {
    phoneNumber: "",
    password: "",
    email: "",
    fullName: "",
    role: Role.RoomSeeker,
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
    fullName: { required },
    role: { required },
  };

  const v$ = useVuelidate(rules, state);

  const register = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;

    loading.value = true;
    errorMessage.value = "";

    try {
      const payload = {
        email: state.email,
        fullName: state.fullName,
        phoneNumber: state.phoneNumber,
        password: state.password,
        role: state.role,
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

  const registerRoles = [
    { label: "Đăng bài và tìm trọ", value: Role.RoomSeeker },
    { label: "Người thuê", value: Role.Renter },
    { label: "Chủ trọ", value: Role.Innkeeper },
  ];

  return { state, v$, loading, errorMessage, register, Role, registerRoles };
};
