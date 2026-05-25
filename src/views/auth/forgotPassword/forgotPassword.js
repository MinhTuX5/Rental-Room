import { computed, ref } from "vue";
// Vue validate
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
// Resource
import { MessageType, showMessage } from "@/common/commonFunction";

export const useForgotPassword = () => {
  const title = computed(() => "Quên mật khẩu");
  const loading = ref(false);
  const generatedOtp = ref("");
  const selectedUser = ref(null);

  const model = ref({
    account: "",
    otp: "",
  });

  const rules = {
    account: {
      required,
    },
    otp: {
      required,
      minLength: minLength(4),
    },
  };

  const v$ = useVuelidate(rules, model);

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const getPlainPassword = (user) => {
    const password =
      user?.password ?? user?.user_password ?? user?.Password ?? user?.UserPassword;

    if (/^\d+$/.test(String(password ?? ""))) {
      return password;
    }

    return "12345678";
  };

  const isValidAccount = () => {
    return /^\d{10,11}$/.test(String(model.value.account ?? "").trim());
  };

  const requestOtp = async () => {
    v$.value.account.$touch();
    if (v$.value.account.$invalid) {
      return;
    }

    loading.value = true;

    try {
      if (!isValidAccount()) {
        selectedUser.value = null;
        generatedOtp.value = "";
        showMessage("Tài khoản không hợp lệ!", MessageType.Warning);
        return;
      }

      selectedUser.value = {
        account: model.value.account,
        password: "12345678",
      };
      generatedOtp.value = generateOtp();
      model.value.otp = "";
      v$.value.otp.$reset();
      showMessage(`Mã OTP của bạn là: ${generatedOtp.value}`);
    } catch (error) {
      console.error(error);
      showMessage("Không kiểm tra được tài khoản!", MessageType.Error);
    } finally {
      loading.value = false;
    }
  };

  const verifyOtp = () => {
    v$.value.otp.$touch();
    if (v$.value.otp.$invalid) {
      return;
    }

    if (!selectedUser.value || !generatedOtp.value) {
      showMessage("Vui lòng lấy mã OTP trước!", MessageType.Warning);
      return;
    }

    if (model.value.otp !== generatedOtp.value) {
      showMessage("Mã OTP không đúng!", MessageType.Warning);
      return;
    }

    showMessage(`Mật khẩu của bạn là: ${getPlainPassword(selectedUser.value)}`);
  };

  const submit = async () => {
    if (!generatedOtp.value) {
      await requestOtp();
      return;
    }

    verifyOtp();
  };

  const close = () => {
    model.value = {
      account: "",
      otp: "",
    };
    selectedUser.value = null;
    generatedOtp.value = "";
    v$.value.$reset();
  };

  return {
    model,
    v$,
    submit,
    loading,
    title,
    close,
    generatedOtp,
    requestOtp,
    verifyOtp,
  };
};
