import CrudAPI from "@/apis/crudAPI";

const END_POINT = "Fees";
class FeeAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  genFees(buildingID) {
    try {
      const res = this.getAsync({}, `/fees/${buildingID}`);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async pay(payload) {
    await this.postAsync(payload, "/payment");
  }

  async getPaymentInfo(payload) {
    var result = await this.postAsync(payload, "/new");
    return result.data;
  }
}

export default new FeeAPI();
