import CrudAPI from "@/apis/crudAPI";

const END_POINT = "Expenses";
class ExpenseAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
  
  async getExpenseStatistic(payload) {
    var res = await this.postAsync(payload, "/statistic");
    return res.data;
  }
}

export default new ExpenseAPI();