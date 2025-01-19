import { getCurrentInstance, onMounted, ref, computed } from "vue";
import { useAppointmentScheduleStore } from "../../../stores/roomSearch/appointmentScheduleStore";
import moment from "moment";
import i18nApp from "@/constant/resource/i18nApp";
import { useContextStore } from "../../../stores/contextStore";
import { MessageType, showMessage } from "../../../common/commonFunction";

export const useAppointmentScheduleDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useAppointmentScheduleStore();
  const contextStore = useContextStore();

  const viewing = ref(false);
  const title = ref("Lịch hẹn");

  const allowedStep = (m) => m % 10 === 0;
  const time = ref();
  const modal2 = ref(false);

  const selectedDate = computed(() =>
    moment(proxy.model.appointment_date).format("DD/MM/YYYY")
  );

  const rules = {
    required: (v) => !!v || i18nApp.rules.required,
  };

  const customBeforeSubmit = () => {
    proxy.model.user_id = contextStore.$state.user.user_id;
    proxy.model.appointment_title = proxy.model.to_user_name;
  };

  const customAfterBeforeOpen = () => {
    const me = proxy;
    if (me._formParam.appointment_date) {
      me.model.appointment_date = me._formParam.appointment_date;
    }

    if (me.editMode === 1) {
      modal2.value = true;
    } else {
      viewing.value = true;
    }
  };

  const dialogConfig = ref({
    showDialog: false,
    icon: "mdi-delete",
    title: "Bạn có chắc chắn muốn xóa lịch hẹn này?",
    text: "",
    width: 500,
  });

  const deleteItem = async () => {
    const me = proxy;
    try {
      me.loading = true;
      const idField = me.model[store.$state.idField];
      await store.deleteAsync(idField);
      showMessage("Xóa thành công!");
      if (typeof me._formParam.options?.afterDelete === "function") {
        me._formParam.options.afterDelete(idField);
      }
    } catch (error) {
      console.error(error);
      showMessage("Có lỗi xảy ra!", MessageType.Error);
    } finally {
      me.loading = false;
      me.hide();
    }
  };

  onMounted(async () => {});

  return {
    title,
    store,
    allowedStep,
    time,
    modal2,
    selectedDate,
    rules,
    customBeforeSubmit,
    customAfterBeforeOpen,
    viewing,
    dialogConfig,
    deleteItem,
  };
};
