import CrudAPI from "@/apis/crudAPI";

const END_POINT = "Buildings";
class BuildingAPI extends CrudAPI {
  constructor() {
    super(END_POINT);
  }

  async setActive(buildingId) {
    return await this.httpClient.patch(`${this.endPoint}/${buildingId}/set-active`);
  }
}

export default new BuildingAPI();