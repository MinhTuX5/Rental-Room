import BaseAPI from "@/apis/baseAPI";

export default class CrudAPI extends BaseAPI {
  async getById(id) {
    var response = await this.getAsync({}, `/${id}`);
    return response.data;
  }

  async getPaging(config) {
    var response = await this.postAsync(config, `/list`);
    return response.data;
  }

  async getNew() {
    var response = await this.getAsync({}, `/new`);
    return response.data;
  }
}
