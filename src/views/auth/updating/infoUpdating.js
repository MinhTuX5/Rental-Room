import { reactive } from "vue";

export const useInfoUpdating = () => {
  const model = reactive({
    name: {
      value: "nvthinh",
    },
    email: { value: "nvthinh@gmail.com" },
    phone: { value: "0987654321" },
    address: "123/45 Lý Thái Tổ, P.12, Q.1, TP. HCM",
    jobTitle: "Nhân viên kinh doanh",
    department: "Marketing",
  });

  const submit = () => {
    console.log("Form submitted:", model);
  }

  const handleReset = () => {
    Object.values(model).forEach((field) => {
      field.value = '';
    });
  }
  return { model, submit, handleReset };
};
