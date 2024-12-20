import { reactive, watch } from "vue";
import i18nApp from "@/constant/resource/i18nApp";

export const usePasswordUpdating = () => {
  const minWidth = 232;

  const model = reactive({
    currentPassword: {
      value: "",
    },
    newPassword: { value: "" },
    newPasswordConfirmation: { value: "" },
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

  const submit = () => {
    console.log("Form submitted:", model);
  };

  return { model, submit, showPassword, rules, minWidth };
};
