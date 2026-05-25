import { getCurrentInstance, onMounted, reactive, ref } from "vue";
import { useContextManageStore } from "@/stores/contextManageStore";
import { showMessage } from "@/common/commonFunction";

export const useRoomInfo = () => {
  const { proxy } = getCurrentInstance();
  const contextStore = useContextManageStore();
  const onboarding = ref(1);

  const storageKey = `renter-room-note-${contextStore.$state.user.user_id}`;

  const next = () => {
    proxy.onboarding =
      proxy.onboarding + 1 > proxy.length ? 1 : proxy.onboarding + 1;
  };
  const prev = () => {
    proxy.onboarding =
      proxy.onboarding - 1 <= 0 ? proxy.length : proxy.onboarding - 1;
  };

  const defaultRoomInfo = [
    {
      title: "Địa chỉ",
      value: "",
    },
    {
      title: "Giá thuê",
      value: "",
    },
    {
      title: "Diện tích",
      value: "",
    },
    {
      title: "Tiện ích",
      value: "",
    },
    {
      title: "Số phòng ngủ",
      value: "",
    },
    {
      title: "Ghi chú phòng",
      value: "",
      componentType: "textarea",
    },
  ];

  const defaultServiceInfo = [
    {
      title: "Tiền điện",
      value: "",
    },
    {
      title: "Tiền nước",
      value: "",
    },
    {
      title: "Internet",
      value: "",
    },
    {
      title: "Gửi xe",
      value: "",
    },
    {
      title: "Ghi chú dịch vụ",
      value: "",
      componentType: "textarea",
    },
  ];

  const cloneItems = (items) => items.map((item) => ({ ...item }));

  const roomInfoView = ref(cloneItems(defaultRoomInfo));
  const serviceInfoView = ref(cloneItems(defaultServiceInfo));

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

  const loadLocalNote = () => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return;
    }

    try {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved.roomInfo)) {
        roomInfoView.value = saved.roomInfo;
      }
      if (Array.isArray(saved.serviceInfo)) {
        serviceInfoView.value = saved.serviceInfo;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveLocalNote = () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        roomInfo: roomInfoView.value,
        serviceInfo: serviceInfoView.value,
      })
    );
    showMessage("Đã lưu thông tin ghi chú phòng!");
  };

  const handleEdit = (btnType) => {
    if (btnType === buttonTypes.edit) {
      dataConfig.roomInfo.isView = !dataConfig.roomInfo.isView;
      if (dataConfig.roomInfo.isView) {
        saveLocalNote();
        dataConfig.roomInfo.buttonType = buttonTypes.edit;
      } else {
        dataConfig.roomInfo.buttonType = "Lưu";
      }
    } else if (btnType === buttonTypes.addAndEdit) {
      dataConfig.serviceInfo.isView = !dataConfig.serviceInfo.isView;
      if (dataConfig.serviceInfo.isView) {
        saveLocalNote();
        dataConfig.serviceInfo.buttonType = buttonTypes.addAndEdit;
      } else {
        dataConfig.serviceInfo.buttonType = "Lưu";
      }
    }
  };

  onMounted(() => {
    loadLocalNote();
  });

  return {
    length: 3,
    onboarding,
    next,
    prev,
    roomInfoView,
    serviceInfoView,
    buttonTypes,
    dataConfig,
    handleEdit,
  };
};
