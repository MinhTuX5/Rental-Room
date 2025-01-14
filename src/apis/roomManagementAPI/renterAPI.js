import CrudAPI from "@/apis/crudAPI";

const END_POINT = "renters";
class RenterAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  async linkToBuilding(payload) {
    const res = await this.postAsync(payload, "/linking");
    return res.data;
  }
}

export default new RenterAPI();
