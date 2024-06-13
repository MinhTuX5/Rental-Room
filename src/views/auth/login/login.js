import { reactive } from "vue";
// Vue validate
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export const useLogin = () => {
  const initialState = {
    phoneNumber: "",
    password: "",
  };

  const state = reactive({
    ...initialState,
  });

  const rules = {
    phoneNumber: {
      required,
      maxLength: maxLength(11),
      minLength: minLength(10),
    },
    password: { required, minLength: minLength(8) },
  };

  const v$ = useVuelidate(rules, state);

  return { state, v$ };
};
