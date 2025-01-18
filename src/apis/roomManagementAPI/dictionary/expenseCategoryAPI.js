import CrudAPI from "@/apis/crudAPI";

const END_POINT = "ExpenseCategories";
class ExpenseCategoryAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new ExpenseCategoryAPI();
