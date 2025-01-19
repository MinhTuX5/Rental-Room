import CrudAPI from "@/apis/crudAPI";

const END_POINT = "AppointmentSchedules";
class AppointmentScheduleAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }
}

export default new AppointmentScheduleAPI();