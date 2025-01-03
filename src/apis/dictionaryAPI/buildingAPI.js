import CrudAPI from "@/apis/crudAPI";

const END_POINT = "Buildings";
class BuildingAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new BuildingAPI();