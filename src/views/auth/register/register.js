import { reactive } from "vue";
// Vue validate
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, email } from "@vuelidate/validators";

export const useRegister = () => {
  const initialState = {
    phoneNumber: "",
    password: "",
    email: "",
    fullName: "",
    passwordConfirmation: "",
  };

  const state = reactive({
    ...initialState,
  });

  const rules = {
    email: {
      email,
    },
    phoneNumber: {
      required,
      maxLength: maxLength(11),
      minLength: minLength(10),
    },
    password: { required, minLength: minLength(8) },
    passwordConfirmation: { required, minLength: minLength(8) },
    fullName: { required },
  };

  const v$ = useVuelidate(rules, state);

  return { state, v$ };
};
