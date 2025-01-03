import CrudAPI from "@/apis/crudAPI";

const END_POINT = "Contracts";
class ContractAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new ContractAPI();