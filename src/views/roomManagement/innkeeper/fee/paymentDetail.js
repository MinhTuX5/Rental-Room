import { getCurrentInstance, onMounted, ref, computed } from "vue";
// store
import { useFeeStore } from "../../../../stores/roomManagement/feeStore";
import {
  formatDate,
  getDateItem,
  getNumberItem,
} from "../../../../common/commonFunction";

export const usePaymentDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useFeeStore();

  const detailForm = "PaymentDetail";
  const title = ref("Thanh toán");

  const headers = [
    { key: "displayed_payment_date", title: "Ngày thanh toán", align: "start" },
    { key: "payment_amount", title: "Số tiền", align: "end" },
  ];

  const displayedDate = computed(() => {
    return formatDate(proxy.model.end_date);
  });

  const customBeforeSubmit = () => {
    const me = proxy;
    me.model.fee_id = me._formParam.model.fee_id;
  };

  onMounted(async () => {
    const me = proxy;

    me.model.room_code = me._formParam.model.room_code;
    me.model.payment_amount = me._formParam.model.payment_amount;

    const payload = {
      RoomID: me._formParam.model.room_id,
      FeeID: me._formParam.model.fee_id,
    };
    try {
      const info = await store.getPaymentInfo(payload);
      if (info) {
        me.model.resident_code = info.resident_code;
        me.model.resident_name = info.resident_name;
        me.model.oldPayments = info.payments;

        me.model.oldPayments.forEach((x) => {
          x = getNumberItem(x, ["payment_amount"]);
          x = getDateItem(x, ["payment_date"]);
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  return {
    title,
    store,
    displayedDate,
    customBeforeSubmit,
    detailForm,
    headers,
  };
};
