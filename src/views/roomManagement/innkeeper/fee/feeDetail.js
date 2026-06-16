import { ref, reactive, onMounted, getCurrentInstance, computed } from "vue";

import { useFeeStore } from "../../../../stores/roomManagement/feeStore";
import { useServiceFeeStore } from "../../../../stores/roomManagement/dictionary/serviceFeeStore";

import {
  standardItem,
  formatNumberWithCommas,
  formatDate,
  convertCurrencyFormat,
} from "../../../../common/commonFunction";

export const useFeeDetail = () => {
  const { proxy } = getCurrentInstance(); // lấy instance component

  const store = useFeeStore(); // store quản lý fee
  const serviceFeeStore = useServiceFeeStore(); // store dictionary phí dịch vụ

  const title = ref("Thông tin thu phí"); // tiêu đề popup

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

  const vehicleFeeTotal = ref(0); // tổng phí xe
  const editServiceFees = ref([]); // danh sách dịch vụ cần nhập chỉ số

  const viewServiceFees = ref([]); // danh sách dịch vụ hiển thị tĩnh
  const viewServiceTotal = ref(0); // tổng phí dịch vụ hiển thị

  const parseNumber = (value) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === "string") {
      const normalized = value.replace(/\./g, "").replace(/,/g, ".");
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  };

  const serviceFeeTotal = computed(() => {
    // tính tổng phí dịch vụ theo chỉ số nhập
    const editServiceTotal = editServiceFees.value.reduce((total, service) => {
      const oldIndex = parseNumber(service.old_index);
      const newIndex = parseNumber(service.new_index);
      const usage = newIndex - oldIndex;
      return total + (usage <= 0 ? 0 : usage * parseNumber(service.fee_price));
    }, 0);

    return viewServiceTotal.value + editServiceTotal;
  });

  const toDate = computed(() => {
    return formatDate(proxy.model.expired_date); // format ngày kết thúc
  });

  const fromDate = computed(() => {
    return formatDate(proxy.model.from_date); // format ngày bắt đầu
  });

  const totalFee = computed(() => {
    // tổng tiền = tiền phòng + phí dịch vụ + phí xe
    return (
      parseNumber(proxy.model.room_price) +
      serviceFeeTotal.value +
      vehicleFeeTotal.value
    );
  });

  const getUsage = (service) => {
    const usage = parseNumber(service.new_index) - parseNumber(service.old_index);
    return usage > 0 ? usage : 0;
  };

  const getServiceStorageKey = () => {
    return `fee-service-indices-${proxy.model.fee_id}`; // key lưu chỉ số dịch vụ
  };

  const getElectricWaterStorageKey = () => {
    return `fee-electric-water-${proxy.model.fee_id}`; // key lưu điện nước
  };

  const buildElectricWaterDisplay = () => {
    const electric = editServiceFees.value.find(
      (service) => service.price_unit === 4
    );
    const water = editServiceFees.value.find(
      (service) => service.price_unit === 5
    );

    const electricUsage = electric ? getUsage(electric) : 0;
    const waterUsage = water ? getUsage(water) : 0;
    return `${electricUsage}kw & ${waterUsage}m3`; // chuỗi hiển thị điện & nước
  };

  const customBeforeSubmit = () => {
    // chuẩn bị dữ liệu trước khi submit
    proxy.model.total_fee = totalFee.value;
    proxy.model.electric_water = buildElectricWaterDisplay();
    proxy.model.service_fees = editServiceFees.value.map((service) => ({
      service_fee_id: service.service_fee_id,
      service_type: service.service_type,
      price_unit: service.price_unit,
      fee_price: parseNumber(service.fee_price),
      old_index: parseNumber(service.old_index),
      new_index: parseNumber(service.new_index),
    }));

    localStorage.setItem(getElectricWaterStorageKey(), proxy.model.electric_water);
    localStorage.setItem(
      getServiceStorageKey(),
      JSON.stringify(proxy.model.service_fees)
    );
  };

  const getBuildingServiceFees = async () => {
    const result = await serviceFeeStore.getPaging({
      skip: 0,
      take: 100000,
      filters: serviceFeeStore.defaultFilters,
      sorts: serviceFeeStore.defaultSorts,
    });

    return result?.data ?? [];
  };

  const getFixedServiceTotal = (service, model) => {
    const feePrice = parseNumber(service.fee_price);

    switch (service.price_unit) {
      case 1:
        service.member_count = model.member_count;
        return parseNumber(model.member_count) * feePrice;
      case 2:
        return feePrice;
      case 3:
        service.room_area = model.room_area;
        return parseNumber(model.room_area) * feePrice;
      default:
        return 0;
    }
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
            vehicleFeeTotal.value += parseNumber(vehicle.fee_price);
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

    getBuildingServiceFees()
      .then((res) => {
        if (Array.isArray(res)) {
          const storedServiceFees = JSON.parse(
            localStorage.getItem(getServiceStorageKey()) ?? "[]"
          );
          const storedServiceById = storedServiceFees.reduce(
            (result, service) => {
              if (service?.service_fee_id) {
                result[service.service_fee_id] = service;
              }
              return result;
            },
            {}
          );

          editServiceFees.value = res
            .filter((x) => x.price_unit > 3)
            .map((x) => {
              const storedService = storedServiceById[x.service_fee_id] ?? {};
              return {
                ...x,
                old_index: storedService.old_index ?? x.old_index ?? 0,
                new_index: storedService.new_index ?? x.new_index ?? 0,
              };
            });
          viewServiceTotal.value = 0;
          viewServiceFees.value = res
            .filter((x) => x.price_unit <= 3)
            .map((x) => {
              x.total_fee = getFixedServiceTotal(x, me.model);
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
