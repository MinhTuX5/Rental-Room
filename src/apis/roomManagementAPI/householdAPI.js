import CrudAPI from "@/apis/crudAPI";

const END_POINT = "Households";
class HouseholdAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new HouseholdAPI();