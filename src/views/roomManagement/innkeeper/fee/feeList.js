import { getCurrentInstance } from "vue";
import { useFeeStore } from "../../../../stores/roomManagement/feeStore";
import popupUtil from "../../../../common/popupUtil";
import _enum from "../../../../common/enum";
import { convertCurrencyFormat } from "../../../../common/commonFunction";
import { useContextManageStore } from "@/stores/contextManageStore";

export const useHouseholdList = () => {
  const { proxy } = getCurrentInstance();

  const detailForm = "FeeDetail";

  const store = useFeeStore();

  const headers = [
    { key: "contract_code", title: "Mã hợp đồng", align: "start" },
    { key: "room_code", title: "Mã phòng", align: "start" },
    { key: "total_fee", title: "Tổng tiền", align: "end" },
    { key: "received_fee", title: "Đã nhận", align: "end" },
    { key: "displayed_expired_date", title: "Hạn chót", align: "start" },
    { key: "displayed_fee_status", title: "Trạng thái", align: "center" },
    {
      title: "Chức năng",
      key: "actions",
      sortable: false,
      align: "center",
      width: 160,
    },
  ];

  const genFees = async () => {
    const me = proxy;
    try {
      me.loading = true;
      await store.genFees(useContextManageStore().$state.user.building_id);
      await me.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      me.loading = false;
    }
  };

  const pay = (item) => {
    const me = proxy;
    popupUtil.show("PaymentDetail", {
      editMode: _enum.Mode.Add,
      model: {
        room_code: item.room_code,
        room_id: item.room_id,
        fee_id: item.fee_id,
        payment_amount:
          convertCurrencyFormat(item.total_fee) -
          convertCurrencyFormat(item.received_fee),
      },
      options: {
        afterSubmit: me.refresh,
      },
    });
  };

  return { headers, detailForm, store, genFees, pay };
};
