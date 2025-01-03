import CrudAPI from "@/apis/crudAPI";

const END_POINT = "RoomCategories";
class RoomCategoryAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new RoomCategoryAPI();
