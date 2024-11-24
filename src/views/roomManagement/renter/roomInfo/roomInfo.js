import { getCurrentInstance, reactive, ref } from "vue";

export const useRoomInfo = () => {
  const { proxy } = getCurrentInstance();
  const onboarding = ref(1);
  const next = () => {
    proxy.onboarding =
      proxy.onboarding + 1 > proxy.length ? 1 : proxy.onboarding + 1;
  };
  const prev = () => {
    proxy.onboarding =
      proxy.onboarding - 1 <= 0 ? proxy.length : proxy.onboarding - 1;
  };

  const roomInfoView = ref([
    {
      title: "Địa chỉ",
      value: "75 Đ. Nguyễn Xiển, Hạ Đình, Thanh Xuân, Hà Nội, Việt Nam",
    },
    {
      title: "Giá thuê",
      value: "4000000",
    },
    {
      title: "Diện tích",
      value: "30",
    },
    {
      title: "Tiện ích",
      value: "Điều hòa, Máy giặt, Tủ lạnh",
    },
    {
      title: "Số phòng ngủ",
      value: 1,
    },
    {
      title: "Trải nghiệm",
      value: "",
      componentType: "textarea",
    },
  ]);

  const serviceInfoView = ref([
    {
      title: "Tiền điện",
      value: "4000/số",
    },
    {
      title: "Tiền nước",
      value: "100000/người",
    },
  ]);

  const buttonTypes = {
    edit: "Sửa",
    addAndEdit: "Thêm/Sửa",
  };

  const dataConfig = reactive({
    roomInfo: {
      buttonType: buttonTypes.edit,
      isView: true,
    },
    serviceInfo: {
      buttonType: buttonTypes.addAndEdit,
      isView: true,
    },
  });

  const handleEdit = (btnType) => {
    if (btnType === buttonTypes.edit) {
      dataConfig.roomInfo.isView = !dataConfig.roomInfo.isView;
      if (dataConfig.roomInfo.isView) {
        dataConfig.roomInfo.buttonType = buttonTypes.edit;
      } else {
        dataConfig.roomInfo.buttonType = 'Hủy';
      }
    } else if (btnType === buttonTypes.addAndEdit) {
      dataConfig.serviceInfo.isView = !dataConfig.serviceInfo.isView;
      if (dataConfig.serviceInfo.isView) {
        dataConfig.serviceInfo.buttonType = buttonTypes.addAndEdit;
      } else {
        dataConfig.serviceInfo.buttonType = 'Hủy';
      }
    }
  };

  return {
    length: 3,
    onboarding,
    next,
    prev,
    roomInfoView,
    serviceInfoView,
    buttonTypes,
    dataConfig,
    handleEdit
  };
};
