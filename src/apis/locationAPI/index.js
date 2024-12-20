import BaseAPI from "@/apis/baseAPI";

const END_POINT = "Location";

class LocationAPI extends BaseAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  /**
   * Lấy tất cả vị trí
   */
  async getAllLocations() {
    try {
      const res = await this.getAsync();
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new LocationAPI();
