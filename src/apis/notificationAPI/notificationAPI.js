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
      skip: 0,              // Bắt đầu từ bản ghi thứ 0
      take: 20,             // Lấy 20 bản ghi
      Filters: [{           // Lọc theo userId
        Field: "to_user_id",
        Value: userId,
        Operator: FilterOperator.Equal,
      }],
      Sorts: [{             // Sắp xếp theo created_at (mới nhất trước)
        Column: "created_at",
        IsAscending: false,
      }, {                  // Sắp xếp theo read_at
        Column: "read_at",
      }],
    };
    var response = await this.postAsync(payload, `/list`);
    return response.data;
  }
}

export default new NotificationAPI();
