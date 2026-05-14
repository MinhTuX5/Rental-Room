import { ref, reactive, onMounted, getCurrentInstance, computed } from "vue";
import moment from "moment";

import { useFeeStore } from "../../../../stores/roomManagement/feeStore";
import { useServiceFeeStore } from "../../../../stores/roomManagement/dictionary/serviceFeeStore";

import {
  standardItem,
  formatNumberWithCommas,
  formatDate,
} from "../../../../common/commonFunction";

import _enum from "../../../../common/enum";

export const useFeeDetail = () => {
  const { proxy } = getCurrentInstance();

  const store = useFeeStore();
  const serviceFeeStore = useServiceFeeStore();

  const title = ref("Thông tin thu phí");

  const serviceHeaders = reactive([
    {
      key: "service_type",
      title: "Loại dịch vụ",
      sort: "asc",
    },
    {
      key: "fee_price",
      title: "Mức giá dịch vụ",
      align: "end",
    },
    {
      key: "displayed_price_unit",
      title: "Đơn vị tính",
    },
    {
      key: "member_count",
      title: "Số thành viên",
      align: "end",
    },
    {
      key: "room_area",
      title: "Diện tích phòng",
      align: "end",
    },
    {
      key: "total_fee",
      title: "Tổng số tiền",
      align: "end",
    },
  ]);

  const vehicleHeaders = [
    { key: "resident_code", title: "Mã chủ xe", align: "start" },
    { key: "resident_name", title: "Chủ xe", align: "start" },
    { key: "vehicle_type", title: "Loại phương tiện", align: "start" },
    { key: "vehicle_brand", title: "Mẫu xe", align: "start" },
    { key: "license_plate", title: "Biển số xe", align: "start" },
    { key: "fee_price", title: "Phí gửi xe", align: "end" },
  ];

  const vehicleFeeTotal = ref(0);
  const editServiceFees = ref([]);

  const viewServiceFees = ref([]);
  const viewServiceTotal = ref(0);

  const serviceFeeTotal = computed(() => {
    const editServiceTotal = editServiceFees.value.reduce(
      (total, service) =>
        total +
        ((service.new_index ?? 0) - (service.old_index ?? 0) <= 0
          ? 0
          : (service.new_index - service.old_index) * service.fee_price),
      0
    );

    return viewServiceTotal.value + editServiceTotal;
  });

  const toDate = computed(() => {
    return formatDate(proxy.model.expired_date);
  });

  const fromDate = computed(() => {
    return formatDate(proxy.model.from_date);
  });

  const totalFee = computed(() => {
    return (
      proxy.model.room_price + serviceFeeTotal.value + vehicleFeeTotal.value
    );
  });

  const customBeforeSubmit = () => {
    proxy.total_fee = totalFee.value;
  };

  onMounted(async () => {
    const me = proxy;

    const feeID = me._formParam?.model?.fee_id;
    if (feeID) {
      try {
        const detailInfo = await store.getById(feeID);
        me.model = { ...me.model, ...detailInfo };
        if (Array.isArray(me.model.vehicles)) {
          me.model.vehicles.forEach((vehicle) => {
            vehicleFeeTotal.value += vehicle.fee_price;
            vehicle = standardItem(vehicle, {
              ...serviceFeeStore.$state,
              numberFields: ["fee_price"],
            });
          });
        } else {
          me.model.vehicles = [];
        }
      } catch (error) {
        console.error(error);
      }
    }

    serviceFeeStore
      .getAllItems()
      .then((res) => {
        if (Array.isArray(res)) {
          editServiceFees.value = res
            .filter((x) => x.price_unit > 3)
            .map((x) => {
              return {
                ...x,
                old_index: x.old_index ?? 0,
                new_index: x.new_index ?? 0,
              };
            });
          viewServiceFees.value = res
            .filter((x) => x.price_unit <= 3)
            .map((x) => {
              switch (x.price_unit) {
                case _enum.ServicePriceUnit["đồng/người"]:
                  x.member_count = me.model.member_count;
                  x.total_fee = me.model.member_count * x.fee_price;
                  break;
                case _enum.ServicePriceUnit["đồng/phòng"]:
                  x.total_fee = x.fee_price;
                  break;
                case _enum.ServicePriceUnit["đồng/m²"]:
                  x.room_area = me.model.room_area;
                  x.total_fee = me.model.room_area * x.fee_price;
                  break;
              }

              viewServiceTotal.value += x.total_fee ?? 0;

              x = standardItem(x, {
                ...serviceFeeStore.$state,
                numberFields: [
                  "total_fee",
                  "fee_price",
                  "member_count",
                  "room_area",
                ],
              });
              return x;
            });
        }
      })
      .catch((ex) => {
        console.error(ex);
      });
  });

  return {
    store,
    title,
    serviceHeaders,
    editServiceFees,
    viewServiceFees,
    serviceFeeStore,
    formatNumberWithCommas,
    serviceFeeTotal,
    vehicleHeaders,
    toDate,
    fromDate,
    vehicleFeeTotal,
    totalFee,
    customBeforeSubmit,
  };
};
