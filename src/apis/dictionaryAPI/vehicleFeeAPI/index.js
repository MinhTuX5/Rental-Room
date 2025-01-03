import CrudAPI from "@/apis/crudAPI";

const END_POINT = "VehicleFee";
class VehicleFeeAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new VehicleFeeAPI();
