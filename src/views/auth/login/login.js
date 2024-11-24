import { onMounted, reactive, ref } from "vue";
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

  const isManagementPage = ref(false);

  onMounted(() => {
    const previousTabData = window.previousTabData;
    if (previousTabData && typeof previousTabData === "object") {
      isManagementPage.value = previousTabData.isManagementPage ?? false;
      sessionStorage.setItem('isManagementPage', isManagementPage.value);
    }
  });

  return { state, v$, isManagementPage };
};
