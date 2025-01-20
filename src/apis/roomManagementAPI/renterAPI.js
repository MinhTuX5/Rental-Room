import CrudAPI from "@/apis/crudAPI";

const END_POINT = "renters";
class RenterAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  async linkToRoom(payload) {
    const res = await this.postAsync(payload, "/linking");
    return res.data;
  }

  async linkToAccount(payload) {
    const res = await this.postAsync(payload, "/account-linking");
    return res.data;
  }
  async createRoomLinking(payload) {
    const res = await this.postAsync(payload, "/room-linking");
    return res.data;
  }
}

export default new RenterAPI();
