import CrudAPI from "@/apis/crudAPI";

const END_POINT = "RoomPosts";
class RoomPostAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  lovePost(favoritePostParam) {
    try {
      const res = this.postAsync(favoritePostParam, "/favorite-post");
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description Lấy danh sách các bài đã đăng
   * @param {String} userID
   */
  async getMyPosts(userID) {
    try {
      const res = await this.getAsync(null, `/my-posts/${userID}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new RoomPostAPI();
