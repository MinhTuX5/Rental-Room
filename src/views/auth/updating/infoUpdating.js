import { reactive, ref } from "vue";

export const useInfoUpdating = () => {
  const model = reactive({
    user_name: 'Nguyễn Văn Đông',
    user_email: 'abc@gmail.com',
    phone_number: '0964895540',
  });

  const submit = () => {
    console.log("Form submitted:", model);
  };

  const handleReset = () => {
    Object.values(model).forEach((field) => {
      field.value = "";
    });
  };

  const tab = ref(1);

  return { model, submit, handleReset, tab };
};
