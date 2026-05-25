import { getCurrentInstance } from "vue";
import { useFeeStore } from "../../../../stores/roomManagement/feeStore";
import popupUtil from "../../../../common/popupUtil";
import _enum from "../../../../common/enum";
import {
  convertCurrencyFormat,
  showMessage,
  MessageType,
} from "../../../../common/commonFunction";
import { useContextManageStore } from "@/stores/contextManageStore";
import { useContractStore } from "@/stores/roomManagement/dictionary/ContractStore";
import { useRoomStore } from "@/stores/roomManagement/dictionary/roomStore";
import { useRoomCategoryStore } from "@/stores/roomManagement/dictionary/roomCategoryStore";
import { useServiceFeeStore } from "@/stores/roomManagement/dictionary/serviceFeeStore";
import { useVehicleFeeStore } from "@/stores/roomManagement/dictionary/vehicleFeeStore";
import contractAPI from "@/apis/dictionaryAPI/contractAPI";
import residentAPI from "@/apis/dictionaryAPI/residentAPI";
import vehicleAPI from "@/apis/roomManagementAPI/vehicleAPI";
import FeeStatus from "@/common/enum/FeeStatus";
import FilterOperator from "@/common/enum/FilterOperator";

export const useHouseholdList = () => {
  const { proxy } = getCurrentInstance();

  const detailForm = "FeeDetail";

  const store = useFeeStore();
  const contractStore = useContractStore();
  const roomStore = useRoomStore();
  const roomCategoryStore = useRoomCategoryStore();
  const serviceFeeStore = useServiceFeeStore();
  const vehicleFeeStore = useVehicleFeeStore();

  const headers = [
    { key: "contract_code", title: "Mã hợp đồng", align: "start" },
    { key: "room_code", title: "Mã phòng", align: "start" },
    { key: "total_fee", title: "Tổng tiền", align: "end" },
    { key: "electric_water", title: "Điện & Nước", align: "start" },
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

  const getDueDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 25);
  };

  const getStartDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const isCurrentMonthDate = (value) => {
    if (!value) {
      return false;
    }

    const date = new Date(value);
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  };

  const getStoredElectricWater = (feeId) => {
    if (!feeId) {
      return "";
    }

    return localStorage.getItem(`fee-electric-water-${feeId}`) ?? "";
  };

  const attachElectricWater = (fees) => {
    return fees.map((fee) => ({
      ...fee,
      electric_water: fee.electric_water || getStoredElectricWater(fee.fee_id),
    }));
  };

  const getCurrentFees = async () => {
    const feeResult = await store.getPaging({
      skip: 0,
      take: 100000,
      filters: store.defaultFilters,
      sorts: store.defaultSorts,
    });

    return attachElectricWater(feeResult?.data ?? []);
  };

  const getCurrentMonthFees = (fees) => {
    return fees.filter((fee) => isCurrentMonthDate(fee.expired_date));
  };

  const getFeeByContractId = (fees) => {
    return fees.reduce((result, fee) => {
      if (fee?.contract_id) {
        result[fee.contract_id] = fee;
      }
      return result;
    }, {});
  };

  const getRoomCategoryById = (roomCategories, roomCategoryId) => {
    return roomCategories.find(
      (item) => item?.room_category_id === roomCategoryId
    );
  };

  const getRoomPrice = (contract, room, roomCategories) => {
    const roomCategory = getRoomCategoryById(
      roomCategories,
      room?.room_category_id ?? contract?.room_category_id
    );
    const contractPrice = parseNumber(contract?.room_price);
    const categoryPrice = parseNumber(roomCategory?.room_price);
    const roomPrice = parseNumber(room?.room_price);

    return contractPrice || categoryPrice || roomPrice;
  };

  const calculateFixedServiceTotal = (serviceFees, room) => {
    return serviceFees.reduce((total, service) => {
      const feePrice = parseNumber(service.fee_price);
      switch (service.price_unit) {
        case 1:
          return total + Number(room?.member_count ?? 0) * feePrice;
        case 2:
          return total + feePrice;
        case 3:
          return total + Number(room?.room_area ?? 0) * feePrice;
        default:
          return total;
      }
    }, 0);
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

  const getBuildingResidents = async (buildingId) => {
    const result = await residentAPI.getPaging({
      skip: 0,
      take: 100000,
      filters: [
        {
          Field: "building_id",
          Value: buildingId,
          Operator: FilterOperator.Equal,
        },
      ],
    });

    return result?.data ?? [];
  };

  const getBuildingVehicleFees = async () => {
    const result = await vehicleFeeStore.getPaging({
      skip: 0,
      take: 100000,
      filters: vehicleFeeStore.defaultFilters,
      sorts: vehicleFeeStore.defaultSorts,
    });

    return result?.data ?? [];
  };

  const getVehicles = async () => {
    const result = await vehicleAPI.getAsync();
    return result?.data ?? [];
  };

  const calculateVehicleTotalByRoom = (vehicles, residents, vehicleFees) => {
    const roomIdByResidentId = residents.reduce((result, resident) => {
      if (resident?.resident_id && resident?.room_id) {
        result[resident.resident_id] = resident.room_id;
      }
      return result;
    }, {});

    const feeById = vehicleFees.reduce((result, fee) => {
      if (fee?.vehicle_fee_id) {
        result[fee.vehicle_fee_id] = parseNumber(fee.fee_price);
      }
      return result;
    }, {});

    const feeByType = vehicleFees.reduce((result, fee) => {
      if (fee?.vehicle_type) {
        result[fee.vehicle_type.trim().toLowerCase()] = parseNumber(
          fee.fee_price
        );
      }
      return result;
    }, {});

    return vehicles.reduce((result, vehicle) => {
      const roomId = roomIdByResidentId[vehicle?.resident_id];
      if (!roomId) {
        return result;
      }

      const vehicleType = vehicle.vehicle_type?.trim().toLowerCase();
      const feePrice =
        parseNumber(vehicle.fee_price) ||
        feeById[vehicle.vehicle_type_id] ||
        feeByType[vehicleType] ||
        0;

      result[roomId] = (result[roomId] ?? 0) + feePrice;
      return result;
    }, {});
  };

  const genFees = async () => {
    const me = proxy;
    try {
      me.loading = true;
      const buildingId = useContextManageStore().$state.user.building_id;
      const [
        contractResult,
        rooms,
        roomCategories,
        serviceFees,
        residents,
        vehicles,
        vehicleFees,
      ] = await Promise.all([
        contractAPI.getPaging({
          skip: 0,
          take: 100000,
          filters: contractStore.defaultFilters,
          sorts: contractStore.defaultSorts,
        }),
        roomStore.getAllItems(),
        roomCategoryStore.getAllItems(buildingId),
        getBuildingServiceFees(),
        getBuildingResidents(buildingId),
        getVehicles(),
        getBuildingVehicleFees(),
      ]);

      const contracts = contractResult?.data ?? [];
      if (!contracts.length) {
        showMessage("Chưa có hợp đồng để sinh thu phí", MessageType.Warning);
        return;
      }

      const currentFeesBeforeGenerate = await getCurrentFees();
      const currentMonthContractIds = new Set(
        getCurrentMonthFees(currentFeesBeforeGenerate).map(
          (fee) => fee.contract_id
        )
      );

      if (
        contracts.every((contract) =>
          currentMonthContractIds.has(contract.contract_id)
        )
      ) {
        showMessage(
          "đã sinh đủ chi phí của tháng này, xin chờ đến tháng tiếp theo",
          MessageType.Warning
        );
        return;
      }

      await store.genFees(buildingId);

      const roomById = rooms.reduce((result, room) => {
        result[room.room_id] = room;
        return result;
      }, {});
      const vehicleTotalByRoom = calculateVehicleTotalByRoom(
        vehicles,
        residents,
        vehicleFees
      );

      let feeByContractId = getFeeByContractId(
        getCurrentMonthFees(await getCurrentFees())
      );

      const buildFeePayload = (contract, fee) => {
        const room = roomById[contract.room_id] ?? {};
        const roomPrice = getRoomPrice(contract, room, roomCategories);
        const serviceTotal = calculateFixedServiceTotal(serviceFees, room);
        const vehicleTotal = vehicleTotalByRoom[contract.room_id] ?? 0;

        return {
          fee_id: fee?.fee_id,
          building_id: buildingId,
          contract_id: contract.contract_id,
          contract_code: contract.contract_code,
          room_id: contract.room_id,
          room_code: contract.room_code,
          room_name: contract.room_name,
          room_price: roomPrice,
          room_area: parseNumber(room.room_area),
          member_count: parseNumber(room.member_count),
          from_date: getStartDate(),
          expired_date: getDueDate(),
          total_fee: roomPrice + serviceTotal + vehicleTotal,
          received_fee: parseNumber(fee?.received_fee),
          fee_status: fee?.fee_status ?? FeeStatus.NotYet,
          electric_water: fee?.electric_water || getStoredElectricWater(fee?.fee_id),
        };
      };

      let missingContracts = contracts.filter(
        (contract) => !feeByContractId[contract.contract_id]
      );

      if (missingContracts.length) {
        await Promise.all(
          missingContracts.map((contract) =>
            store.insertAsync(buildFeePayload(contract))
          )
        );

        feeByContractId = getFeeByContractId(
          getCurrentMonthFees(await getCurrentFees())
        );
        missingContracts = contracts.filter(
          (contract) => !feeByContractId[contract.contract_id]
        );
      }

      const createdContracts = contracts.filter(
        (contract) => feeByContractId[contract.contract_id]
      );

      await Promise.all(
        createdContracts.map((contract) =>
          store.putAsync(
            buildFeePayload(contract, feeByContractId[contract.contract_id])
          )
        )
      );

      if (missingContracts.length) {
        showMessage(
          `Đã sinh ${createdContracts.length}/${contracts.length} khoản thu phí. Chưa sinh được: ${missingContracts
            .map((contract) => contract.contract_code)
            .join(", ")}`,
          MessageType.Warning
        );
      } else {
        showMessage(`Đã sinh ${contracts.length} khoản thu phí`);
      }
      await me.refresh();
    } catch (error) {
      console.log(error);
      showMessage("Có lỗi xảy ra khi sinh thu phí", MessageType.Error);
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
