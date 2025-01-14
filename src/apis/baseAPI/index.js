import httpClient from "../httpClient";

export default class BaseAPI {
  endPoint = "";
  httpClient = httpClient;
  constructor(endPoint) {
    this.endPoint = endPoint;
  }

  async getAsync(config, apiPath = "") {
    config = config ?? {};
    const params = {
      ...config,
    };
    return await httpClient.get(this.endPoint + apiPath, { params });
  }

  async postAsync(payload, apiPath = "") {
    const response = await httpClient.post(this.endPoint + apiPath, payload);
    return response;
  }

  async deleteAsync(id) {
    return await httpClient.delete(`${this.endPoint}/${id}`);
  }

  async putAsync(payload, apiPath = "") {
    return await httpClient.put(this.endPoint + apiPath, payload);
  }
}
