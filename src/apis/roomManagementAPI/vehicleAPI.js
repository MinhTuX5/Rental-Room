import CrudAPI from "@/apis/crudAPI";

const END_POINT = "vehicles";
class VehicleAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new VehicleAPI();