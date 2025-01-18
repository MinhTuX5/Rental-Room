import CrudAPI from "@/apis/crudAPI";
import FilterOperator from "../../common/enum/FilterOperator";

const END_POINT = "Notifications";
class NotificationAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  sendNotify(notification) {
    try {
      const res = this.postAsync(notification);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  readNotify(notificationId) {
    try {
      const res = this.getAsync({}, `/${notificationId}`);
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  async getPaging(userId) {
    const payload = {
      skip: 0,
      take: 20,
      Filters: [
        {
          Field: "to_user_id",
          Value: userId,
          Operator: FilterOperator.Equal,
        },
      ],
      Sorts: [
        {
          Column: "created_at",
          IsAscending: false,
        },
        {
          Column: "read_at",
        },
      ],
    };
    var response = await this.postAsync(payload, `/list`);
    return response.data;
  }
}

export default new NotificationAPI();
