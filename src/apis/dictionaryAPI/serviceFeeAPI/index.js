import CrudAPI from "@/apis/crudAPI";

const END_POINT = "ServiceFee";
class ServiceFeeAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new ServiceFeeAPI();