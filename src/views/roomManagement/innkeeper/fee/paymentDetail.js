import { getCurrentInstance, onMounted, ref, computed } from "vue";
// store
import { useFeeStore } from "../../../../stores/roomManagement/feeStore";
import {
  formatDate,
  getDateItem,
  getNumberItem,
} from "../../../../common/commonFunction";

export const usePaymentDetail = () => {
  const { proxy } = getCurrentInstance(); // lấy instance component để truy cập model và params

  const store = useFeeStore(); // khởi tạo store quản lý phí

  const detailForm = "PaymentDetail"; // tên popup/detail form
  const title = ref("Thanh toán"); // tiêu đề popup

  const headers = [
    { key: "displayed_payment_date", title: "Ngày thanh toán", align: "start" },
    { key: "payment_amount", title: "Số tiền", align: "end" },
  ];

  const displayedDate = computed(() => {
    // hiển thị ngày đã được format trong input readonly
    return formatDate(proxy.model.end_date);
  });

  const customBeforeSubmit = () => {
    const me = proxy;
    // gán fee_id cho model trước khi gọi submit
    me.model.fee_id = me._formParam.model.fee_id;
  };

  onMounted(async () => {
    const me = proxy;

    // khởi tạo dữ liệu ban đầu cho popup từ params truyền vào
    me.model.room_code = me._formParam.model.room_code;
    me.model.payment_amount = me._formParam.model.payment_amount;

    const payload = {
      RoomID: me._formParam.model.room_id,
      FeeID: me._formParam.model.fee_id,
    };
    try {
      // gọi API lấy thông tin thanh toán và lịch sử giao dịch
      const info = await store.getPaymentInfo(payload);
      if (info) {
        me.model.resident_code = info.resident_code;
        me.model.resident_name = info.resident_name;
        me.model.oldPayments = info.payments;

        // chuẩn hóa số và ngày cho các bản ghi thanh toán cũ
        me.model.oldPayments.forEach((x) => {
          x = getNumberItem(x, ["payment_amount"]);
          x = getDateItem(x, ["payment_date"]);
        });
      }
    } catch (error) {
      console.error(error); // log lỗi nếu load dữ liệu thất bại
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
