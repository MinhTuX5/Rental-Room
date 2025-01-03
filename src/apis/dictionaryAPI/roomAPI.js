import CrudAPI from "@/apis/crudAPI";

const END_POINT = "Rooms";
class RoomAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new RoomAPI();