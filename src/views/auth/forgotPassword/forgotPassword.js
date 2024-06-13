import { computed, reactive, ref } from "vue";
// Vue validate
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
// Resource
import { delay } from "@/common/commonFunction";

export const useForgotPassword = () => {
  const isExistEmail = ref(false);

  const title = computed(() => {
    if (isExistEmail.value) {
      return "Đổi mật khẩu";
    }
    return "Quên mật khẩu";
  });

  const btnSubmitText = computed(() => {
    if (isExistEmail.value) {
      return "Đổi mật khẩu";
    }
    return "Lấy mật khẩu mới";
  });

  const loading = ref(false);

  const model = ref({
    email: "",
  });

  const rules = {
    email: {
      email,
      required,
    },
    password: {
      required,
      minLength: minLength(8),
    },
    passwordConfirmation: {
      required,
      minLength: minLength(8),
    },
  };

  const v$ = useVuelidate(rules, model, loading);

  /**
   *
   * @param {*} event
   */
  const submit = async (event) => {
    // v$.$validate;

    loading.value = true;

    await delay(1000);

    loading.value = false;
    isExistEmail.value = true;

    if (isExistEmail.value) {
      model.value = {
        password: "",
        passwordConfirmation: "",
      };
    }
  };

  const close = () => {
    isExistEmail.value = false;
    model.value = {
      email: "",
    };
  };

  return {
    model,
    v$,
    submit,
    btnSubmitText,
    loading,
    isExistEmail,
    title,
    close,
  };
};
